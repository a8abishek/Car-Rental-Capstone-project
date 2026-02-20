// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { X, Save, CheckCircle, Clock, ShieldCheck, AlertCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import { apiFetch } from "../../../api/apiFetch";

// const EditCarModal = ({ car, onClose, onRefresh, user }) => {
//   const [loading, setLoading] = useState(false);
  
//   // Check if the logged-in user is an Admin
//   const isAdmin = user?.role === "admin";

//   const { register, handleSubmit, reset, watch } = useForm({
//     defaultValues: {
//       ...car,
//       carFeatures: car.carFeatures?.join(", ") || "",
//       status: car.status || "pending"
//     }
//   });

//   // Watch status to update the UI colors dynamically
//   const currentStatus = watch("status");

//   useEffect(() => {
//     if (car) {
//       reset({
//         ...car,
//         carFeatures: car.carFeatures?.join(", ") || "",
//         status: car.status || "pending"
//       });
//     }
//   }, [car, reset]);

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       const formattedData = {
//         ...data,
//         // Only allow status change if user is Admin, otherwise keep original status
//         status: isAdmin ? data.status : car.status,
//         carFeatures: data.carFeatures.split(",").map(f => f.trim()).filter(f => f !== ""),
//         seatingCapacity: Number(data.seatingCapacity),
//         pricePerDay: Number(data.pricePerDay)
//       };

//       await apiFetch(`/api/cars/${car._id}`, {
//         method: "PUT",
//         body: JSON.stringify(formattedData),
//       });

//       toast.success("Vehicle updated successfully!");
//       onRefresh(); 
//       onClose();   
//     } catch (err) {
//       toast.error(err.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
//       <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
//         {/* Modal Header */}
//         <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-slate-50">
//           <div>
//             <h2 className="text-2xl font-black text-slate-900">Edit Vehicle</h2>
//             <p className="text-xs text-blue-600 font-bold uppercase tracking-widest flex items-center gap-1">
//               {isAdmin ? <><ShieldCheck size={12} /> Admin Mode</> : "Standard Edit"}
//             </p>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          
//           {/* STATUS SECTION: Controlled by Admin */}
//           <div className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all duration-300 ${
//             currentStatus === 'approved' ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
//           }`}>
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${currentStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'}`}>
//                 {currentStatus === 'approved' ? <CheckCircle size={20} /> : <Clock size={20} />}
//               </div>
//               <div>
//                 <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Vehicle Status</p>
//                 <p className="text-sm font-black text-slate-900 uppercase">
//                   {currentStatus === 'approved' ? "Approved & Live" : "Pending Approval"}
//                 </p>
//               </div>
//             </div>

//             {/* Admin can change status, Dealer cannot */}
//             {isAdmin ? (
//               <select 
//                 {...register("status")}
//                 className={`text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none cursor-pointer border-none shadow-sm ${
//                   currentStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'
//                 }`}
//               >
//                 <option value="pending">Pending</option>
//                 <option value="approved">Approved</option>
//               </select>
//             ) : (
//               <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-4 py-2 rounded-xl uppercase">
//                 Read Only
//               </span>
//             )}
//           </div>

//           {!isAdmin && (
//             <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100">
//               <AlertCircle size={14} />
//               <p className="text-[10px] font-bold uppercase">Only Administrators can verify and approve vehicles.</p>
//             </div>
//           )}

//           {/* Core Vehicle Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Vehicle Model</label>
//               <input {...register("carName", { required: true })} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" />
//             </div>
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Car Company</label>
//               <input {...register("carCompany", { required: true })} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Plate Number</label>
//               <input {...register("carNumber")} disabled className="w-full bg-slate-100 border-none p-4 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed uppercase" />
//             </div>
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Transmission</label>
//               <select {...register("transmission")} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold outline-none">
//                 <option value="manual">Manual</option>
//                 <option value="automatic">Automatic</option>
//               </select>
//             </div>
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Price / Day</label>
//               <input type="number" {...register("pricePerDay", { required: true })} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold outline-none" />
//             </div>
//           </div>

//           <div className="space-y-1">
//             <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Features (Comma separated)</label>
//             <textarea {...register("carFeatures")} rows="2" className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium outline-none resize-none" placeholder="AC, GPS, Bluetooth..." />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4 pt-4">
//             <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all">
//               Cancel
//             </button>
//             <button 
//               disabled={loading}
//               type="submit" 
//               className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
//             >
//               {loading ? "Updating..." : <><Save size={18} /> Save Vehicle Details</>}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditCarModal;