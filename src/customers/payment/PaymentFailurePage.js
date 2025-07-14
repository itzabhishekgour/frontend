import React from "react";
import { Link } from "react-router-dom";


function PaymentFailurePage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Failed</h1>
      <p className="text-gray-700 mb-6">Something went wrong. Please try again.</p>
      <Link to="/customer/cart" className="bg-red-600 text-white px-4 py-2 rounded">Go Back</Link>
    </div>
  );
}

export default PaymentFailurePage;
