import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, CheckCircle, Clock, Car, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "../../../api/apiFetch";
import AddCarModal from "./AddCarModal";
import EditCarModal from "./EditCarModal";

const FleetManager = ({ user }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, approved

  const isAdmin = user?.role === "admin";

  const fetchFleet = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? "/api/cars/all" : "/api/cars/my-cars";
      const data = await apiFetch(endpoint);
      setCars(data);
    } catch (err) {
      toast.error("Failed to load fleet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFleet(); }, [isAdmin]);

  const handleApprove = async (id) => {
    try {
      await apiFetch(`/api/cars/approve/${id}`, { method: "PUT" });
      toast.success("Car Approved!");
      fetchFleet();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await apiFetch(`/api/cars/${id}`, { method: "DELETE" });
      toast.success("Removed successfully");
      fetchFleet();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredCars = cars.filter(c => filter === "all" ? true : c.status === filter);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fleet Manager</h1>
            <div className="flex gap-4 mt-2">
              {["all", "pending", "approved"].map((s) => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)}
                  className={`text-xs font-bold uppercase tracking-widest ${filter === s ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:scale-105 transition-all">
            <Plus size={20} /> Add New Car
          </button>
        </div>

        <div className="bg-white rounded-4xl shadow-xl overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">Vehicle</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-center">Company/Brand</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-center">Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCars.map((car) => (
                <tr key={car._id} className="hover:bg-slate-50/50 group">
                  <td className="p-6 flex items-center gap-4">
                    <img src={car.carImage} className="w-16 h-12 object-cover rounded-xl shadow-sm" />
                    <div>
                      <p className="font-bold text-slate-900">{car.carName}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">{car.carNumber}</p>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <p className="text-xs font-bold text-slate-700">{car.carCompany}</p>
                    <p className="text-[10px] text-slate-400">{car.brand}</p>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      disabled={!isAdmin || car.status === "approved"}
                      onClick={() => handleApprove(car._id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${car.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'}`}
                    >
                      {car.status === 'approved' ? "Approved" : (isAdmin ? "Approve Now" : "Pending")}
                    </button>
                  </td>
                  <td className="p-6 text-right space-x-2">
                    <button onClick={() => setEditingCar(car)} className="p-2 text-slate-400 hover:text-blue-600 transition"><Edit3 size={18} /></button>
                    <button onClick={() => handleDelete(car._id)} className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && <AddCarModal onClose={() => setIsAddModalOpen(false)} onRefresh={fetchFleet} />}
      {editingCar && <EditCarModal car={editingCar} onClose={() => setEditingCar(null)} onRefresh={fetchFleet} />}
    </div>
  );
};

export default FleetManager;