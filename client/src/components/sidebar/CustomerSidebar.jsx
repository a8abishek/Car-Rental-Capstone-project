import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Car,
  CreditCard,
  Heart,
  HelpCircle,
  Settings,
  LogOut,
  CarFront,
} from "lucide-react";
import { useEffect, useState } from "react";
// import
import { apiFetch } from "../../api/apiFetch";

const CustomerSidebar = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    const applyTheme = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      setTheme(currentTheme);
      if (currentTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    window.addEventListener("storage", applyTheme);
    window.addEventListener("themeChanged", applyTheme);
    applyTheme();

    return () => {
      window.removeEventListener("storage", applyTheme);
      window.removeEventListener("themeChanged", applyTheme);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch("/api/users/me");
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error.message);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium";
  const idleLinkClass =
    theme === "dark"
      ? "text-slate-400 hover:bg-slate-800 hover:text-blue-400"
      : "text-slate-500 hover:bg-blue-50 hover:text-blue-600";
  const activeClass =
    theme === "dark"
      ? "bg-blue-900/40 text-blue-400"
      : "bg-blue-100 text-blue-600";

  return (
    <div
      className={`w-64 border-r h-screen fixed flex flex-col justify-between p-4 transition-all duration-300 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
    >
      <div className="overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 px-4 mb-8 mt-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <CarFront size={20} className="text-white" />
          </div>
          <h2
            className={`text-xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-800"}`}
          >
            CarRental
          </h2>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : idleLinkClass}`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/booking"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : idleLinkClass}`
            }
          >
            <Car size={18} /> My Booking
          </NavLink>
          <NavLink
            to="/dashboard/wishlist"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : idleLinkClass}`
            }
          >
            <Heart size={18} /> Saved Cars
          </NavLink>
          <NavLink
            to="/dashboard/payments"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : idleLinkClass}`
            }
          >
            <CreditCard size={18} /> Payments history
          </NavLink>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-2 px-4">
            Support
          </p>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : idleLinkClass}`
            }
          >
            <Settings size={18} /> Settings
          </NavLink>
        </nav>
      </div>

      <div
        className={`border-t pt-4 pb-2 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 max-w-[80%]">
            <div
              className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold ${theme === "dark" ? "bg-orange-900/40 text-orange-400" : "bg-orange-100 text-orange-600"}`}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="overflow-hidden">
              <p
                className={`text-sm font-bold truncate leading-tight ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
              >
                {user?.name || "Loading..."}
              </p>
              <p className="text-xs text-slate-400 capitalize truncate">
                {user?.role || "Member"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSidebar;
