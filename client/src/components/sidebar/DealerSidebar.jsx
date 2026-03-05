import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Car,
  ClipboardList,
  Settings,
  LogOut,
  CarFront,
} from "lucide-react";
import { useEffect, useState } from "react";
// import
import { apiFetch } from "../../api/apiFetch";

function DealerSidebar() {
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
        console.error("Dealer fetch error:", error.message);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/dealer/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium";

  // Theme-aware link colors
  const idleLinkClass =
    theme === "dark"
      ? "text-slate-400 hover:bg-slate-800 hover:text-blue-400"
      : "text-slate-500 hover:bg-blue-50 hover:text-blue-600";
  const activeClass =
    theme === "dark"
      ? "bg-blue-900/40 text-blue-400 font-bold border-r-4 border-blue-600 rounded-r-none"
      : "bg-blue-50 text-blue-600 font-bold border-r-4 border-blue-600 rounded-r-none";

  return (
    <div
      className={`w-64 border-r h-full flex flex-col justify-between p-4 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
    >
      <div className="overflow-y-auto">
        {/* Dealer Branding */}
        <div className="flex items-center gap-2 px-4 mb-8 mt-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg">
            <CarFront size={20} />
          </div>
          <div>
            <h2
              className={`text-xl font-bold tracking-tight leading-none ${theme === "dark" ? "text-white" : "text-slate-800"}`}
            >
              CarRental
            </h2>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              Dealer Portal
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">
            Business
          </p>
          <NavLink
            to="/dealer/dashboard"
            end
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : idleLinkClass}`
            }
          >
            <LayoutDashboard size={18} /> Overview
          </NavLink>

          <NavLink
            to="/dealer/bookings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : idleLinkClass}`
            }
          >
            <ClipboardList size={18} /> Analytics
          </NavLink>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">
            Inventory
          </p>
          <NavLink
            to="/dealer/my-cars"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : idleLinkClass}`
            }
          >
            <Car size={18} /> My Fleet
          </NavLink>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">
            Communication
          </p>
          <NavLink
            to="/dealer/settings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : idleLinkClass}`
            }
          >
            <Settings size={18} /> Settings
          </NavLink>
        </nav>
      </div>

      {/* Profile Footer */}
      <div
        className={`border-t pt-4 pb-2 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 max-w-[80%]">
            <div
              className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold uppercase border ${theme === "dark" ? "bg-indigo-900/50 text-indigo-400 border-indigo-900" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}
            >
              {user?.name ? user.name.charAt(0) : "D"}
            </div>

            <div className="overflow-hidden">
              <p
                className={`text-sm font-bold truncate leading-tight ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
              >
                {user?.name || "Dealer User"}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                Verified Partner
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DealerSidebar;
