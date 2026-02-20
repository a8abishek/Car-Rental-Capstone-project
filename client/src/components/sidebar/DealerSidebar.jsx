import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  ClipboardList,
  Settings,
  LogOut,
  Store,
  CarFront,
} from "lucide-react";
import { useEffect, useState } from "react";
// import
import { apiFetch } from "../../api/apiFetch";

function DealerSidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    "flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition font-medium";
  const activeClass =
    "bg-blue-50 text-blue-600 font-bold border-r-4 border-blue-600 rounded-r-none";

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen fixed flex flex-col justify-between p-4">
      <div className="overflow-y-auto">
        {/* Dealer Branding */}
        <div className="flex items-center gap-2 px-4 mb-8 mt-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-200">
            <CarFront size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
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
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <LayoutDashboard size={18} /> Overview
          </NavLink>

          <NavLink
            to="/dealer/bookings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <ClipboardList size={18} /> Inquiries
          </NavLink>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">
            Inventory
          </p>
          <NavLink
            to="/dealer/my-cars"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Car size={18} /> My Fleet
          </NavLink>
          <NavLink
            to="/dealer/add-cars"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <PlusCircle size={18} /> List New Car
          </NavLink>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">
            Communication
          </p>
          <NavLink
            to="/dealer/settings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Settings size={18} /> Settings
          </NavLink>
        </nav>
      </div>

      {/* Profile Footer - Admin Style */}
      <div className="border-t border-gray-100 pt-4 pb-2 bg-white">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 max-w-[80%]">
            <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase">
              {user?.name ? user.name.charAt(0) : "D"}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate leading-tight">
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
