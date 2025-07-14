import { useState, useRef } from "react";
import Dropdown from "./Dropdowns/Dropdown";
import DropdownItem from "./Dropdowns/DropdownItem";
import { Link } from "react-router-dom";
import {
  AiOutlineBell,
  AiOutlineFileText,
  AiOutlineClockCircle,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";

export default function NotificationDropdown({ notifications = [], onAccept, onDecline }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const toggleRef = useRef(null);  // <-- ref for toggle button

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  return (
    <div className="relative z-[999]">
      <button
        ref={toggleRef} // <-- ref attached here
        onClick={handleClick}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        {notifying && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <AiOutlineBell size={20} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        toggleRef={toggleRef} // <-- pass toggleRef here
        className="flex h-[480px] w-[350px] flex-col p-3 sm:w-[361px]"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <AiOutlineBell /> Notifications
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <AiOutlineClose />
          </button>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 px-3">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <li key={n.id}>
                <DropdownItem
                  onItemClick={closeDropdown}
                  className="flex flex-col gap-1 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    Order ID: {n.orderId}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <AiOutlineFileText /> {n.customerName} - ₹{n.totalAmount} ({n.totalQuantity} items)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <AiOutlineClockCircle /> {new Date(n.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 text-sm">
                    Status:{" "}
                    <strong
                      className={
                        n.status === "NEW"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : n.status === "ACCEPTED"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {n.status}
                    </strong>
                  </p>

                  {n.status === "NEW" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => onAccept(n.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <AiOutlineCheck />
                        Accept
                      </button>
                      <button
                        onClick={() => onDecline(n.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <AiOutlineClose />
                        Decline
                      </button>
                    </div>
                  )}
                </DropdownItem>
              </li>
            ))
          )}
        </ul>

        <Link
          to="/notifications"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}
