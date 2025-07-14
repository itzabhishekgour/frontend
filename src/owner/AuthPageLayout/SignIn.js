import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { AiOutlineKey } from "react-icons/ai";
import AuthLayout from "../AuthPageLayout/Authlayout"

const OwnerLoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    api
      .post("/auth/login", form)
      .then((res) => {
        const token = res.data;
        localStorage.setItem("ownerToken", token);
        navigate("/owner/dashboard");
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data || "Login failed");
      });
  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-400">
          <AiOutlineKey size={24} /> Owner Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>

  );
};

export default OwnerLoginPage;