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
import { apiFetch } from "../../../api/apiFetch";

function EditCarModal({ car, onClose, onRefresh, user }) {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const applyTheme = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      setTheme(currentTheme);
      if (currentTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    window.addEventListener("storage", applyTheme);
    window.addEventListener("themeChanged", applyTheme);
    applyTheme();

    return () => {
      window.removeEventListener("storage", applyTheme);
      window.removeEventListener("themeChanged", applyTheme);
    };
  }, []);

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

  // Improved styles for Select visibility
  const inputStyle = `w-full border p-3 rounded-xl text-sm font-medium outline-none focus:ring-4 transition-all ${
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/20 focus:border-blue-500"
      : "bg-white border-slate-200 text-slate-700 focus:ring-blue-500/10 focus:border-blue-500"
  }`;

  const labelStyle = `block text-[11px] font-bold uppercase tracking-tight mb-1.5 ml-0.5 ${
    theme === "dark" ? "text-slate-400" : "text-slate-500"
  }`;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div
          className={`px-8 py-5 border-b flex justify-between items-center sticky top-0 z-10 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                theme === "dark"
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <Car size={20} />
            </div>
            <div>
              <h2
                className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              >
                Vehicle Settings
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Asset ID: {car?._id?.slice(-6)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${theme === "dark" ? "hover:bg-slate-800 text-slate-500" : "hover:bg-slate-50 text-slate-400"}`}
          >
            <X size={20} />
          </button>
        </div>

        <form
          id="edit-car-form"
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 overflow-y-auto space-y-7 custom-scrollbar"
        >
          {isAdmin && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${theme === "dark" ? "bg-blue-900/10 border-blue-900/30" : "bg-blue-50/50 border-blue-100"}`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-blue-600" />
                <span
                  className={`text-sm font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-900"}`}
                >
                  Approval Status
                </span>
              </div>
              <select
                {...register("status")}
                className={`text-xs font-bold py-1.5 px-3 rounded-lg outline-none shadow-sm border ${theme === "dark" ? "bg-slate-800 border-slate-700 text-blue-400" : "bg-white border-blue-200 text-blue-700"}`}
              >
                <option
                  value="pending"
                  className={theme === "dark" ? "bg-slate-800 text-white" : ""}
                >
                  PENDING
                </option>
                <option
                  value="approved"
                  className={theme === "dark" ? "bg-slate-800 text-white" : ""}
                >
                  APPROVED
                </option>
              </select>
            </div>
          )}

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelStyle}>Transmission</label>
              <select {...register("transmission")} className={inputStyle}>
                <option
                  value="manual"
                  className={theme === "dark" ? "bg-slate-800 text-white" : ""}
                >
                  Manual
                </option>
                <option
                  value="automatic"
                  className={theme === "dark" ? "bg-slate-800 text-white" : ""}
                >
                  Automatic
                </option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Fuel Type</label>
              {/* Added individual styling to options for Dark mode compatibility */}
              <select {...register("carRunning")} className={inputStyle}>
                <option
                  value="petrol"
                  className={theme === "dark" ? "bg-slate-800 text-white" : ""}
                >
                  Petrol
                </option>
                <option
                  value="diesel"
                  className={theme === "dark" ? "bg-slate-800 text-white" : ""}
                >
                  Diesel
                </option>
                <option
                  value="electric"
                  className={theme === "dark" ? "bg-slate-800 text-white" : ""}
                >
                  Electric
                </option>
                <option
                  value="hybrid"
                  className={theme === "dark" ? "bg-slate-800 text-white" : ""}
                >
                  Hybrid
                </option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>License Plate</label>
              <input
                {...register("carNumber")}
                className={`${inputStyle} font-mono text-center ${theme === "dark" ? "bg-slate-950" : "bg-slate-50"}`}
              />
            </div>
          </div>

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

        <div
          className={`px-8 py-5 border-t flex items-center justify-end gap-3 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${theme === "dark" ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            form="edit-car-form"
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
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
