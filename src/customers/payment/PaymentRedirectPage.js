import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "../../api/axiosInstance";

function PaymentRedirectPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tableId from query params like: /payment/status/ORD123?tableId=abcd
  const params = new URLSearchParams(location.search);
  const tableId = params.get("tableId");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get(`/customer/payment/status`);
        console.log(res.data.state);
        const status = res.data.state;

        if (status === "COMPLETED" && tableId) {
          navigate(`/customer/order/status?paymentStatus=success&tableId=${tableId}`);
        } else {
          navigate(`/payment/failure`);
        }
      } catch (err) {
        console.error("❌ Error checking payment status", err);
        navigate(`/payment/failure`);
      }
    };

    checkStatus();
  }, [orderId, tableId, navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-lg font-medium text-gray-700">
      ⏳ Verifying your payment...
    </div>
  );
}

export default PaymentRedirectPage;
