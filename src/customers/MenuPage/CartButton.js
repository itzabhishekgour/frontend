import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

export default function CartButton({ cart, tableId }) {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-4 left-0 w-full flex justify-center z-50">
      <button
        onClick={() => navigate("/customer/cart", { state: { cart, tableId } })}
        className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg text-lg font-semibold flex items-center gap-2"
      >
        <FaShoppingCart /> {cart.reduce((sum, i) => sum + i.quantity, 0)} item{cart.length > 1 ? "s" : ""} added · VIEW CART
      </button>
    </div>
  );
}
