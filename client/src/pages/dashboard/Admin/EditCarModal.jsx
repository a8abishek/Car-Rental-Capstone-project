import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Save,
  Settings,
  Info,
  Image as ImageIcon,
  Shield,
  Car,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
// import
import { apiFetch } from "../../../api/apiFetch";

function EditCarModal({ car, onClose, onRefresh, user }) {
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (car) {
      reset({
        carName: car.carName,
        brand: car.brand,
        carNumber: car.carNumber,
        transmission: car.transmission,
        carRunning: car.carRunning,
        carType: car.carType,
        pricePerDay: car.pricePerDay,
        carImage: car.carImage,
        status: car.status,
        carFeatures: car.carFeatures?.join(", "),
      });
    }
  }, [car, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        pricePerDay: Number(data.pricePerDay),
        carFeatures: data.carFeatures
          ? data.carFeatures
              .split(",")
              .map((f) => f.trim())
              .filter((f) => f !== "")
          : [],
      };

      await apiFetch(`/api/cars/${car._id}`, {
        method: "PUT",
        body: JSON.stringify(formattedData),
      });

      toast.success("Changes saved");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all";
  const labelStyle =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1.5 ml-0.5";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Car size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Vehicle Settings
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Update Asset ID: {car?._id?.slice(-6)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          id="edit-car-form"
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 overflow-y-auto space-y-7 custom-scrollbar"
        >
          {/* Admin Status Section*/}
          {isAdmin && (
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-blue-600" />
                <span className="text-sm font-bold text-blue-900">
                  Approval Status
                </span>
              </div>
              <select
                {...register("status")}
                className="bg-white border border-blue-200 text-blue-700 text-xs font-bold py-1.5 px-3 rounded-lg outline-none shadow-sm"
              >
                <option value="pending">PENDING</option>
                <option value="approved">APPROVED</option>
              </select>
            </div>
          )}

          {/* Identification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Vehicle Name</label>
              <input
                {...register("carName", { required: true })}
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Brand / Manufacturer</label>
              <input
                {...register("brand", { required: true })}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Specs Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelStyle}>Transmission</label>
              <select {...register("transmission")} className={inputStyle}>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Fuel Type</label>
              <select {...register("carRunning")} className={inputStyle}>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>License Plate</label>
              <input
                {...register("carNumber")}
                className={inputStyle + " font-mono text-center bg-slate-50"}
              />
            </div>
          </div>

          {/* Pricing & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Rental Price (Daily)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  {...register("pricePerDay")}
                  className={inputStyle + " pl-8"}
                />
              </div>
            </div>
            <div>
              <label className={labelStyle}>Preview Image URL</label>
              <input {...register("carImage")} className={inputStyle} />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Features List</label>
            <textarea
              {...register("carFeatures")}
              className={inputStyle + " h-24 resize-none leading-relaxed"}
              placeholder="Enter features separated by commas..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            form="edit-car-form"
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCarModal;
