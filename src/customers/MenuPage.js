import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import ProfilePanel from "./MenuPage/ProfilePanel";
import MenuHeader from "./MenuPage/MenuHeader";
import MenuCategoryList from "./MenuPage/MenuCategoryList";
import CartButton from "./MenuPage/CartButton";

function MenuPage() {
  const [menu, setMenu] = useState({});
  const [restaurantName, setRestaurantName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [tableId, setTableId] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [identity, setIdentity] = useState("");
  const [profile, setProfile] = useState({
    guestId: "",
    googleName: "",
    googleEmail: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    let gid = localStorage.getItem("guestId");
    if (!gid) {
      gid = crypto.randomUUID();
      localStorage.setItem("guestId", gid);
    }

    const googleUser = JSON.parse(localStorage.getItem("googleUser"));
    const phone = localStorage.getItem("phoneNumber");

    if (googleUser) {
      setIdentity(`Google: ${googleUser.name}`);
    } else if (phone) {
      setIdentity(`Phone: ${phone}`);
    } else {
      setIdentity(`Guest ID: ${gid.slice(0, 8)}...`);
    }

    setProfile({
      guestId: gid,
      googleName: googleUser?.name || "",
      googleEmail: googleUser?.email || "",
      phoneNumber: phone || "",
    });

    const params = new URLSearchParams(window.location.search);
    const tid = params.get("tableId");
    setTableId(tid);

    if (tid) {
      axios
        .get(`/customer/menu/${tid}`)
        .then((res) => {
          const { restaurantName, tableNumber, menu } = res.data;
          setMenu(menu);
          setRestaurantName(restaurantName);
          setTableNumber(tableNumber);
        })
        .catch((err) => {
          if (err.response?.status === 423) {
            setError("Table temporarily blocked by restaurant.");
          } else {
            setError("Unable to load menu. Check the QR/Table ID.");
          }
        });
    } else {
      setError("Missing or invalid table ID.");
    }
  }, []);

  useEffect(() => {
    if (!googleBtnRef.current || localStorage.getItem("googleUser")) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id:
          "874246382034-0vfo810g9tn5r4c1k350tfoleebrcn03.apps.googleusercontent.com",
        callback: (response) => {
          const decoded = jwtDecode(response.credential);
          localStorage.setItem("googleUser", JSON.stringify(decoded));
          setProfile((prev) => ({
            ...prev,
            googleName: decoded.name,
            googleEmail: decoded.email,
          }));
          setIdentity(`Google: ${decoded.name}`);
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-btn-container"),
        {
          theme: "outline",
          size: "large",
          width: 240,
        }
      );
    };

    document.body.appendChild(script);
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 h-screen flex flex-col relative">
      {panelOpen && (
        <ProfilePanel
          profile={profile}
          setProfile={setProfile}
          identity={identity}
          setIdentity={setIdentity}
          tableId={tableId}
          onClose={() => setPanelOpen(false)}
        />
      )}

      <MenuHeader
        restaurantName={restaurantName}
        tableNumber={tableNumber}
        identity={identity}
        error={error}
        onMenuClick={() => setPanelOpen(true)}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <MenuCategoryList
          menu={menu}
          cart={cart}
          addToCart={addToCart}
          setCart={setCart}
        />
      </div>

      {cart.length > 0 && <CartButton cart={cart} tableId={tableId} />}
    </div>
  );
}

export default MenuPage;
