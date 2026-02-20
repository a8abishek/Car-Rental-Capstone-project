import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Car,
  CreditCard,
  Heart,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
// import
import { apiFetch } from "../../api/apiFetch";

const CustomerSidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const linkClass = "flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition font-medium";
  const activeClass = "bg-blue-100 text-blue-600";

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen fixed flex flex-col justify-between p-4">
      {/* Top Section */}
      <div className="overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 px-4 mb-8 mt-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Car size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">DriveElite</h2>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink to="/dashboard" end className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          
          <NavLink to="/dashboard/booking" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <Car size={18} /> My Booking
          </NavLink>

          <NavLink to="/dashboard/wishlist" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <Heart size={18} /> Saved Cars
          </NavLink>

          <NavLink to="/dashboard/payments" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <CreditCard size={18} /> Payments history
          </NavLink>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-2 px-4">Support</p>
          
          <NavLink to="/dashboard/notification" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <HelpCircle size={18} /> notification
          </NavLink>
          
          <NavLink to="/dashboard/settings" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>
      </div>

      {/* Profile Footer */}
      <div className="border-t border-gray-100 pt-4 pb-2 bg-white">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 max-w-[80%]">
            {/* Avatar with dynamic Initial */}
            <div className="h-10 w-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate leading-tight">
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