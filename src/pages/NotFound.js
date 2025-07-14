import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeftCircle } from "react-icons/fi";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6 }}
      className="flex h-screen w-full items-center justify-center bg-white px-4 dark:bg-gray-900"
    >
      <div className="text-center max-w-md">
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-7xl font-extrabold text-indigo-600 dark:text-indigo-400"
        >
          404
        </motion.h1>
        <p className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
          Page Not Found
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Sorry, the page you're looking for doesn’t exist.
        </p>
        <button
          onClick={handleGoBack}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-all duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <FiArrowLeftCircle className="text-lg" />
          Go Back
        </button>
      </div>
    </motion.div>
  );
}
