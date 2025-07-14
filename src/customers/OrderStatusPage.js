import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const statusSteps = ["PLACED", "COOKING", "READY", "SERVED"];

function OrderStatusPage() {
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState("");
  const [tableId, setTableId] = useState("");
  const [amount, setAmount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: true,
  });

  const hasConfirmed = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId");
    const tableId = urlParams.get("tableId");

    if (!orderId || !tableId) return;

    axios
      .get(`/customer/payment/status?orderId=${orderId}`)
      .then((res) => {
        console.log("📦 Payment check response", res.data);
        const isCompleted =
          res.data?.state === "COMPLETED" ||
          res.data?.paymentDetails?.[0]?.state === "COMPLETED";

        if (isCompleted) {
          if (!hasConfirmed.current) {
            const stored = sessionStorage.getItem("pendingOrder");
            if (stored) {
              hasConfirmed.current = true;
              const payload = JSON.parse(stored);
              axios
                .post("/customer/order/confirm", payload)
                .then(() => {
                  setPopup({
                    show: true,
                    message: "✅ Order Confirmed & Saved!",
                    success: true,
                  });
                  sessionStorage.removeItem("pendingOrder");
                })
                .catch(() => {
                  setPopup({
                    show: true,
                    message: "❌ Order confirmation failed.",
                    success: false,
                  });
                });
            }
          }
        } else {
          setPopup({
            show: true,
            message: "❌ Payment not completed.",
            success: false,
          });
          setTimeout(() => navigate("/payment/failure"), 2000);
        }
      })
      .catch((err) => {
        console.error("❌ Payment check error", err);
        setPopup({
          show: true,
          message: "❌ Failed to check payment.",
          success: false,
        });
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tid = params.get("tableId");
    if (!tid) {
      setError("Table ID is missing.");
      return;
    }
    setTableId(tid);

    const fetchStatus = () => {
      axios
        .get(`/customer/order/status/${tid}`)
        .then((res) => {
          setStatusData(res.data);
          setAmount(res.data.totalAmount);
        })
        .catch(() => setError("Unable to fetch order status."));
    };

    fetchStatus();
    const intervalId = setInterval(fetchStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchHistory = () => {
    setHistoryError("");
    axios
      .get(`/customer/order/history/${tableId}`)
      .then((res) => {
        setHistory(res.data);
        setShowHistory(true);
      })
      .catch(() => {
        setHistoryError("Unable to fetch history.");
        setShowHistory(true);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">🧾 Order Status</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {statusData ? (
          <div className="space-y-3">
            {/* Progress */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Progress</h3>
              <div className="relative flex items-center justify-between">
                <div className="absolute top-3 left-3 right-3 h-1 bg-gray-300 rounded z-0"></div>
                <div
                  className="absolute top-3 left-3 h-1 bg-green-500 rounded z-10 transition-all duration-700 ease-in-out"
                  style={{
                    width: `${
                      (statusSteps.indexOf(statusData.status) /
                        (statusSteps.length - 1)) *
                      100
                    }%`,
                  }}
                ></div>
                {statusSteps.map((step, index) => {
                  const isCompleted =
                    statusSteps.indexOf(statusData.status) > index;
                  const isCurrent = statusData.status === step;
                  return (
                    <div
                      key={step}
                      className="flex-1 flex flex-col items-center relative z-20"
                    >
                      <div
                        className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs mt-1 text-center">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Info */}
            <p><span className="font-medium">Order ID:</span> {statusData.orderId}</p>
            <p><span className="font-medium">Status:</span> {statusData.status}</p>
            <p><span className="font-medium">Placed At:</span> {new Date(statusData.createdAt).toLocaleString()}</p>

            {/* Payment Info */}
            {statusData.paymentMethod === "ONLINE" ? (
              <>
                <p><span className="font-medium">Transaction ID:</span> {statusData.transactionId || "–"}</p>
                <p><span className="font-medium">Merchant ID:</span> {statusData.merchantId || "–"}</p>
                <p><span className="font-medium">Reference ID:</span> {statusData.providerReferenceId || "–"}</p>
              </>
            ) : (
              <>
                <p><span className="font-medium">Customer Name:</span> {statusData.customerName || "–"}</p>
                <p><span className="font-medium">Phone:</span> {statusData.phoneNumber || "–"}</p>
              </>
            )}

            {/* Amounts */}
            <p><span className="font-medium">Subtotal:</span> ₹{(amount / 1.18 / 100).toFixed(2)}</p>
            <p><span className="font-medium">GST (18%):</span> ₹{((amount - amount / 1.18) / 100).toFixed(2)}</p>
            <h3 className="text-lg font-bold"><span className="font-medium">Total Amount:</span> ₹{(amount / 100).toFixed(2)}</h3>

            {/* Items */}
            {statusData.items?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">🧾 Items Ordered</h3>
                <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 border-b">Item</th>
                      <th className="px-3 py-2 border-b">Qty</th>
                      <th className="px-3 py-2 border-b">Price (₹)</th>
                      <th className="px-3 py-2 border-b">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusData.items.map((item, idx) => (
                      <tr key={idx} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-3 py-2 border-b">{item.name}</td>
                        <td className="px-3 py-2 border-b">{item.quantity}</td>
                        <td className="px-3 py-2 border-b">₹{Number(item.price).toFixed(2)}</td>
                        <td className="px-3 py-2 border-b">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button
              onClick={fetchHistory}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              See Your Previous Orders
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Loading status...</p>
        )}
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg mx-auto p-6">
            <h3 className="text-xl font-semibold mb-4">📜 Order History</h3>
            {historyError && <p className="text-red-500 mb-4">{historyError}</p>}
            {!historyError && history.length === 0 && (
              <p className="text-gray-600">No previous orders found.</p>
            )}
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((o) => (
                <li key={o.orderId} className="border-b pb-2">
                  <p><span className="font-medium">Order ID:</span> {o.orderId}</p>
                  <p><span className="font-medium">Table:</span> {o.tableNumber}</p>
                  <p><span className="font-medium">Name:</span> {o.customerName || "–"}</p>
                  <p><span className="font-medium">Status:</span> {o.status}</p>
                  <p><span className="font-medium">Amount:</span> ₹{(o.totalAmount / 100).toFixed(2)}</p>
                  <p><span className="font-medium">When:</span> {new Date(o.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowHistory(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup */}
      {popup.show && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div
            className={`bg-white rounded-lg p-6 w-full max-w-sm shadow-lg transition-all duration-300 ${
              popup.success ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
            }`}
          >
            <p className="text-lg font-medium text-gray-800">{popup.message}</p>
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderStatusPage;
