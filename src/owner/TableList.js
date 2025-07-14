import React, { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "../api/axiosInstance"; // Adjust path if needed
import { useToast } from "../hooks/useToast"; // Your custom toast hook
import {
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePrinter,
  AiOutlineLink,
} from "react-icons/ai";

// TableList component
const TableList = () => {
  const [tables, setTables] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [newTable, setNewTable] = useState("");
  const { showToast } = useToast();

  // Fetch tables from backend
  const fetchTables = useCallback(() => {
    axios
      .get("/owner/table/all")
      .then((res) => setTables(res.data))
      .catch(() => showToast("❌ Failed to load tables.", "error"));
  }, [showToast]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Add new table handler
  const handleAddTable = () => {
    if (!newTable.trim()) {
      showToast("Table number cannot be empty.", "error");
      return;
    }
    const tableNum = parseInt(newTable.trim(), 10);
    if (isNaN(tableNum) || tableNum <= 0) {
      showToast("Please enter a valid positive number for the table.", "error");
      return;
    }
    axios
      .post("/owner/table/add", { tableNumber: tableNum })
      .then(() => {
        setNewTable("");
        fetchTables();
        showToast(`Table ${tableNum} added successfully!`, "success");
      })
      .catch((error) => {
        console.error("Error adding table:", error);
        showToast(
          "❌ Failed to add table. It might already exist or there's a server error.",
          "error"
        );
      });
  };

  // Edit table handler
  const handleEdit = (table) => {
    const newNumStr = prompt("Enter new table number", table.tableNumber.toString());
    if (newNumStr === null) return; // User cancelled
    const newNum = parseInt(newNumStr.trim(), 10);
    if (isNaN(newNum) || newNum <= 0) {
      showToast("Invalid table number. Please enter a positive number.", "error");
      return;
    }
    axios
      .put(`/owner/table/${table.id}`, null, {
        params: { newTableNumber: newNum },
      })
      .then(() => {
        fetchTables();
        showToast(`Table ${table.tableNumber} updated to ${newNum}.`, "success");
      })
      .catch((error) => {
        console.error("Error updating table:", error);
        showToast("❌ Failed to update table. It might already exist.", "error");
      });
  };

  // Delete table handler
  const handleDelete = (table) => {
    if (window.confirm(`Are you sure you want to delete Table ${table.tableNumber}?`)) {
      axios
        .delete(`/owner/table/${table.id}`)
        .then(() => {
          fetchTables();
          showToast(`Table ${table.tableNumber} deleted successfully.`, "success");
        })
        .catch((error) => {
          console.error("Error deleting table:", error);
          showToast("❌ Failed to delete table. It might have associated orders.", "error");
        });
    }
  };

  // Print QR code for table
  const handlePrintQR = (table) => {
    const qrUrl = `${window.location.origin}/customer/menu?tableId=${table.id}`;
    const printWindow = window.open("", "_blank", "width=400,height=500");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR - Table ${table.tableNumber}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 98vh;
                font-family: sans-serif;
                margin: 0;
                padding: 0;
              }
              h2 {
                margin-bottom: 20px;
                color: #333;
              }
              #qrcode {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 8px;
                background-color: #fff;
              }
              @media print {
                body {
                  height: auto;
                }
              }
            </style>
          </head>
          <body>
            <h2>Table ${table.tableNumber}</h2>
            <div id="qrcode"></div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
            <script>
              new QRCode(document.getElementById("qrcode"), {
                text: "${qrUrl}",
                width: 200,
                height: 200,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
              });
              setTimeout(() => {
                window.print();
                window.onafterprint = () => window.close();
              }, 600);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      showToast(`QR Code for Table ${table.tableNumber} opened for printing.`, "info");
    } else {
      showToast("❌ Pop-up blocked! Please allow pop-ups to print QR codes.", "error");
    }
  };

  // Filter tables by search text
  const filteredTables = tables.filter((t) =>
    t.tableNumber.toString().includes(searchText.trim())
  );

  return (
    <div className="space-y-6">
      {/* Add + Search Section */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="number"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          placeholder="Table Number"
          className="border rounded px-3 py-2 w-full sm:w-48 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
        />
        <button
          onClick={handleAddTable}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md transition-colors duration-200"
          aria-label="Add Table"
        >
          <AiOutlinePlus size={20} />
          Add Table
        </button>

        <div className="relative ml-auto w-full sm:w-64">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search Table by Number"
            className="w-full border rounded px-3 py-2 pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none">
            <AiOutlineSearch size={20} />
          </span>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {filteredTables.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 col-span-full text-center py-8">
            No tables found. {searchText ? "Try a different search." : "Add a new table above!"}
          </p>
        ) : (
          filteredTables.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg flex flex-col sm:flex-row items-center justify-between transition-transform transform hover:scale-105"
            >
              {/* QR code */}
              <div
                onClick={() => handlePrintQR(t)}
                className="cursor-pointer flex flex-col items-center mb-4 sm:mb-0 sm:mr-4"
                title={`Print QR for Table ${t.tableNumber}`}
              >
                <QRCodeCanvas
                  value={`${window.location.origin}/customer/menu?tableId=${t.id}`}
                  size={96}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
                <p className="text-xs mt-2 text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                  <AiOutlinePrinter size={14} />
                  Click to Print QR
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center gap-2 text-center flex-grow">
                <h4 className="font-bold text-xl dark:text-white mb-2">Table {t.tableNumber}</h4>
                <button
                  onClick={() => handleEdit(t)}
                  className="flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm w-full max-w-[120px] transition-colors duration-200"
                  aria-label={`Edit Table ${t.tableNumber}`}
                >
                  <AiOutlineEdit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm w-full max-w-[120px] transition-colors duration-200"
                  aria-label={`Delete Table ${t.tableNumber}`}
                >
                  <AiOutlineDelete size={16} />
                  Delete
                </button>
                <p
                  className="text-blue-600 dark:text-blue-400 flex items-center cursor-pointer hover:underline text-sm mt-1"
                  onClick={() =>
                    window.open(`${window.location.origin}/customer/menu?tableId=${t.id}`, "_blank")
                  }
                >
                  <AiOutlineLink size={16} className="mr-1" />
                  Open Customer Menu
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TableList;

