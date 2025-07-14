import React from "react";
import PhoneLogin from "../../components/customerComponent/PhoneLogin";
import { FaUserEdit, FaPhone, FaHistory, FaSignOutAlt, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProfilePanel({ profile, setProfile, identity, setIdentity, tableId, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 right-0 w-72 h-full bg-white dark:bg-gray-800 shadow-lg p-4 z-50 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-xl text-gray-500"
      >
        ×
      </button>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaUserEdit /> Edit Profile
      </h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm">Guest ID</label>
          <input
            type="text"
            value={profile.guestId}
            readOnly
            className="w-full border px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm">Google Name</label>
          <input
            type="text"
            value={profile.googleName}
            readOnly
            className="w-full border px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm">Google Email</label>
          <input
            type="text"
            value={profile.googleEmail}
            readOnly
            className="w-full border px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm">Phone Number</label>
          <input
            type="text"
            value={profile.phoneNumber}
            readOnly
            className="w-full border px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {!localStorage.getItem("phoneNumber") && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2 flex items-center gap-1">
              <FaPhone /> Sign in with Phone
            </h4>
            <PhoneLogin
              onPhoneVerified={(phone) => {
                localStorage.setItem("phoneNumber", phone);
                setIdentity(`Phone: ${phone}`);
                setProfile((prev) => ({ ...prev, phoneNumber: phone }));
              }}
            />
          </div>
        )}

        {!profile.googleEmail && (
          <div className="mt-6 text-center">
            <p className="text-sm mb-2 flex items-center justify-center gap-1">
              <FaGoogle /> Bind Google account:
            </p>
            <div id="google-btn-container" />
            <button
              onClick={() => {
                localStorage.removeItem("googleUser");
                window.location.reload();
              }}
              className="mt-4 text-sm text-red-600 underline"
            >
              Force Google Sign-In Reset
            </button>
          </div>
        )}

        <div>
          <button
            onClick={() => navigate(`/table/${tableId}/history`)}
            className="text-indigo-600 underline mt-4 flex items-center gap-1"
          >
            <FaHistory /> View Order History
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="mt-3 text-red-600 underline flex items-center gap-1"
          >
            <FaSignOutAlt /> Logout (Clear All)
          </button>
        </div>
      </div>
    </div>
  );
}
