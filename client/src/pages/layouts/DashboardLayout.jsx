import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
// import
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import DealerSidebar from "../../components/sidebar/DealerSidebar";
import CustomerSidebar from "../../components/sidebar/CustomerSidebar";

function DashboardLayout() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleThemeChange = () =>
      setTheme(localStorage.getItem("theme") || "light");
    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("themeChanged", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const getSidebar = () => {
    if (location.pathname.startsWith("/admin")) return <AdminSidebar />;
    if (location.pathname.startsWith("/dealer")) return <DealerSidebar />;
    return <CustomerSidebar />;
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar Container: Fixed on Desktop, Drawer on Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {getSidebar()}
      </div>

      {/* Dark Overlay for Mobile - Only shows when drawer is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen transition-colors duration-300 md:ml-64 ${
          theme === "dark" ? "bg-[#0b1120]" : "bg-gray-100"
        } overflow-y-auto`}
      >
        {/* Mobile Header (Fixed Top only on Mobile) */}
        <div
          className={`md:hidden flex items-center p-4 border-b sticky top-0 z-30 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={theme === "dark" ? "text-white" : "text-slate-900"}
          >
            <Menu size={24} />
          </button>
          <p
            className={`ml-4 font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Dashboard
          </p>
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
