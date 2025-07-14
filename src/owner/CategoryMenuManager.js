import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { FaPlus, FaUtensils, FaTrash, FaBoxes, FaSearch } from "react-icons/fa";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineClose,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { useToast } from "../hooks/useToast";

function CategoryMenuManager() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [menus, setMenus] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    foodType: "VEG",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [categorySearch, setCategorySearch] = useState("");

  const { showToast } = useToast(); // ✅ Hook used here

  const fetchCategories = () => {
    axios
      .get("/owner/category/all")
      .then((res) => {
        const fetched = res.data;
        setCategories(fetched);
        if (fetched.length > 0) {
          setSelectedCategory(fetched[0]);
          fetchMenusByCategory(fetched[0].id);
        }
      })
      .catch(() => setError("❌ Failed to load categories"));
  };

  const fetchMenusByCategory = (categoryId) => {
    axios
      .get(`/owner/menu/category/${categoryId}`)
      .then((res) => setMenus(res.data))
      .catch(() => setError("❌ Failed to load menu items"));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    axios
      .post("/owner/category/add", { name: newCategory })
      .then(() => {
        setNewCategory("");
        fetchCategories();
        showToast("✅ Category added successfully", "success"); // ✅
      })
      .catch(() => setError("❌ Cannot add category"));
  };

  const handleEditCategory = (category) => {
    const newName = prompt("Edit name", category.name);
    if (newName && newName.trim()) {
      axios
        .put(`/owner/category/${category.id}`, { name: newName })
        .then(() => {
          fetchCategories();
          showToast("✏️ Category updated", "info"); // ✅
        })
        .catch(() => setError("❌ Failed to edit category"));
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Delete this category?")) {
      axios
        .delete(`/owner/category/${categoryId}`)
        .then(() => {
          fetchCategories();
          setMenus([]);
          setSelectedCategory(null);
          showToast("🗑️ Category deleted", "warning"); // ✅
        })
        .catch(() => setError("❌ Failed to delete category"));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewMenuItem({ ...newMenuItem, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddMenuItem = () => {
    const { name, price, description, image, foodType } = newMenuItem;
    if (!name || !price || !selectedCategory?.id || !image) {
      setError("❌ All fields are required to add a menu item.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("categoryId", selectedCategory.id);
    formData.append("image", image);
    formData.append("foodType", foodType);

    axios
      .post("/owner/menu/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setNewMenuItem({ name: "", price: "", description: "", image: null, foodType: "VEG" });
        setImagePreview(null);
        setShowModal(false);
        fetchMenusByCategory(selectedCategory.id);
        showToast("✅ Menu item added", "success"); // ✅
      })
      .catch(() => setError("❌ Cannot add menu item"));
  };

  const handleMenuItemEdit = (item) => {
    const newName = prompt("New name", item.name);
    const newPrice = prompt("New price", item.price);
    const newDescription = prompt("New Description", item.description);
    if (newName && newPrice) {
      axios
        .put(`/owner/menu/${item.id}`, {
          name: newName,
          price: newPrice,
          categoryId: item.category.id,
          description: newDescription || "",
        })
        .then(() => {
          fetchMenusByCategory(selectedCategory.id);
          showToast("✏️ Menu item updated", "info"); // ✅
        })
        .catch(() => setError("❌ Failed to update item"));
    }
  };

  const handleDeleteMenuItem = (menuId) => {
    if (window.confirm("Delete this item?")) {
      axios
        .delete(`/owner/menu/${menuId}`)
        .then(() => {
          fetchMenusByCategory(selectedCategory.id);
          showToast("🗑️ Menu item deleted", "warning"); // ✅
        })
        .catch(() => setError("❌ Failed to delete menu item"));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoriesFiltered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

return (
  <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    {/* Left Sidebar - Categories */}
    <div className="md:w-1/3 w-full p-2 border-b md:border-r border-gray-300 dark:border-gray-700 max-h-full md:max-h-full overflow-y-auto scrollbar-hide">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaBoxes /> Categories
        </h2>
        <div className="relative text-gray-600 dark:text-gray-400">
          <input
            type="text"
            placeholder="Search categories"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="pl-8 pr-3 py-1 rounded border dark:bg-gray-800 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-2 top-1.5" />
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <button
          onClick={handleAddCategory}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <hr className="border-gray-300 dark:border-gray-700 my-4" />

      {/* Scrollable category list with scrollbar hidden */}
      <div className="space-y-2 overflow-y-auto scrollbar-hide">
        {(categoriesFiltered.length ? categoriesFiltered : categories).map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat);
              fetchMenusByCategory(cat.id);
            }}
            className={`cursor-pointer px-3 py-2 rounded flex justify-between items-center ${
              selectedCategory?.id === cat.id
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <span>{cat.name}</span>
            <div className="space-x-2 mt-2 sm:mt-0 flex flex-wrap gap-2">
              <button
                onClick={() => handleEditCategory(cat)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <AiOutlineEdit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <AiOutlineDelete size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Right Main Panel - Menu Items */}
    <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          <FaUtensils className="inline mr-2" /> Menu Items {selectedCategory && `for "${selectedCategory.name}"`}
        </h2>
        {selectedCategory && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <FaPlus /> Add Item
          </button>
        )}
      </div>

      {selectedCategory ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4 overflow-y-auto scrollbar-hide">
          {menus.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 shadow rounded p-3 relative flex flex-col sm:flex-row gap-3"
            >
                <div className="absolute top-2 right-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.available}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        item.available ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow transform duration-300 ease-in-out ${
                          item.available ? "translate-x-5" : ""
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
                 {item.imageUrl && (
                  <img
                    src={`${item.imageUrl}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-md font-bold text-gray-900 dark:text-gray-100">
                      {item.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                      {item.description || "No description"}
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                      ₹{item.price}
                    </p>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleMenuItemEdit(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <FaTrash />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Select a category to add/view menu items.
        </p>
      )}
    </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[95%] md:max-w-md relative">
            <button
              onClick={() => {
                setShowModal(false);
                setNewMenuItem({
                  name: "",
                  price: "",
                  description: "",
                  image: null,
                });
                setImagePreview(null);
              }}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl dark:text-gray-300"
            >
              <AiOutlineClose size={24} />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Add New Menu Item
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={newMenuItem.name}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, name: e.target.value })
                }
                placeholder="Item Name"
                className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
              <input
                type="number"
                value={newMenuItem.price}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, price: e.target.value })
                }
                placeholder="Price"
                className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
              <input
                type="text"
                value={newMenuItem.description}
                onChange={(e) =>
                  setNewMenuItem({
                    ...newMenuItem,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              /><select
  value={newMenuItem.foodType}
  onChange={(e) =>
    setNewMenuItem({ ...newMenuItem, foodType: e.target.value })
  }
  className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
>
  <option value="VEG">Veg</option>
  <option value="NON_VEG">Non-Veg</option>
  <option value="EGG">Egg</option>
</select>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded mt-2"
                />
              )}
              <button
                onClick={handleAddMenuItem}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-2 flex items-center justify-center gap-2"
              >
                <AiOutlineCheckCircle size={20} /> Submit
              </button>
            </div>
          </div>
        </div>
      )}

  </div>
);

}

export default CategoryMenuManager;
