import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  ShieldCheck,
  Clock,
  Search,
  ListFilter,
  X,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Settings2,
} from "lucide-react";
import toast from "react-hot-toast";
// import
import { apiFetch } from "../../../api/apiFetch";
import AddCarModal from "./AddCarModal";
import EditCarModal from "./EditCarModal";

function FleetManager({ user }) {
  const [cars, setCars] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [viewingCar, setViewingCar] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  //ROLE CHECKING
  const rawRole = user?.role || localStorage.getItem("role") || "";
  const currentRole = rawRole.toLowerCase();
  const isAdmin = currentRole === "admin";

  const fetchFleet = async () => {
    try {
      const endpoint = isAdmin ? "/api/cars/all" : "/api/cars/my-cars";
      const data = await apiFetch(endpoint);
      setCars(data);
    } catch (error) {
      toast.error("Failed to load fleet");
    }
  };

  useEffect(() => {
    fetchFleet();
  }, [isAdmin]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete vehicle?")) return;
    try {
      await apiFetch(`/api/cars/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      fetchFleet();
    } catch {
      toast.error("Failed");
    }
  };

  const handleToggleStatus = async (id, e) => {
    e.stopPropagation();
    try {
      await apiFetch(`/api/cars/toggle-status/${id}`, { method: "PUT" });
      toast.success("Status Updated");
      fetchFleet();
    } catch {
      toast.error("Update failed");
    }
  };

  const processedCars = cars
    .filter((c) => (filter === "all" ? true : c.status === filter))
    .filter(
      (c) =>
        c.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.brand?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const totalPages = Math.ceil(processedCars.length / itemsPerPage);
  const currentData = processedCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Custom Scrollbar Styles for this component */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
      `,
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isAdmin ? "Fleet Management" : "My Vehicles"}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Total {processedCars.length} vehicles in inventory
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Plus size={16} /> Add Vehicle
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative grow">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by model, brand..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 outline-none cursor-pointer hover:border-slate-300 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-175">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Vehicle Detail</th>
                  <th className="px-6 py-4">License Plate</th>
                  <th className="px-6 py-4 text-center">Rent / Day</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.map((car) => (
                  <tr
                    key={car._id}
                    onClick={() => setViewingCar(car)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={car.carImage}
                          className="w-14 h-10 object-cover rounded-lg bg-slate-100 border border-slate-100 shadow-sm"
                          alt=""
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                            {car.carName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            {car.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                          {car.carNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-slate-900">
                        ₹{car.pricePerDay}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {isAdmin ? (
                          <button
                            onClick={(e) => handleToggleStatus(car._id, e)}
                            className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border transition-all ${
                              car.status === "approved"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100"
                            }`}
                          >
                            {car.status}
                          </button>
                        ) : (
                          <div
                            className={`text-[9px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1.5 ${
                              car.status === "approved"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {car.status === "approved" ? (
                              <ShieldCheck size={12} />
                            ) : (
                              <Clock size={12} />
                            )}{" "}
                            {car.status}
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditingCar(car)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(car._id, e)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm active:scale-90"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm active:scale-90"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- REFINED SIDEBAR DRAWER --- */}
      {viewingCar && (
        <div
          className="fixed inset-0 z-150 flex justify-end bg-slate-900/20 backdrop-blur-[2px] transition-all"
          onClick={() => setViewingCar(null)}
        >
          <div
            className="w-full max-w-95 bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 ease-out flex flex-col border-l border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Vehicle Overview
              </h2>
              <button
                onClick={() => setViewingCar(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sidebar Body with Clean Scroll */}
            <div className="flex-1 overflow-y-auto sidebar-scroll">
              <div className="p-6 space-y-8">
                <div className="relative group">
                  <img
                    src={viewingCar.carImage}
                    className="w-full aspect-4/3 object-cover rounded-2xl shadow-md border border-slate-100 bg-slate-50"
                    alt=""
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white shadow-lg rounded-full text-[10px] font-black text-indigo-600 border border-indigo-50">
                    ₹{viewingCar.pricePerDay}/day
                  </div>
                </div>

                <section>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-8 h-0.5 bg-indigo-500 rounded-full"></span>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                      {viewingCar.brand}
                    </p>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">
                    {viewingCar.carName}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                    Reg No:{" "}
                    <span className="text-slate-600 font-mono ml-1">
                      {viewingCar.carNumber}
                    </span>
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">
                      Capacity
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {viewingCar.seatingCapacity} Seats
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">
                      Category
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {viewingCar.carType || "Standard"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Specifications
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <span className="text-[11px] text-slate-500 font-bold flex items-center gap-2 uppercase tracking-tighter">
                        <Fuel size={14} className="text-indigo-500" /> Fuel Type
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {viewingCar.carRunning}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <span className="text-[11px] text-slate-500 font-bold flex items-center gap-2 uppercase tracking-tighter">
                        <Settings2 size={14} className="text-indigo-500" />{" "}
                        Gearbox
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {viewingCar.transmission}
                      </span>
                    </div>
                  </div>
                </div>

                {viewingCar.carFeatures?.length > 0 && (
                  <div className="space-y-3 pb-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Key Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingCar.carFeatures.map((f, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[9px] font-black rounded-lg border border-slate-200 uppercase tracking-tighter"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <AddCarModal
          userRole={currentRole}
          onClose={() => setIsAddModalOpen(false)}
          onRefresh={fetchFleet}
        />
      )}
      {editingCar && (
        <EditCarModal
          car={editingCar}
          user={{ role: currentRole }}
          onClose={() => setEditingCar(null)}
          onRefresh={fetchFleet}
        />
      )}
    </div>
  );
}

export default FleetManager;
