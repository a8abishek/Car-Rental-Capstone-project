import { NavLink } from "react-router";
import { LayoutDashboard, Car, CreditCard } from "lucide-react";

const CustomerSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed p-6">
      <h2 className="text-2xl font-bold mb-10">DriveElite</h2>

      <NavLink to="/dashboard" className="sidebar-link">
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      <NavLink to="/dashboard/trips" className="sidebar-link">
        <Car size={18} /> My Trips
      </NavLink>

      <NavLink to="/dashboard/payments" className="sidebar-link">
        <CreditCard size={18} /> Payments
      </NavLink>
    </div>
  );
};

export default CustomerSidebar;
