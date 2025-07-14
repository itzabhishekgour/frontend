import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [tableId, setTableId] = useState(null);

  useEffect(() => {
    const fetchTableId = async () => {
      try {
        const res = await axios.get(`/customer/order/table-id/${orderId}`);
        setTableId(res.data.tableId);

        // Auto-redirect to order status
        setTimeout(() => {
          navigate(`/customer/order/status?tableId=${res.data.tableId}`);
        }, 3000);
      } catch (err) {
        console.error("Failed to fetch table ID", err);
      }
    };

    if (orderId) fetchTableId();
  }, [orderId, navigate]);

  const handleTrackOrder = () => {
    console.log("your table id" + tableId);
    if (tableId) {
      navigate(`/customer/order/status?tableId=${tableId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 px-4">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">✅ Payment Successful!</h1>
        <p className="text-gray-700 mb-2">Thank you for your order.</p>
        <p className="text-gray-600 text-sm mb-4">Redirecting to order status page...</p>

        <button
          onClick={handleTrackOrder}
        //   disabled={!tableId}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          📍 Track Order Status
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
