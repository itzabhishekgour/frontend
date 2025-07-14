import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "../components/context/SidebarContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="h-screen flex bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white overflow-hidden">
      {/* Sidebar */}
      <div>
        <AppSidebar />
        <Backdrop />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0">
          <AppHeader />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 w-full max-w-screen-2xl mx-auto">
          <Outlet />
        </main>

          {/* Footer */}
          <footer className="w-full bg-gray-200 dark:bg-gray-800 text-center text-sm py-4 text-gray-400 dark:text-gray-300">
            © {new Date().getFullYear()} Smart Restaurant — All rights reserved.
          </footer>
      </div>
    </div>
  );
};


const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
