import { NavLink } from "react-router";
import { LayoutDashboard, Users, Car, CheckCircle } from "lucide-react";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed p-6">
      <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

      <NavLink to="/admin/dashboard" className="sidebar-link">
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      <NavLink to="/admin/users" className="sidebar-link">
        <Users size={18} /> Users
      </NavLink>

      <NavLink to="/admin/cars" className="sidebar-link">
        <Car size={18} /> All Cars
      </NavLink>

      <NavLink to="/admin/bookings" className="sidebar-link">
        <CheckCircle size={18} /> Bookings
      </NavLink>
    </div>
  );
};

export default AdminSidebar;
