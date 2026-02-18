import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import {
  Users, Fuel, Settings, Star, ChevronLeft,
  CheckCircle, ShieldCheck, MapPin, Gauge, Shield, MessageCircle
} from "lucide-react";
import { apiFetch } from "../api/apiFetch";

// 1. Validation Schema
const bookingSchema = z.object({
  pickupLocation: z.string().min(3, "Pickup location is required"),
  dropLocation: z.string().min(3, "Drop location is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  dropDate: z.string().min(1, "Drop date is required"),
  drivingLicense: z.string().optional(),
}).refine((data) => new Date(data.dropDate) > new Date(data.pickupDate), {
  message: "Drop-off must be after pickup date",
  path: ["dropDate"],
});

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [bookingType, setBookingType] = useState("self");

  const DRIVER_FEE = 500;

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { pickupLocation: "", dropLocation: "", pickupDate: "", dropDate: "" }
  });

  const watchPickupDate = watch("pickupDate");
  const watchDropDate = watch("dropDate");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await apiFetch(`/api/cars/${id}`);
        setCar(data);
      } catch (err) {
        toast.error("Car not found");
      }
    };
    fetchCar();
  }, [id]);

  const calculateDays = () => {
    if (!watchPickupDate || !watchDropDate) return 1;
    const diff = Math.ceil((new Date(watchDropDate) - new Date(watchPickupDate)) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const daysCount = calculateDays();
  const totalBasePrice = car ? daysCount * car.pricePerDay : 0;
  const driverCost = bookingType === "driver" ? daysCount * DRIVER_FEE : 0;
  const finalTotal = totalBasePrice + driverCost;

  const onBookingSubmit = (data) => {
    if (bookingType === "self" && !data.drivingLicense) {
      return toast.error("Driving license is required for self-drive");
    }
    navigate("/payment", {
      state: { car, bookingType, formData: data, daysCount, totalAmount: finalTotal },
    });
  };

  if (!car) return <div className="min-h-screen flex items-center justify-center bg-white font-bold text-blue-600 animate-pulse text-xl">Loading Luxury Ride...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans text-slate-900">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-blue-600 mb-4 transition">
          <ChevronLeft size={16} /> <span className="font-semibold">Back to fleet</span>
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-blue-100">Luxury Elite</span>
          <div className="flex items-center text-yellow-500 text-xs">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
            <span className="text-gray-400 ml-2 font-medium">{car.rating || "4.8"} (Verified Dealer)</span>
          </div>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{car.carName}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
        
        {/* LEFT COLUMN: Single Large Image & Info */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-100/30 border border-white">
            <img src={car.carImage} className="w-full h-[550px] object-cover hover:scale-105 transition duration-700" alt={car.carName} />
          </div>

          {/* Core Specs icons from your DB schema */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Transmission", val: car.transmission, icon: <Settings size={20}/> },
              { label: "Fuel Type", val: car.carRunning, icon: <Fuel size={20}/> },
              { label: "Capacity", val: `${car.seatingCapacity} Seats`, icon: <Users size={20}/> },
              { label: "Assurance", val: "Full Cover", icon: <ShieldCheck size={20}/> },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 p-6 rounded-[2rem] text-center flex flex-col items-center shadow-sm">
                <div className="text-blue-600 mb-3 bg-blue-50 p-3 rounded-2xl">{item.icon}</div>
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{item.label}</p>
                <p className="text-sm font-bold text-gray-800 capitalize">{item.val}</p>
              </div>
            ))}
          </div>

          {/* Premium Features section */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold mb-8">Premium Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6">
              {car.carFeatures?.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle size={18} className="text-blue-600" />
                  <span className="capitalize">{feature}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Professional Sidebar Booking Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit(onBookingSubmit)} className="sticky top-10 space-y-6">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400">Daily Rate</p>
                  <h2 className="text-3xl font-black text-slate-900">₹{car.pricePerDay} <span className="text-sm font-medium text-gray-400">/ day</span></h2>
                </div>
                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Available</span>
              </div>

              {/* Mode Toggle Switch */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button type="button" onClick={() => setBookingType("self")} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${bookingType === "self" ? "bg-white text-blue-600 shadow-md scale-[1.02]" : "text-gray-400"}`}>Self Drive</button>
                <button type="button" onClick={() => setBookingType("driver")} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${bookingType === "driver" ? "bg-white text-blue-600 shadow-md scale-[1.02]" : "text-gray-400"}`}>With Driver</button>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-5">
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup Location</label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                    <input {...register("pickupLocation")} placeholder="Where to start?" className={`w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium`} />
                  </div>
                  {errors.pickupLocation && <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold">{errors.pickupLocation.message}</p>}
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Drop Location</label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input {...register("dropLocation")} placeholder="Where to end?" className={`w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium`} />
                  </div>
                  {errors.dropLocation && <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold">{errors.dropLocation.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup Date</label>
                    <input type="date" {...register("pickupDate")} className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold mt-1" />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Drop Date</label>
                    <input type="date" {...register("dropDate")} className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold mt-1" />
                  </div>
                </div>
                {errors.dropDate && <p className="text-[10px] text-red-500 text-center font-bold">{errors.dropDate.message}</p>}
                
                {bookingType === "self" && (
                   <div className="relative">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Driving License</label>
                   <div className="relative mt-1">
                     <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                     <input {...register("drivingLicense")} placeholder="DL Number" className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl outline-none text-sm font-medium" />
                   </div>
                 </div>
                )}
              </div>

              {/* Price Calculation "Receipt" Card */}
              <div className="bg-slate-50 rounded-[2rem] p-6 text-white space-y-3 shadow-xl">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Rental (₹{car.pricePerDay} × {daysCount} days)</span>
                  <span className=" font-bold">₹{totalBasePrice}</span>
                </div>
                {bookingType === "driver" && (
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Chauffeur Fee (₹500 × {daysCount} days)</span>
                    <span className="text-blue-400 font-bold">+ ₹{driverCost}</span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                  <span className="text-sm text-black font-bold tracking-tight">Estimated Total</span>
                  <span className="text-2xl font-black text-blue-400">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-blue-200 active:scale-95 text-sm uppercase tracking-widest">
                Reserve Now
              </button>
            </div>

            {/* Concierge Widget */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 shadow-inner">M</div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Concierge Support</p>
                <p className="text-xs font-bold text-gray-800">Questions about this car?</p>
                <button type="button" className="text-blue-600 text-xs font-black hover:underline mt-1">Chat with Marcus</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;