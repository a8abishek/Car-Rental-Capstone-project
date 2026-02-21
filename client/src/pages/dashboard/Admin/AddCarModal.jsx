import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  CheckCircle,
  Car,
  Info,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
// import
import { apiFetch } from "../../../api/apiFetch";

function AddCarModal({ onClose, onRefresh, userRole }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const isAdmin = userRole?.toLowerCase() === "admin";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        carFeatures: data.carFeatures
          ? data.carFeatures
              .split(",")
              .map((f) => f.trim())
              .filter((f) => f !== "")
          : [],
        pricePerDay: Number(data.pricePerDay),
        seatingCapacity: Number(data.seatingCapacity),
        // Admin posts are auto-approved, others are pending
        status: isAdmin ? "approved" : "pending",
      };

      await apiFetch("/api/cars", {
        method: "POST",
        body: JSON.stringify(formattedData),
      });

      toast.success(
        isAdmin
          ? "Vehicle listed and approved!"
          : "Vehicle submitted for approval!",
      );
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400";
  const labelStyle =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Car size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">
                Add New Vehicle
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Fill in the details to list your car
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 overflow-y-auto space-y-6"
        >
          {/* Section 1: Basic Info */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Info size={16} />
              <span className="text-xs font-black uppercase tracking-widest">
                Basic Information
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Vehicle Model</label>
                <input
                  {...register("carName", { required: true })}
                  placeholder="e.g. Civic Type R"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Brand</label>
                <input
                  {...register("brand", { required: true })}
                  placeholder="e.g. Honda"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Company Name</label>
                <input
                  {...register("carCompany", { required: true })}
                  placeholder="e.g. Honda Motors"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>License Plate</label>
                <input
                  {...register("carNumber", { required: true })}
                  placeholder="ABC-1234"
                  className={inputStyle + " uppercase font-mono"}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Settings size={16} />
              <span className="text-xs font-black uppercase tracking-widest">
                Specifications
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelStyle}>Transmission</label>
                <select
                  {...register("transmission", { required: true })}
                  className={inputStyle}
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Fuel Type</label>
                <select
                  {...register("carRunning", { required: true })}
                  className={inputStyle}
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Car Class</label>
                {/*ENUM MATCH: mid-size, standard, premium, luxury */}
                <select
                  {...register("carType", { required: true })}
                  className={inputStyle}
                >
                  <option value="mid-size">Mid-Size</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelStyle}>Seating Capacity</label>
                <input
                  type="number"
                  {...register("seatingCapacity", { required: true })}
                  placeholder="e.g. 5"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Daily Rate ($)</label>
                <input
                  type="number"
                  {...register("pricePerDay", { required: true })}
                  placeholder="e.g. 150"
                  className={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Visuals & Features */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <ImageIcon size={16} />
              <span className="text-xs font-black uppercase tracking-widest">
                Media & Features
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelStyle}>Car Image URL</label>
                <input
                  {...register("carImage", { required: true })}
                  placeholder="Paste direct image link"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Key Features</label>
                <textarea
                  {...register("carFeatures")}
                  placeholder="GPS, Bluetooth, Sunroof, AC (Comma separated)"
                  className={inputStyle + " h-24 resize-none"}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <button
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-200 disabled:opacity-70"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <CheckCircle size={18} />
                {isAdmin ? "PUBLISH & APPROVE VEHICLE" : "SUBMIT FOR APPROVAL"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCarModal;
