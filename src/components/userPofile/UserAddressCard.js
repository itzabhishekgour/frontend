import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";

// Simple Modal Component
const SimpleModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-[700px] w-full m-4 p-6 overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-300"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default function UserAddressCard() {
  const [isOpen, setIsOpen] = useState(false);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [gstin, setGstin] = useState("");

  // Fetch on mount
  useEffect(() => {
    axios
      .get("/owner/details")
      .then((res) => {
        setStreet(res.data.street || "");
        setCity(res.data.city || "");
        setState(res.data.state || "");
        setPostalCode(res.data.postalCode || "");
        setCountry(res.data.country || "India");
      })
      .catch((err) => {
        console.error("Failed to fetch address details", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("/owner/update-details", {
        street,
        city,
        state,
        postalCode,
        country,
      })
      .then(() => {
        alert("✅ Address updated successfully");
        setIsOpen(false);
      })
      .catch(() => alert("❌ Failed to update address"));
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">Address</h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <Info label="Street" value={street} />
              <Info label="City" value={city} />
              <Info label="State" value={state} />
              <Info label="Postal Code" value={postalCode} />
              <Info label="Country" value={country} />
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            ✏ Edit
          </button>
        </div>
      </div>

      <SimpleModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Edit Address
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField label="Street" value={street} onChange={setStreet} />
          <InputField label="City" value={city} onChange={setCity} />
          <InputField label="State" value={state} onChange={setState} />
          <InputField label="Postal Code" value={postalCode} onChange={setPostalCode} />
          <InputField label="Country" value={country} onChange={setCountry} />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border rounded text-sm text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </SimpleModal>
    </>
  );
}

// Reusable Input Field Component
const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
    />
  </div>
);

// Info Display Block
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value || "—"}</p>
  </div>
);
