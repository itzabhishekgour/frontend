import React, { useState } from "react";

const CategoryScrollNav = ({ menu, categoryRefs, inline = false }) => {
  const [show, setShow] = useState(false);

  const handleScrollTo = (category) => {
    categoryRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setShow(false);
  };

  if (inline) {
    return (
      <div className="relative">
        <button
          onClick={() => setShow((prev) => !prev)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow"
        >
          📂 Categories
        </button>

        {show && (
          <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg w-48 z-50">
            {Object.keys(menu).map((category) => (
              <button
                key={category}
                onClick={() => handleScrollTo(category)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default CategoryScrollNav;
