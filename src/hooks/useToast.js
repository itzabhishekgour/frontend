import { useCallback } from "react";
import { toast } from "react-toastify";

/**
 * Custom toast hook for showing consistent toast messages.
 */
export const useToast = () => {
  const showToast = useCallback((message, type = "info", options = {}) => {
    const config = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      ...options,
    };

    switch (type) {
      case "success":
        toast.success(message, config);
        break;
      case "error":
        toast.error(message, config);
        break;
      case "warning":
        toast.warning(message, config);
        break;
      case "info":
      default:
        toast.info(message, config);
        break;
    }
  }, []);

  return { showToast };
};
