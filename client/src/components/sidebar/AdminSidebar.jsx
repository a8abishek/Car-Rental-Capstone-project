import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Car,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut,
  CarFront,
} from "lucide-react";
import { useEffect, useState } from "react";
// import
import { apiFetch } from "../../api/apiFetch";

function AdminSidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  //theme
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

  //fetch data (for name)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch("/api/users/me");
        setUser(data);
      } catch (error) {
        console.error("Admin fetch error:", error.message);
      }
    };
    fetchUser();
  }, []);

  //logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium";

  // Theme-aware link colors
  const idleLinkClass =
    theme === "dark"
      ? "text-slate-400 hover:bg-slate-800 hover:text-indigo-400"
      : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600";

  const activeClass =
    theme === "dark"
      ? "bg-indigo-900/40 text-indigo-400"
      : "bg-indigo-100 text-indigo-700";

  return (
    <div
      className={`w-64 border-r h-screen flex flex-col justify-between p-4 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="overflow-y-auto">
        {/* Admin Branding */}
        <div className="flex items-center gap-2 px-4 mb-8 mt-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <CarFront size={20} />
          </div>
          <div>
            <h2
              className={`text-xl font-bold tracking-tight leading-none ${
                theme === "dark" ? "text-white" : "text-slate-800"
              }`}
            >
              CarRental
            </h2>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              Admin Control
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">
            Overview
          </p>
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              `${linkClass} ${idleLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `${linkClass} ${idleLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            <BarChart3 size={18} /> Analytics
          </NavLink>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">
            Management
          </p>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${linkClass} ${idleLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Users size={18} /> User Directory
          </NavLink>
          <NavLink
            to="/admin/cars"
            className={({ isActive }) =>
              `${linkClass} ${idleLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Car size={18} /> Fleet Manager
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `${linkClass} ${idleLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            <CheckCircle size={18} /> Bookings
          </NavLink>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">
            System
          </p>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `${linkClass} ${idleLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Settings size={18} /> Global Settings
          </NavLink>
        </nav>
      </div>

      {/* Admin Profile Footer */}
      <div
        className={`border-t pt-4 pb-2 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 max-w-[80%]">
            <div
              className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold border-2 ${
                theme === "dark"
                  ? "bg-indigo-900/50 text-indigo-400 border-indigo-900"
                  : "bg-indigo-100 text-indigo-600 border-indigo-200"
              }`}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="overflow-hidden">
              <p
                className={`text-sm font-bold truncate leading-tight ${
                  theme === "dark" ? "text-slate-200" : "text-slate-800"
                }`}
              >
                {user?.name || "Admin User"}
              </p>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  System Admin
                </p>
              </div>
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
}

export default AdminSidebar;
