import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlinePrinter } from "react-icons/ai";
import { MdCheckCircle } from "react-icons/md";

const statusFlow = ["PLACED", "COOKING", "READY", "SERVED"];

export default function OrderTable() {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ error, setError] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("orderId");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/owner/orders/all");
      const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
      setError("");
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      setError("❌ Failed to fetch orders. Please try again.");
    }
  };

  const updateOrder = async (orderId, newStatus) => {
    try {
      await axios.put(`/owner/orders/${orderId}/status`, undefined, {
        params: { newStatus },
      });
      fetchOrders();
    } catch (err) {
      console.error("❌ Failed to update order:", err);
      setError("❌ Failed to update order status.");
    }
  };

  const onViewOrder = (order) => {
    alert(`Order ID: ${order.orderId}\nCustomer: ${order.customerName || "N/A"}\nTotal: ₹${order.totalAmount.toFixed(2)}\nStatus: ${order.status}`);
  };

  const onPrintOrder = async (order) => {
    try {
      const { data } = await axios.get(`/owner/orders/${order.orderId}/details`);
      const { summary, items } = data;
      const res = await axios.get("/owner/details");
      const { restaurantName, gstin, address } = res.data;

      const billRows = items.map((item) => {
        const total = item.quantity * item.price;
        const tax = (total * 0.18).toFixed(2);
        const amount = (total + parseFloat(tax)).toFixed(2);
        return `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${tax}</td>
            <td>₹${amount}</td>
          </tr>
        `;
      }).join("");

      const billWindow = window.open("", "Print Bill", "width=600,height=800");
      if (billWindow) {
        billWindow.document.write(`
          <html>
            <head>
              <title>Bill - Order ${summary.orderId}</title>
              <style>
                body { font-family: sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
                th { background-color: #f0f0f0; }
              </style>
            </head>
            <body>
              <h2>${restaurantName || "Restaurant Name"}</h2>
              <p><strong>GSTIN:</strong> ${gstin || "N/A"}</p>
              <p><strong>Address:</strong> ${address || "N/A"}</p>
              <hr />
              <p><strong>Invoice No:</strong> ${summary.invoiceNumber || "N/A"}</p>
              <p><strong>Order ID:</strong> ${summary.orderId}</p>
              <p><strong>Table:</strong> ${summary.tableNumber}</p>
              <p><strong>Customer:</strong> ${summary.customerName || "N/A"}</p>
              <p><strong>Date:</strong> ${new Date(summary.createdAt).toLocaleString()}</p>

              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Tax</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${billRows}
                </tbody>
              </table>

              <p style="margin-top:20px;"><strong>Total:</strong> ₹${summary.totalAmount.toFixed(2)}</p>
              <p>✅ Thank you for dining with us!</p>

              <script>
                setTimeout(() => window.print(), 500);
              </script>
            </body>
          </html>
        `);
        billWindow.document.close();
      }
    } catch (error) {
      console.error("❌ Failed to print bill:", error);
      alert("Failed to fetch order/restaurant details for printing.");
    }
  };

  const getFilteredOrders = () => {
    const now = new Date();
    let filtered = orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);

        if (filterOption === "today") {
          return orderDate.toDateString() === now.toDateString();
        } else if (filterOption === "yesterday") {
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          return orderDate.toDateString() === yesterday.toDateString();
        } else if (filterOption === "month") {
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        }

        if (selectedDate) {
          return orderDate.toDateString() === new Date(selectedDate).toDateString();
        }

        return true;
      })
      .filter((order) => {
        const keyword = searchText.toLowerCase();
        if (!keyword) return true;

        if (searchBy === "orderId") {
          return order.orderId.toLowerCase().includes(keyword);
        } else if (searchBy === "tableNumber") {
          return order.tableNumber.toString().includes(keyword);
        } else if (searchBy === "customerName") {
          return (order.customerName || "").toLowerCase().includes(keyword);
        } else if (searchBy === "invoiceNumber") {
          return order.invoiceNumber?.toLowerCase().includes(keyword);
        }

        return true;
      });

    if (sortBy === "invoice-asc") {
      filtered.sort((a, b) => (a.invoiceNumber || "").localeCompare(b.invoiceNumber || ""));
    } else if (sortBy === "invoice-desc") {
      filtered.sort((a, b) => (b.invoiceNumber || "").localeCompare(a.invoiceNumber || ""));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [setError]);

return (
  <div className="text-gray-800 dark:text-gray-100">
    {/* Header Row: Title + Filter Toggle + Search */}
    <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
      {/* Title + Toggle Button (Left) */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Orders</h2>
        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded shadow-sm transition"
        >
          {showFilterPanel ? "Hide Filters ▲" : "Show Filters ▼"}
        </button>
      </div>

      {/* Search Inputs (Right) */}
      <div className="flex items-center gap-2 ml-auto">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border px-3 py-1 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="orderId">Order ID</option>
          <option value="tableNumber">Table No</option>
          <option value="customerName">Customer</option>
          <option value="invoiceNumber">Invoice</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border px-3 py-1 rounded w-56 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>
    </div>

    {/* Filter Panel */}
    {showFilterPanel && (
      <div className="mb-6 flex flex-wrap items-start gap-6 p-4 bg-gray-100 dark:bg-gray-800 rounded shadow-sm">
        {/* Filter Options */}
        <div className="flex flex-col gap-4">
          {/* Filter by Dropdown */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700 dark:text-gray-300">Filter Orders:</label>
            <select
              value={filterOption}
              onChange={(e) => {
                setFilterOption(e.target.value);
                setSelectedDate("");
              }}
              className="border px-3 py-1 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Pick a Date */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700 dark:text-gray-300">Pick a Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setFilterOption("all");
              }}
              className="border px-3 py-1 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700 dark:text-gray-300">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-1 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="newest">Newest First</option>
            <option value="invoice-asc">Invoice Number ↑</option>
            <option value="invoice-desc">Invoice Number ↓</option>
          </select>
        </div>
      </div>
    )}

    {/* Order Cards */}
    <div className="grid gap-4">
      {getFilteredOrders().map((o, index) => {
        const currentIndex = statusFlow.indexOf(o.status);
        const nextStatus = statusFlow[currentIndex + 1];

        return (
          <div
            key={o.orderId}
            className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow-md p-4 border hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-wrap justify-between items-center gap-4">
              {/* Order Info */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order #{index + 1} -{" "}
                  <span className="font-medium text-gray-800 dark:text-white">{o.orderId}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Table: <strong>{o.tableNumber}</strong> | Customer:{" "}
                  <strong>{o.customerName || "N/A"}</strong>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Payment: <strong>{o.paymentMode}</strong> | Total:{" "}
                  <strong>₹{o.totalAmount.toFixed(2)}</strong>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Invoice: <strong>{o.invoiceNumber}</strong>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date:{" "}
                  {new Date(o.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                    {o.status}
                  </span>

                  {nextStatus ? (
                    <button
                      onClick={() => updateOrder(o.orderId, nextStatus)}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      ➡ {nextStatus}
                    </button>
                  ) : (
                    <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                      <MdCheckCircle className="text-base" />
                      Completed
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewOrder(o)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <HiOutlineDocumentText className="text-sm" />
                    View
                  </button>

                  <button
                    onClick={() => onPrintOrder(o)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <AiOutlinePrinter className="text-sm" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};

