import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../api/axiosInstance";
import {
  FaTable,
  FaBan,
  FaFolderOpen,
  FaCopyright,
  FaInfoCircle,
} from "react-icons/fa";

import { ChevronDownIcon, GridIcon, HorizontaLDots, ListIcon } from "../icons";

import { useSidebar } from "../components/context/SidebarContext";

const navItems = [
  { icon: <GridIcon />, name: "Dashboard", path: "/owner/Dashboard" },
  { name: "Orders", icon: <ListIcon />, path: "/owner/Dashboard/basic-tables" },
  { name: "Tables QR", icon: <FaTable />, path: "/owner/Dashboard/tableqr" },
  { name: "Tables Blocker", icon: <FaBan />, path: "/owner/Dashboard/blocker" },
  {
    name: "Menu Manager",
    icon: <FaFolderOpen />,
    path: "/owner/Dashboard/menu-manager",
  },
  // {name: "Profile", icon:<FaBan/>, path:"/owner/Dashboard/manage"}
];

const othersItems = [];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [ownerName, setOwnerName] = useState("");
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    axios
      .get("/owner/profile")
      .then((res) => setOwnerName(res.data.name))
      .catch(() => console.error("❌ Failed to fetch owner name"));
  }, []);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => {
        const isSubmenuOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;
        const isItemActive = isActive(nav.path);

        const itemClasses = `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border ${
          isItemActive
            ? "bg-gradient-to-br from-blue-600 to-purple-500 text-white border-blue-600 font-bold"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        }`;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={itemClasses}
              >
                <span className="text-lg">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span>{nav.name}</span>
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        isSubmenuOpen ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link to={nav.path} className={itemClasses}>
                  <span className="text-lg">{nav.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span>{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* Submenu */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => {
                    const isSubActive = isActive(subItem.path);
                    return (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${
                            isSubActive
                              ? "bg-gradient-to-br from-blue-600 to-purple-500 text-white border-blue-600 font-semibold"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-blue-400 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="text-center font-bold text-blue-500 text-2xl px-2 break-words leading-tight">
              {ownerName}
            </div>
          ) : (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.jpeg"
                alt="Logo"
                width={32}
                height={32}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>

      {(isExpanded || isHovered || isMobileOpen) && (
        <div className="mt-auto py-4 px-2 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center justify-center gap-1">
            <FaInfoCircle /> About
          </h3>
          <p className="flex items-center justify-center gap-1">
            <FaCopyright size={14} />
            {new Date().getFullYear()} All rights reserved.
          </p>
          SmartRestaurant Dashboard v1.4
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
