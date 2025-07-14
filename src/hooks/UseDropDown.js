import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import Dropdown from "./Dropdowns/Dropdown"; // adjust path if needed
import DropdownItem from "./Dropdowns/DropdownItem"; // adjust path if needed

export default function UserDropdown() {
  const [ownerName, setOwnerName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/owner/profile")
      .then((res) => setOwnerName(res.data.name))
      .catch(() => console.error("❌ Failed to fetch owner name"));
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("ownerToken"); // Remove owner token from storage
    toast.success("Signed out successfully");
    closeDropdown();
    navigate("/signin");
  };

  return (
    <div className="relative z-[999]">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="block mr-1 font-medium text-theme-sm break-words max-w-[150px] leading-snug">
          {ownerName}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-[260px] p-3">
        <div className="pb-3 border-b border-gray-200 dark:border-gray-800">
          <p className="font-medium text-gray-700 text-theme-sm break-words max-w-[180px] dark:text-gray-400">
            {ownerName}
          </p>
          <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
            randomuser@pimjo.co
          </p>
        </div>

        <ul className="flex flex-col gap-1 pt-4">
          <li>
            <DropdownItem tag="a" to="/owner/Dashboard/manage" onItemClick={closeDropdown}>
              Account settings
            </DropdownItem>
          </li>
        </ul>

        <div className="pt-3">
          <DropdownItem
            tag="button"
            onItemClick={handleLogout}
            className="flex items-center gap-3 w-full"
          >
            <svg
              className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1 19.247C14.686 19.247 14.35 18.911 14.35 18.497V14.245H12.85V18.497C12.85 19.7396 13.858 20.747 15.1 20.747H18.5C19.743 20.747 20.75 19.7396 20.75 18.497V5.496C20.75 4.25345 19.743 3.24609 18.5 3.24609H15.1C13.858 3.24609 12.85 4.25345 12.85 5.496V9.745H14.35V5.496C14.35 5.08188 14.686 4.74609 15.1 4.74609H18.5C18.915 4.74609 19.25 5.08188 19.25 5.496V18.497C19.25 18.9112 18.915 19.247 18.5 19.247H15.1ZM3.25 12C3.25 12.2144 3.342 12.4091 3.488 12.546L8.095 17.1556C8.388 17.4485 8.863 17.4487 9.156 17.1559C9.449 16.8631 9.449 16.3882 9.156 16.0952L5.811 12.7484H16C16.415 12.7484 16.75 12.4127 16.75 11.9984C16.75 11.5842 16.415 11.2484 16 11.2484H5.815L9.156 7.90554C9.449 7.61255 9.449 7.13767 9.155 6.84488C8.862 6.55209 8.388 6.55226 8.095 6.84525L3.523 11.4202C3.357 11.5577 3.25 11.7657 3.25 11.9984Z"
                fill=""
              />
            </svg>
            Sign out
          </DropdownItem>
        </div>
      </Dropdown>
    </div>
  );
}
