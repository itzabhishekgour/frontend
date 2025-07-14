import React, { useRef } from "react";
import CategoryScrollNav from "./CategoryScrollNav";

const MenuCategoryList = ({ menu, cart, addToCart, setCart }) => {
  const categoryRefs = useRef({});

  return (
    <div className="relative">
      <div className="max-w-3xl mx-auto">
        {/* Top Heading Row with Title and Button */}
        <div className="flex items-center justify-between mt-4 mb-6 px-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Menu</h1>
          {/* Inline Categories Button */}
          <CategoryScrollNav menu={menu} categoryRefs={categoryRefs} inline />
        </div>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto">
        {Object.entries(menu).map(([category, items]) => (
          <div
            key={category}
            ref={(el) => (categoryRefs.current[category] = el)}
            className="scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {category}
            </h2>
            <div className="space-y-4">
              {items.map((item) => {
                const cartItem = cart.find((ci) => ci.id === item.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-700 shadow rounded-lg p-4 flex justify-between items-center gap-4"
                  >
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {item.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">₹{item.price}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )}
                      {quantity > 0 ? (
                        <div className="flex items-center gap-2 border rounded px-2 py-1">
                          <button
                            onClick={() =>
                              setCart((prev) =>
                                prev
                                  .map((i) =>
                                    i.id === item.id
                                      ? { ...i, quantity: i.quantity - 1 }
                                      : i
                                  )
                                  .filter((i) => i.quantity > 0)
                              )
                            }
                            className="text-xl font-bold text-gray-700 dark:text-gray-100"
                          >
                            –
                          </button>
                          <span className="font-semibold">{quantity}</span>
                          <button
                            onClick={() =>
                              setCart((prev) =>
                                prev.map((i) =>
                                  i.id === item.id
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                                )
                              )
                            }
                            className="text-xl font-bold text-gray-700 dark:text-gray-100"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCategoryList;
