import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
// import
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import DealerSidebar from "../../components/sidebar/DealerSidebar";
import CustomerSidebar from "../../components/sidebar/CustomerSidebar";

function DashboardLayout() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  const getSidebar = () => {
    if (location.pathname.startsWith("/admin")) return <AdminSidebar />;
    if (location.pathname.startsWith("/dealer")) return <DealerSidebar />;
    return <CustomerSidebar />;
  };

  return (
    <div className="flex">
      {getSidebar()}
      <div
        className={`ml-64 flex-1 min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0b1120]" : "bg-gray-100"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
