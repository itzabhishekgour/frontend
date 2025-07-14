import React, { useState } from "react";
import { auth } from "../../api/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function PhoneLogin({ onPhoneVerified }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleSendOTP = async () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
          size: "invisible",
          callback: (response) => {
            console.log("Recaptcha solved:", response);
          },
        });
      }

      const result = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      alert("✅ OTP sent to your phone");
    } catch (err) {
      console.error("OTP Error:", err);
      alert("❌ Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const phoneNumber = result.user.phoneNumber;

      localStorage.setItem("phoneNumber", phoneNumber);
      alert("✅ Phone verified!");
      if (onPhoneVerified) onPhoneVerified(phoneNumber);
    } catch (err) {
      console.error("Verification Error:", err);
      alert("❌ Invalid OTP");
    }
  };

  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
      <input
        type="text"
        placeholder="Enter phone (10-digit)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border dark:border-gray-600 p-2 mb-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded"
      />
      <button
        onClick={handleSendOTP}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full mb-2"
      >
        Send OTP
      </button>

      {confirmationResult && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border dark:border-gray-600 p-2 mb-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded"
          />
          <button
            onClick={handleVerifyOTP}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Verify OTP
          </button>
        </>
      )}

      <div id="recaptcha"></div>
    </div>
  );
}

export default PhoneLogin;