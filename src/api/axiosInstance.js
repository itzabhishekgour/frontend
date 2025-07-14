import axios from "axios";

// Create instance
const instance = axios.create({
  baseURL: "http://localhost:8080", // ✅ Your Spring Boot backend base URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT token from localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("ownerToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle global API errors like 404
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      window.location.href = "/404"; // Navigate to custom 404 page
    } else if (!error.response) {
      console.error("Network/server error:", error);
      window.location.href = "/404";
    }

    return Promise.reject(error);
  }
);

export default instance;
