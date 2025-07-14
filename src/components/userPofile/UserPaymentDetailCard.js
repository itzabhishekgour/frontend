import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance"; // make sure the path is correct
// 🧩 Custom hook for modal
function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return { isOpen, openModal, closeModal };
}

// 🧩 Modal component
function Modal({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// 🧩 Label component
function Label({ children }) {
  return (
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
      {children}
    </label>
  );
}

// 🧩 Input component
function Input({ value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
    />
  );
}

// 🧩 Button component
function Button({ children, onClick, type = "button", variant = "default", size = "sm" }) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes = {
    sm: "h-9 px-4",
    md: "h-10 px-6",
  };
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]}`}>
      {children}
    </button>
  );
}

// 🧩 Main Component
export default function UserPaymentDetailCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");


const handleSave = () => {
  axios
    .put("/owner/update-details", {
      phonePeMid: clientId,
      phonePeSecret: clientSecret,
    })
    .then(() => {
      alert("✅ Payment credentials updated successfully!");
      closeModal();
    })
    .catch(() => {
      alert("❌ Failed to update payment credentials.");
    });
};

useEffect(() => {
  axios.get("/owner/details")
    .then((res) => {
      const data = res.data;
      setClientId(data.phonePeMid || "");
      setClientSecret(data.phonePeSecret || "");
    })
    .catch((err) => {
      console.error("Failed to fetch payment details", err);
    });
}, []);



  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Payment Credentials
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            <Info label="PhonePe Client ID" value={clientId} />
            <Info label="PhonePe Client Secret" value={clientSecret.replace(/./g, "*")} />
          </div>
        </div>

        <Button onClick={openModal} size="sm" variant="outline">
          Edit
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-10">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex flex-col">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Payment Details
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Update your PhonePe credentials securely.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <InputGroup label="PhonePe Client ID" value={clientId} onChange={setClientId} />
            <InputGroup label="PhonePe Client Secret" value={clientSecret} onChange={setClientSecret} />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={closeModal}>Close</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// 🧩 Reusable for display info
function Info({ label, value }) {
  return (
    <div>
      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
    </div>
  );
}

// 🧩 Reusable for form inputs
function InputGroup({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
