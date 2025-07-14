import React from "react";

export default function MenuItemCard({ item, quantity, addToCart, setCart }) {
  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4 flex justify-between items-center gap-4">
      <div className="flex-1">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">{item.name}</h4>
        <p className="text-gray-600 dark:text-gray-300 font-medium">₹{item.price}</p>
        {item.description && (
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{item.description}</p>
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        {item.imageUrl && (
          <img src={`${item.imageUrl}`} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
        )}
        {quantity > 0 ? (
          <div className="flex items-center gap-2 border rounded px-2 py-1">
            <button onClick={() =>
              setCart((prev) =>
                prev.map((i) =>
                  i.id === item.id
                    ? { ...i, quantity: i.quantity - 1 }
                    : i
                ).filter((i) => i.quantity > 0)
              )
            } className="text-xl font-bold text-gray-700 dark:text-gray-100">–</button>
            <span className="font-semibold">{quantity}</span>
            <button onClick={() =>
              setCart((prev) =>
                prev.map((i) =>
                  i.id === item.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                )
              )
            } className="text-xl font-bold text-gray-700 dark:text-gray-100">+</button>
          </div>
        ) : (
          <button onClick={() => addToCart(item)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm">
            Add
          </button>
        )}
      </div>
    </div>
  );
}
