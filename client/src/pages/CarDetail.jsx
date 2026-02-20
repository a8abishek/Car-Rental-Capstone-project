import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import {
  Users, Fuel, Settings, Star, ChevronLeft,
  CheckCircle, ShieldCheck, MapPin, Shield
} from "lucide-react";
import { apiFetch } from "../api/apiFetch";

// 1. Validation Schema
const bookingSchema = z.object({
  pickupLocation: z.string().min(3, "Pickup location is required"),
  dropLocation: z.string().min(3, "Drop location is required"),
  pickupDate: z.date({ required_error: "Pickup date is required" }),
  dropDate: z.date({ required_error: "Drop date is required" }),
  drivingLicense: z.string().optional(),
}).refine((data) => data.dropDate > data.pickupDate, {
  message: "Drop-off must be after pickup date",
  path: ["dropDate"],
});

function CarDetail (){
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [bookingType, setBookingType] = useState("self");

  const DRIVER_FEE = 500;

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { pickupLocation: "", dropLocation: "", pickupDate: null, dropDate: null }
  });

  const watchPickupDate = watch("pickupDate");
  const watchDropDate = watch("dropDate");

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carData, datesData] = await Promise.all([
          apiFetch(`/api/cars/${id}`),
          apiFetch(`/api/bookings/unavailable/${id}`)
        ]);
        setCar(carData);
        setUnavailableDates(datesData);
      } catch (err) {
        toast.error("Car details could not be loaded");
      }
    };
    fetchData();
  }, [id]);

  // Logic to block dates
  const getDisabledDates = () => {
    const dates = [];
    unavailableDates.forEach((booking) => {
      let current = new Date(booking.pickupDate);
      const end = new Date(booking.dropDate);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  };

  const calculateDays = () => {
    if (!watchPickupDate || !watchDropDate) return 1;
    const diff = Math.ceil((watchDropDate - watchPickupDate) / (1000 * 60 * 60 * 24));
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
    // Navigate to payment
    navigate("/payment", {
      state: { car, bookingType, formData: data, daysCount, totalAmount: finalTotal },
    });
  };

  if (!car) return <div className="min-h-screen flex items-center justify-center bg-white font-bold text-blue-600 animate-pulse text-xl">Loading Luxury Ride...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-blue-600 mb-4 transition">
          <ChevronLeft size={16} /> <span className="font-semibold">Back to fleet</span>
        </button>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{car.carName}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
        {/* LEFT COLUMN: Car Details */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
            <img src={car.carImage} className="w-full h-137.5 object-cover" alt={car.carName} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Transmission", val: car.transmission, icon: <Settings size={20}/> },
              { label: "Fuel Type", val: car.carRunning, icon: <Fuel size={20}/> },
              { label: "Capacity", val: `${car.seatingCapacity} Seats`, icon: <Users size={20}/> },
              { label: "Assurance", val: "Full Cover", icon: <ShieldCheck size={20}/> },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 p-6 rounded-4xl text-center flex flex-col items-center shadow-sm">
                <div className="text-blue-600 mb-3 bg-blue-50 p-3 rounded-2xl">{item.icon}</div>
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{item.label}</p>
                <p className="text-sm font-bold text-gray-800 capitalize">{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/*Sidebar Booking Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit(onBookingSubmit)} className="sticky top-10 space-y-6">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
              <h2 className="text-3xl font-black text-slate-900">₹{car.pricePerDay} <span className="text-sm font-medium text-gray-400">/ day</span></h2>

              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button type="button" onClick={() => setBookingType("self")} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${bookingType === "self" ? "bg-white text-blue-600 shadow-md" : "text-gray-400"}`}>Self Drive</button>
                <button type="button" onClick={() => setBookingType("driver")} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${bookingType === "driver" ? "bg-white text-blue-600 shadow-md" : "text-gray-400"}`}>With Driver</button>
              </div>

              <div className="space-y-5">
                {/* Pickup Location */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup Location</label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                    <input {...register("pickupLocation")} placeholder="Where to start?" className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-100" />
                  </div>
                  {errors.pickupLocation && <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold">{errors.pickupLocation.message}</p>}
                </div>

                {/* Drop Location */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Drop Location</label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input {...register("dropLocation")} placeholder="Where to end?" className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-100" />
                  </div>
                  {errors.dropLocation && <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold">{errors.dropLocation.message}</p>}
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup Date</label>
                    <Controller
                      control={control}
                      name="pickupDate"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                            setValue("dropDate", null);
                          }}
                          excludeDates={getDisabledDates()}
                          minDate={new Date()}
                          placeholderText="Select Date"
                          autoComplete="off"
                          className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold mt-1 cursor-pointer"
                        />
                      )}
                    />
                    {errors.pickupDate && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">Required</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Drop Date</label>
                    <Controller
                      control={control}
                      name="dropDate"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          excludeDates={getDisabledDates()}
                          minDate={watchPickupDate || new Date()}
                          placeholderText="Select Date"
                          autoComplete="off"
                          className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold mt-1 cursor-pointer"
                        />
                      )}
                    />
                    {errors.dropDate && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">Check date</p>}
                  </div>
                </div>

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

              {/* Price Calculation Card */}
              <div className="bg-[#f8fafc] rounded-4xl p-6 text-white space-y-3 shadow-xl">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Rental Cost</span>
                  <span className="font-bold">₹{totalBasePrice}</span>
                </div>
                {bookingType === "driver" && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Chauffeur Fee</span>
                    <span className="text-blue-400 font-bold">+ ₹{driverCost}</span>
                  </div>
                )}
                <div className="border-t border-black pt-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-black">Total Amount</span>
                  <span className="text-2xl font-black text-blue-400">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-blue-200 active:scale-95 text-sm uppercase tracking-widest"
              >
                Reserve Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;