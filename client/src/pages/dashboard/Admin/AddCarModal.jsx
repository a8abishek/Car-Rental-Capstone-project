import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "../../../api/apiFetch";

const AddCarModal = ({ onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      carFeatures: "" 
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Formatting data to match Backend Schema types
      const formattedData = {
        ...data,
        carFeatures: data.carFeatures.split(",").map(f => f.trim()).filter(f => f !== ""),
        seatingCapacity: Number(data.seatingCapacity),
        pricePerDay: Number(data.pricePerDay)
      };

      await apiFetch("/api/cars", {
        method: "POST",
        body: JSON.stringify(formattedData),
      });

      toast.success("Vehicle registered successfully!");
      onRefresh(); 
      onClose();   
    } catch (err) {
      toast.error(err.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Add New Vehicle</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Fleet Expansion</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Row 1: Name, Brand, Company */}
          <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Vehicle Model Name</label>
              <input {...register("carName", { required: "Name is required" })} placeholder="e.g. BMW M4" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Brand</label>
              <input {...register("brand", { required: true })} placeholder="e.g. BMW" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>

            {/* ADDED: Car Company Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Car Company</label>
              <input {...register("carCompany", { required: true })} placeholder="e.g. BMW Group" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>
          </div>

          {/* Row 2: Plate, Transmission, Fuel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Plate Number</label>
              <input {...register("carNumber", { required: true })} placeholder="TN 01 AB 1234" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none uppercase" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Transmission</label>
              <select {...register("transmission", { required: true })} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none">
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fuel</label>
              <select {...register("carRunning", { required: true })} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none">
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Row 3: Category, Seats, Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
             <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Category</label>
              <select {...register("carType", { required: true })} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none">
                <option value="mid-size">Mid-Size</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Seats</label>
              <input type="number" {...register("seatingCapacity", { required: true, min: 4 })} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Price / Day</label>
              <input type="number" {...register("pricePerDay", { required: true })} placeholder="₹" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold outline-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Image URL</label>
            <input {...register("carImage", { required: true })} placeholder="https://..." className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Features (Comma separated)</label>
            <input {...register("carFeatures")} placeholder="Sunroof, AC, GPS, Bluetooth" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium outline-none" />
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : (
              <>
                <CheckCircle size={18} />
                Register Vehicle
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal;