import { NavLink, useNavigate,useLocation} from "react-router";
import {
  LayoutDashboard,
  Users,
  Car,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut,
  AlertCircle,
  CarFront,
} from "lucide-react";
import { useEffect, useState } from "react";
// import
import { apiFetch } from "../../api/apiFetch";

function AdminSidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium";
  const activeClass = "bg-indigo-100 text-indigo-700";

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen fixed flex flex-col justify-between p-4">
      <div className="overflow-y-auto">
        {/* Admin Branding */}
        <div className="flex items-center gap-2 px-4 mb-8 mt-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <CarFront size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
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
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
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
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Users size={18} /> User Directory
          </NavLink>
          <NavLink
            to="/admin/cars"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Car size={18} /> Fleet Manager
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <CheckCircle size={18} /> Booking Requests
          </NavLink>

          <NavLink
            to="/admin/verifications"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <AlertCircle size={18} /> Pending Approvals
          </NavLink>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">
            System
          </p>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Settings size={18} /> Global Settings
          </NavLink>
        </nav>
      </div>

      {/* Admin Profile Footer */}
      <div className="border-t border-gray-100 pt-4 pb-2 bg-white">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 max-w-[80%]">
            <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate leading-tight">
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
};

export default AdminSidebar;
