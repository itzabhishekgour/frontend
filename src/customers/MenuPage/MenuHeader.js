import React from "react";
import { FaBars } from "react-icons/fa";

export default function MenuHeader({ restaurantName, tableNumber, identity, error, onMenuClick }) {
  return (
    <div className="text-center my-4">
      <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2">
        <FaBars /> Menu
      </h1>
      {restaurantName && tableNumber && (
        <p className="text-gray-700 dark:text-gray-300 text-lg mt-1">
          {restaurantName} × Table <strong>{tableNumber}</strong>
        </p>
      )}
      {identity && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Signed in as: {identity}
        </p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        onClick={onMenuClick}
        className="absolute top-4 right-4 bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded shadow z-50"
      >
        <FaBars />
      </button>
    </div>
  );
}
