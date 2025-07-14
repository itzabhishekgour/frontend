import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { AiOutlineTable, AiOutlineLock, AiOutlineCheckCircle } from "react-icons/ai";
import { MdLockOpen } from "react-icons/md";
import { useToast } from "../hooks/useToast"; // ✅ Adjust path if needed

const tableImage =
  "https://www.shutterstock.com/image-vector/dining-table-chairs-line-icon-600nw-2462152489.jpg";

const TableBlockerView = ({ setSuccessMsg, setError }) => {
  const [tables, setTables] = useState([]);
  const { showToast } = useToast(); // ✅ Use custom toast hook

  const fetchTables = () => {
    axios.get("/owner/table/all").then((res) => setTables(res.data));
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const toggleBlock = async (table) => {
    try {
      await axios.put(`/owner/table/toggle-block/${table.id}`);
      const isNowBlocked = !table.blocked;

      showToast(
        `Table ${table.tableNumber} is now ${isNowBlocked ? "Blocked" : "Available"}`,
        isNowBlocked ? "warning" : "success"
      );

      fetchTables();
    } catch (error) {
      showToast("❌ Failed to update table block status", "error");
      setError?.("❌ Failed to update table block status"); // optional chaining
    }
  };

  return (
    <div>
      <h3 className="flex items-center text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 gap-2">
        <AiOutlineTable size={24} />
        Table Management View
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
          >
            {/* Optional image */}
            {/* <img src={tableImage} alt={`Table ${table.tableNumber}`} className="w-full h-40 object-cover" /> */}

            <div className="p-4 text-center space-y-2">
              <h4 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                Table {table.tableNumber}
              </h4>

              <p
                className={`flex items-center justify-center gap-2 font-semibold ${
                  table.blocked ? "text-red-600" : "text-green-600"
                }`}
              >
                {table.blocked ? (
                  <>
                    <AiOutlineLock />
                    Blocked
                  </>
                ) : (
                  <>
                    <AiOutlineCheckCircle />
                    Available
                  </>
                )}
              </p>

              <button
                onClick={() => toggleBlock(table)}
                className={`w-full py-2 rounded-lg font-medium text-white transition-all ${
                  table.blocked
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {table.blocked ? (
                  <span className="flex items-center justify-center gap-2">
                    <MdLockOpen />
                    Unblock
                  </span>
                ) : (
                  "Block"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableBlockerView;
