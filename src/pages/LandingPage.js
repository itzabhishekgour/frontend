import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaConciergeBell,
  FaCreditCard,
  FaQrcode,
  FaLock,
  FaUtensils,
  FaChartLine,
  FaMoneyBillWave,
  FaShieldAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const LandingPage = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`min-h-screen w-full font-sans overflow-x-hidden overflow-y-scroll scrollbar-hide 
      ${darkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 w-full px-6 py-4 transition-all duration-300 z-50 flex items-center justify-between border-b ${
          darkMode
            ? "bg-black border-gray-800"
            : "bg-white border-gray-300"
        } ${showHeader ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Smart Restaurant
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-700" />
            )}
          </button>
          <Link
            to="/signup"
            className={`px-4 py-2 rounded-lg font-medium ${
              darkMode
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-orange-400 hover:bg-orange-500 text-white"
            }`}
          >
            Get Started
          </Link>
          <Link
            to="/signin"
            className={`px-4 py-2 rounded-lg border font-medium ${
              darkMode
                ? "border-white text-white hover:bg-white hover:text-black"
                : "border-gray-700 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            } transition`}
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="z-10 max-w-2xl mt-[-60px]">
          <motion.h1
            className={`text-4xl md:text-6xl font-bold leading-tight mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Smart Restaurant
          </motion.h1>
          <motion.p
            className={`text-lg md:text-xl mb-8 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Book tables, order food, and pay—all from your phone.
          </motion.p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium"
            >
              Get Started
            </Link>
            <Link
              to="/signin"
              className={`px-6 py-3 rounded-lg border font-medium transition ${
                darkMode
                  ? "border-white hover:bg-white hover:text-black"
                  : "border-gray-700 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className={`py-16 px-6 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className={`text-3xl md:text-4xl font-semibold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Why Choose Us?
          </h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-12`}>
            Experience dining like never before with our smart platform.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaCalendarAlt size={30} />}
              title="Instant Table Booking"
              description="Book your favorite table instantly with live availability."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<FaConciergeBell size={30} />}
              title="Browse Menu & Order"
              description="Explore restaurant menus and place orders seamlessly."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<FaCreditCard size={30} />}
              title="Secure Online Payments"
              description="Pay via UPI or QR code directly from your phone."
              darkMode={darkMode}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-16 px-6 ${darkMode ? "bg-black" : "bg-white"} text-center`}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className={`text-3xl md:text-4xl font-semibold mb-12 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 text-left">
            {/* For Customers */}
            <motion.div
              className={`rounded-xl p-6 border ${
                darkMode ? "bg-gray-900 border-gray-800 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-800"
              }`}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                For Customers
              </h3>
              <ul className="space-y-3 list-disc pl-6">
                <li>
                  <span className="text-orange-400 font-medium">Scan QR</span> on your table to begin
                </li>
                <li>
                  <span className="text-orange-400 font-medium">Browse menu</span> by categories
                </li>
                <li>
                  <span className="text-orange-400 font-medium">Add items</span> to cart and place your order
                </li>
                <li>
                  <span className="text-orange-400 font-medium">Pay securely</span> via PhonePe, Paytm, UPI
                </li>
                <li>
                  <span className="text-orange-400 font-medium">Auto-expiring link</span> ensures privacy
                </li>
              </ul>
            </motion.div>

            {/* For Owners */}
            <motion.div
              className={`rounded-xl p-6 border ${
                darkMode ? "bg-gray-900 border-gray-800 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-800"
              }`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                For Restaurant Owners
              </h3>
              <ul className="space-y-3 list-disc pl-6">
                <li>
                  <span className="text-orange-400 font-medium">Create an account</span> and set up your restaurant
                </li>
                <li>
                  <span className="text-orange-400 font-medium">Generate QR codes</span> for each table
                </li>
                <li>
                  <span className="text-orange-400 font-medium">Manage menus</span> and item categories
                </li>
                <li>
                  <span className="text-orange-400 font-medium">Track orders & payments</span> from dashboard
                </li>
                <li>
                  <span className="text-orange-400 font-medium">Integrate</span> with any payment gateway
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-16 px-6 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <FeatureCard
              icon={<FaQrcode />}
              title="QR Code Ordering"
              description="Unique QR for every table. Secure and fast."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<FaLock />}
              title="Expiring Links"
              description="Links expire after order for privacy and security."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<FaUtensils />}
              title="Menu Management"
              description="Easy category and item management."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<FaChartLine />}
              title="Dashboard"
              description="Track orders, tables, and payments in real time."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<FaMoneyBillWave />}
              title="Payment Integration"
              description="Supports PhonePe, Paytm, and more."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<FaShieldAlt />}
              title="Scalable & Secure"
              description="Built for performance, privacy, and reliability."
              darkMode={darkMode}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 text-center ${
          darkMode ? "bg-black text-gray-500" : "bg-gray-100 text-gray-600"
        }`}
      >
        © {new Date().getFullYear()} Smart Restaurant (v1.4). All rights reserved.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, darkMode }) => (
  <motion.div
    className={`p-6 rounded-xl shadow-md hover:shadow-xl transition ${
      darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-800"
    }`}
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-3xl mb-3 text-orange-400">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p>{description}</p>
  </motion.div>
);

export default LandingPage;
