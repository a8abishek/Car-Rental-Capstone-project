import { NavLink } from "react-router";
import { LayoutDashboard, Car, Plus } from "lucide-react";

const DealerSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed p-6">
      <h2 className="text-2xl font-bold mb-10">Dealer Panel</h2>

      <NavLink to="/dealer/dashboard" className="sidebar-link">
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      <NavLink to="/dealer/cars" className="sidebar-link">
        <Car size={18} /> My Cars
      </NavLink>

      <NavLink to="/dealer/add-car" className="sidebar-link">
        <Plus size={18} /> Add Car
      </NavLink>
    </div>
  );
};

export default DealerSidebar;
