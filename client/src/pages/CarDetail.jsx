import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import {
  Users,
  Fuel,
  Settings,
  Star,
  ChevronLeft,
  ShieldCheck,
  MapPin,
  X,
  MessageSquare,
  Trash2,
  Edit3,
} from "lucide-react";
import { apiFetch } from "../api/apiFetch";

// 1. Validation Schema
const bookingSchema = z
  .object({
    pickupLocation: z.string().min(3, "Pickup location is required"),
    dropLocation: z.string().min(3, "Drop location is required"),
    pickupDate: z.date({ required_error: "Pickup date is required" }),
    dropDate: z.date({ required_error: "Drop date is required" }),
    drivingLicense: z.string().optional(),
  })
  .refine((data) => data.dropDate > data.pickupDate, {
    message: "Drop-off must be after pickup date",
    path: ["dropDate"],
  });

function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [bookingType, setBookingType] = useState("self");

  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewData, setEditReviewData] = useState({
    rating: 5,
    comment: "",
  });

  const DRIVER_FEE = 500;
  const isLoggedIn = !!localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickupLocation: "",
      dropLocation: "",
      pickupDate: null,
      dropDate: null,
      drivingLicense: "",
    },
  });

  const watchPickupDate = watch("pickupDate");

  //get detail for car,review
  const fetchData = async () => {
    try {
      const [carData, datesData, reviewsData] = await Promise.all([
        apiFetch(`/api/cars/${id}`),
        apiFetch(`/api/bookings/unavailable/${id}`),
        apiFetch(`/api/review/car/${id}`),
      ]);
      setCar(carData);
      setUnavailableDates(datesData);
      setReviews(reviewsData || []);

      if (isLoggedIn) {
        const userData = await apiFetch("/api/users/me");
        setCurrentUser(userData);
      }
    } catch (err) {
      toast.error("Data could not be loaded");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  //Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await apiFetch(`/api/review/${reviewId}`, { method: "DELETE" });
      toast.success("removed!");
      fetchData();
    } catch (err) {
      toast.error("Failed");
    }
  };

  //Review update 
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/api/review/${editingReviewId}`, {
        method: "PUT",
        body: JSON.stringify(editReviewData),
      });
      toast.success("Review Updated");
      setEditingReviewId(null);
      fetchData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  //get Disabled Dates
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
    const pick = watch("pickupDate");
    const drop = watch("dropDate");
    if (!pick || !drop) return 1;
    const diff = Math.ceil((drop - pick) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const daysCount = calculateDays();
  const finalTotal = car
    ? daysCount * car.pricePerDay +
      (bookingType === "driver" ? daysCount * DRIVER_FEE : 0)
    : 0;

  const onBookingSubmit = (data) => {
    if (!isLoggedIn) {
      toast.error("Please login");
      return navigate("/login");
    }
    if (bookingType === "self" && !data.drivingLicense)
      return toast.error("DL required");

    const formattedData = {
      ...data,
      pickupDate: data.pickupDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      dropDate: data.dropDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    navigate("/payment", {
      state: {
        car,
        bookingType,
        formData: formattedData,
        daysCount,
        totalAmount: finalTotal,
      },
    });
  };

  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold animate-pulse text-xl">
        Loading...
      </div>
    );

  return (
    <div
      className={`min-h-screen pb-20 font-sans transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#F8FAFC] text-slate-900"}`}
    >
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-400 hover:text-blue-600 mb-4 transition font-semibold"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <h1 className="text-5xl font-black tracking-tighter">{car.carName}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
        <div className="lg:col-span-8 space-y-10">
          <div
            className={`rounded-[2.5rem] overflow-hidden shadow-2xl border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-white"}`}
          >
            <img
              src={car.carImage}
              className="w-full h-137.5 object-cover"
              alt={car.carName}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Transmission",
                val: car.transmission,
                icon: <Settings size={20} />,
              },
              {
                label: "Fuel Type",
                val: car.carRunning,
                icon: <Fuel size={20} />,
              },
              {
                label: "Capacity",
                val: `${car.seatingCapacity} Seats`,
                icon: <Users size={20} />,
              },
              {
                label: "Assurance",
                val: "Full Cover",
                icon: <ShieldCheck size={20} />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`border p-6 rounded-4xl text-center flex flex-col items-center shadow-sm ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
              >
                <div
                  className={`mb-3 p-3 rounded-2xl ${theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"}`}
                >
                  {item.icon}
                </div>
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">
                  {item.label}
                </p>
                <p
                  className={`text-sm font-bold capitalize ${theme === "dark" ? "text-slate-200" : "text-gray-800"}`}
                >
                  {item.val}
                </p>
              </div>
            ))}
          </div>

          <div
            className={`rounded-[2.5rem] p-10 shadow-sm border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black">Customer Experience</h3>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold ${theme === "dark" ? "bg-blue-900/40 text-blue-400" : "bg-blue-50 text-blue-600"}`}
              >
                <Star size={18} fill="currentColor" /> {reviews.length} Reviews
              </div>
            </div>
            <div className="space-y-8">
              {reviews.length > 0 ? (
                <>
                  {reviews.slice(0, 3).map((rev) => (
                    <div
                      key={rev._id}
                      className={`border-b pb-6 last:border-0 last:pb-0 ${theme === "dark" ? "border-slate-700" : "border-slate-50"}`}
                    >
                      <div className="flex justify-between items-start mb-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold uppercase ${theme === "dark" ? "bg-blue-900 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                          >
                            {rev.customer?.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold">
                                {rev.customer?.name || "User"}
                              </p>
                              {currentUser?._id === rev.customer?._id && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingReviewId(rev._id);
                                      setEditReviewData({
                                        rating: rev.rating,
                                        comment: rev.comment,
                                      });
                                    }}
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReview(rev._id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="flex text-yellow-400 gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  fill={
                                    i < rev.rating ? "currentColor" : "none"
                                  }
                                  className={
                                    i < rev.rating ? "" : "text-slate-600"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        className={`text-sm italic pl-13 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
                      >
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className={`w-full py-4 mt-4 border-2 border-dashed rounded-2xl font-bold transition-all ${theme === "dark" ? "border-slate-600 text-blue-400 hover:bg-slate-700" : "border-slate-100 text-blue-600 hover:bg-blue-50"}`}
                    >
                      View All Reviews
                    </button>
                  )}
                </>
              ) : (
                <p className="text-center text-slate-500 py-10 font-bold">
                  No reviews yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <form
            onSubmit={handleSubmit(onBookingSubmit)}
            className="sticky top-10 space-y-6"
          >
            <div
              className={`border rounded-[2.5rem] p-8 shadow-2xl space-y-6 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
            >
              <h2 className="text-3xl font-black">
                ₹{car.pricePerDay}{" "}
                <span className="text-sm font-medium text-gray-400">/ day</span>
              </h2>

              <div
                className={`flex p-1.5 rounded-2xl ${theme === "dark" ? "bg-slate-900" : "bg-slate-100"}`}
              >
                <button
                  type="button"
                  onClick={() => setBookingType("self")}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${bookingType === "self" ? (theme === "dark" ? "bg-slate-700 text-blue-400 shadow-md" : "bg-white text-blue-600 shadow-md") : "text-gray-400"}`}
                >
                  Self Drive
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType("driver")}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${bookingType === "driver" ? (theme === "dark" ? "bg-slate-700 text-blue-400 shadow-md" : "bg-white text-blue-600 shadow-md") : "text-gray-400"}`}
                >
                  With Driver
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Pickup Location
                  </label>
                  <div
                    className={`relative mt-1 ${errors.pickupLocation ? "ring-2 ring-red-500 rounded-2xl" : ""}`}
                  >
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                      size={18}
                    />
                    <input
                      {...register("pickupLocation")}
                      placeholder="Pickup Location"
                      className={`w-full border-none p-4 pl-12 rounded-2xl outline-none text-sm font-medium ${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"}`}
                    />
                  </div>
                  {errors.pickupLocation && (
                    <p className="text-[10px] text-red-500 mt-1 font-bold ml-2">
                      {errors.pickupLocation.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Drop Location
                  </label>
                  <div
                    className={`relative mt-1 ${errors.dropLocation ? "ring-2 ring-red-500 rounded-2xl" : ""}`}
                  >
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      {...register("dropLocation")}
                      placeholder="Drop Location"
                      className={`w-full border-none p-4 pl-12 rounded-2xl outline-none text-sm font-medium ${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"}`}
                    />
                  </div>
                  {errors.dropLocation && (
                    <p className="text-[10px] text-red-500 mt-1 font-bold ml-2">
                      {errors.dropLocation.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Pickup Date
                    </label>
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
                          placeholderText="Select"
                          className={`w-full p-4 rounded-2xl outline-none text-xs font-bold mt-1 cursor-pointer ${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"} ${errors.pickupDate ? "ring-2 ring-red-500" : ""}`}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Drop Date
                    </label>
                    <Controller
                      control={control}
                      name="dropDate"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          excludeDates={getDisabledDates()}
                          minDate={watchPickupDate || new Date()}
                          placeholderText="Select"
                          className={`w-full p-4 rounded-2xl outline-none text-xs font-bold mt-1 cursor-pointer ${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"} ${errors.dropDate ? "ring-2 ring-red-500" : ""}`}
                        />
                      )}
                    />
                  </div>
                </div>

                {bookingType === "self" && (
                  <div
                    className={`pt-4 border-t mt-4 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}
                  >
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Driving License
                    </label>
                    <div
                      className={`relative mt-2 ${errors.drivingLicense ? "ring-2 ring-red-500 rounded-2xl" : ""}`}
                    >
                      <ShieldCheck
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                        size={18}
                      />
                      <input
                        {...register("drivingLicense")}
                        placeholder="DL Number"
                        className={`w-full border-none p-4 pl-12 rounded-2xl outline-none text-sm font-medium ${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`rounded-4xl p-6 space-y-3 shadow-xl ${theme === "dark" ? "bg-slate-900/50 text-slate-300" : "bg-[#f8fafc] text-slate-700"}`}
              >
                <div className="flex justify-between text-xs">
                  <span>Rental ({daysCount} Days)</span>
                  <span
                    className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-800"}`}
                  >
                    ₹{daysCount * (car?.pricePerDay || 0)}
                  </span>
                </div>
                {bookingType === "driver" && (
                  <div className="flex justify-between text-xs">
                    <span>Chauffeur Fee</span>
                    <span className="text-blue-400 font-bold">
                      + ₹{daysCount * DRIVER_FEE}
                    </span>
                  </div>
                )}
                <div
                  className={`border-t pt-3 flex justify-between items-center ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`}
                >
                  <span
                    className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                  >
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-blue-600">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest"
              >
                {isLoggedIn ? "Reserve Now" : "Login to Reserve"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- ALL REVIEWS MODAL --- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-100">
          <div
            className={`rounded-[3rem] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col ${theme === "dark" ? "bg-slate-800 border border-slate-700 text-white" : "bg-white text-slate-900"}`}
          >
            <div
              className={`p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="text-blue-600" />
                <h3 className="text-2xl font-black">
                  User Reviews ({reviews.length})
                </h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className={`p-2 rounded-full transition ${theme === "dark" ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar text-sm">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className={`border-b pb-8 last:border-0 ${theme === "dark" ? "border-slate-700" : "border-slate-50"}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${theme === "dark" ? "bg-blue-900 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                      >
                        {rev.customer?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold">
                            {rev.customer?.name || "User"}
                          </p>
                          {currentUser?._id === rev.customer?._id && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingReviewId(rev._id);
                                  setEditReviewData({
                                    rating: rev.rating,
                                    comment: rev.comment,
                                  });
                                }}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(rev._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex text-yellow-400 gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < rev.rating ? "currentColor" : "none"}
                              className={i < rev.rating ? "" : "text-slate-600"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p
                    className={`italic pl-15 leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
                  >
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingReviewId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-200">
          <div
            className={`rounded-4xl p-8 w-full max-w-md shadow-2xl ${theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Edit Review</h3>
              <button onClick={() => setEditingReviewId(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateReview} className="space-y-4">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className="cursor-pointer"
                    fill={star <= editReviewData.rating ? "gold" : "none"}
                    color="gold"
                    onClick={() =>
                      setEditReviewData({ ...editReviewData, rating: star })
                    }
                  />
                ))}
              </div>
              <textarea
                className={`w-full p-4 rounded-2xl outline-none text-sm font-medium resize-none ${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"}`}
                rows="4"
                value={editReviewData.comment}
                onChange={(e) =>
                  setEditReviewData({
                    ...editReviewData,
                    comment: e.target.value,
                  })
                }
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarDetail;
