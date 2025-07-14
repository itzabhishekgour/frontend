// import { useRef } from "react";
import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneLogin from "../components/customerComponent/PhoneLogin";

function CartPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cart = state?.cart || [];
  const tableId = state?.tableId;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = (total * 0.18).toFixed(2);
  const grandTotal = Math.round(total + parseFloat(gst));

  const [showModal, setShowModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [requirePhoneLogin, setRequirePhoneLogin] = useState(false);

  // Auto-fill name/phone if available from login and paymentMode offline
  useEffect(() => {
    if (paymentMode === "offline") {
      const googleUser = JSON.parse(localStorage.getItem("googleUser"));
      const savedPhone = localStorage.getItem("phoneNumber");

      if (!customerName && googleUser?.name) setCustomerName(googleUser.name);
      if (!phone && savedPhone) {
        setPhone(savedPhone);
      } else if (!savedPhone) {
        setRequirePhoneLogin(true);
      }
    }
  }, [paymentMode]);

  // Confirm order after online payment success (URL: ?paymentStatus=success

  const handlePaymentMode = () => {
    setShowModal(true);
  };

  const handleFinalOrder = async () => {
    if (!paymentMode) {
      alert("❗ Please select a payment mode.");
      return;
    }

    if (paymentMode === "offline" && (!customerName || !phone)) {
      alert("❗ Please enter name and phone number.");
      return;
    }

    const guestId = localStorage.getItem("guestId");
    const googleEmail = localStorage.getItem("googleEmail");
    const googleName = localStorage.getItem("googleName");
    const phoneNumber = localStorage.getItem("phoneNumber");

    const orderPayload = {
      tableId,
      items: cart.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      })),
      paymentMode: paymentMode.toUpperCase(),
      ...(paymentMode === "offline" && {
        customerName,
        phoneNumber: phone,
      }),
      ...(guestId && { guestId }),
      ...(googleEmail && { googleEmail, googleName }),
      ...(phoneNumber && paymentMode !== "offline" && { phoneNumber }),
    };

    console.log("🛒 Final Order Payload:", orderPayload);

    if (paymentMode === "offline") {
      try {
        const { data } = await axios.post(
          "/customer/order/place",
          orderPayload
        );
        alert("✅ Order Placed (Offline Payment)!");
        navigate(`/customer/order/status?tableId=${tableId}`);
      } catch (err) {
        console.error("❌ Offline order failed:", err);
        alert("❌ Failed to place order.");
      }
    } else {
      try {
        // Step 1: Call place (mock response)
        const { data } = await axios.post(
          "/customer/order/place",
          orderPayload
        );
        sessionStorage.setItem("pendingOrder", JSON.stringify(orderPayload)); // Save payload for confirm
        const phonepePayload = {
          orderId: data.tempOrderId || data.orderId,
          amount: data.totalAmount,
          tableId,
        };
        const res = await axios.post(
          "/customer/payment/initiate",
          phonepePayload
        );
        const redirectUrl = res.data?.redirectUrl;
        if (redirectUrl) {
          window.location.href = redirectUrl; // Redirect to payment gateway
        } else {
          throw new Error("No redirect URL received.");
        }
      } catch (err) {
        console.error("❌ Online order initiation failed:", err);
        alert("❌ Failed to initiate online order.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">🛍 Your Cart</h1>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-2">Hotel Smart Restaurant</h2>

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="bg-gray-200 px-2 rounded"
                onClick={() => {
                  const updated =
                    item.quantity > 1
                      ? cart.map((i) =>
                          i.id === item.id
                            ? { ...i, quantity: i.quantity - 1 }
                            : i
                        )
                      : cart.filter((i) => i.id !== item.id);
                  navigate("/customer/cart", {
                    state: { cart: updated, tableId },
                  });
                }}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                className="bg-gray-200 px-2 rounded"
                onClick={() => {
                  const updated = cart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                  );
                  navigate("/customer/cart", {
                    state: { cart: updated, tableId },
                  });
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4 border-t pt-2">
          <p className="text-sm mb-2">
            Item Total <span className="float-right">₹{total}</span>
          </p>
          <p className="text-sm mb-2">
            GST & Other Charges <span className="float-right">₹{gst}</span>
          </p>
          <h3 className="text-lg font-bold mt-2">
            TO PAY <span className="float-right">₹{grandTotal}</span>
          </h3>
        </div>

        <button
          onClick={handlePaymentMode}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700"
        >
          PROCEED TO PAY
        </button>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Choose Payment Mode</h2>
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMode === "online"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Online (PhonePe)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="offline"
                  checked={paymentMode === "offline"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Offline (Cash/Card)
              </label>
            </div>

            {paymentMode === "offline" && (
              <>
                {requirePhoneLogin ? (
                  <PhoneLogin
                    onSuccess={(phoneNum) => {
                      localStorage.setItem("phoneNumber", phoneNum);
                      setPhone(phoneNum);
                      setRequirePhoneLogin(false);
                    }}
                  />
                ) : (
                  <div className="space-y-2 mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={`w-full border px-3 py-2 rounded pr-20 ${
                          localStorage.getItem("googleName")
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={!!localStorage.getItem("googleName")}
                      />
                      {localStorage.getItem("googleName") && (
                        <span className="absolute right-3 top-2 text-green-600 text-sm font-semibold">
                          ✔ Verified
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Enter your phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full border px-3 py-2 rounded pr-20 ${
                          localStorage.getItem("phoneNumber")
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={!!localStorage.getItem("phoneNumber")}
                      />
                      {localStorage.getItem("phoneNumber") && (
                        <span className="absolute right-3 top-2 text-green-600 text-sm font-semibold">
                          ✔ Verified
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalOrder}
                className={`px-4 py-2 text-white rounded ${
                  paymentMode
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!paymentMode}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
