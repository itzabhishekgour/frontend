import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { AiOutlineLock } from "react-icons/ai";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    paytmMid: "",
    paytmSecret: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    api
      .post("/auth/register", form)
      .then((res) => {
        const token = res.data;
        localStorage.setItem("ownerToken", token);
        navigate("/owner/Dashboard");
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data || "Registration failed");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-4 flex items-center justify-center gap-2">
          <AiOutlineLock size={24} /> Owner Register
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "password", "paytmMid", "paytmSecret"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={
                field === "paytmMid"
                  ? "PhonePe Client ID"
                  : field === "paytmSecret"
                  ? "PhonePe Client Secret"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
