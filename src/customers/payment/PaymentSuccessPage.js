import React from "react";
import { Link } from "react-router-dom";

function PaymentSuccessPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Payment Successful!</h1>
      <p className="text-gray-700 mb-6">Thank you for your order. Your food will be served shortly.</p>
      <Link to="/" className="bg-green-600 text-white px-4 py-2 rounded">Go to Home</Link>
    </div>
  );
}

export default PaymentSuccessPage;
