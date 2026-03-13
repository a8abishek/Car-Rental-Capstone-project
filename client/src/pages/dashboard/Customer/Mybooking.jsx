import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/apiFetch";
import { toast } from "react-hot-toast";
import {
  X,
  Star,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

function Mybooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // REVIEW STATES
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);

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
    applyTheme();
    window.addEventListener("storage", applyTheme);
    return () => window.removeEventListener("storage", applyTheme);
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/bookings/my-bookings");
      setBookings(Array.isArray(data) ? [...data].reverse() : []);
      
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  //Review Submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewData.rating === 0)
      return toast.error("Please select a star rating");
    if (!reviewData.comment.trim())
      return toast.error("Please share your experience in the comment");

    try {
      const url = isEditing
        ? `/api/review/${currentReviewId}`
        : "/api/review/addreview";
      const method = isEditing ? "PUT" : "POST";

      await apiFetch(url, {
        method: method,
        body: JSON.stringify({
          carId: selectedBooking.car._id,
          bookingId: selectedBooking._id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      toast.success(isEditing ? "Review updated!" : "Review submitted!");
      setSelectedBooking(null);
      setIsEditing(false);
      setReviewData({ rating: 0, comment: "" });
      fetchMyBookings();
    } catch (err) {
      toast.error("Action failed");
    }
  };
  //Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await apiFetch(`/api/review/${reviewId}`, { method: "DELETE" });
      toast.success("Review deleted successfully");
      fetchMyBookings();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };
  //Cancel Booking
  const handleCancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await apiFetch(`/api/bookings/cancel/${id}`, { method: "PUT" });
      toast.success("Booking Cancelled");
      fetchMyBookings();
    } catch (err) {
      toast.error("Cancellation failed");
    }
  };

  // for booking status getStatusStyle (status -> pending,confirm,cancel)
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "confirmed":
        return "bg-emerald-100 text-emerald-700";
      case "cancelled":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredBookings = bookings.filter((item) => {
    const isPast = new Date(item.dropDate) < new Date();
    const carName = (item.car?.carName || "").toLowerCase();
    const matchesSearch = carName.includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "cancelled") return item.status === "cancelled";
    if (activeTab === "completed") return item.status === "confirmed" && isPast;
    if (activeTab === "upcoming")
      return (
        (item.status === "pending" || item.status === "confirmed") && !isPast
      );
    return false;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentData = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 md:p-10 font-sans ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#FDFDFD] text-slate-900"}`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black mb-10 tracking-tight">
          Booking History
        </h1>

        {/* Tabs */}
        <div
          className={`flex flex-wrap gap-4 md:gap-8 mb-6 border-b ${theme === "dark" ? "border-slate-800" : "border-gray-100"}`}
        >
          {["upcoming", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs md:text-sm font-bold capitalize relative ${activeTab === tab ? "text-indigo-600" : "text-gray-400"}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div
          className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
        >
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-175">
              <thead>
                <tr
                  className={`text-[11px] font-black text-gray-400 uppercase tracking-widest ${theme === "dark" ? "bg-slate-800/50 border-b border-slate-800" : "bg-gray-50/50 border-b border-gray-100"}`}
                >
                  <th className="p-5">Car Details</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5 text-center">Booking Status</th>
                  <th className="p-5 text-center">Payment Status</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-0">
                {currentData.map((item) => (
                  <React.Fragment key={item._id}>
                    <tr
                      className={`transition-all ${theme === "dark" ? "hover:bg-slate-800/50" : "hover:bg-gray-50/50"}`}
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.car?.carImage}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm shrink-0"
                            alt="car"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-sm leading-tight truncate">
                              {item.car?.carName}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono tracking-tighter">
                              REF: #{item._id?.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-sm font-black text-indigo-600 whitespace-nowrap">
                        ₹{item.totalAmount}
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${getStatusStyle(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-[12px] font-bold capitalize ${item.paymentStatus === "paid" ? "text-emerald-600" : "text-red-500"}`}
                          >
                            {item.paymentStatus}
                          </span>
                          <p className="text-[9px] text-gray-400 font-mono leading-none">
                            {item.paymentId?.slice(0, 10)}...
                          </p>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-end gap-3">
                          {activeTab === "completed" &&
                            (item.review ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                    setCurrentReviewId(item.review._id);
                                    setReviewData({
                                      rating: item.review.rating,
                                      comment: item.review.comment,
                                    });
                                    setSelectedBooking(item);
                                  }}
                                  className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteReview(item.review._id);
                                  }}
                                  className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEditing(false);
                                  setReviewData({ rating: 0, comment: "" });
                                  setSelectedBooking(item);
                                }}
                                className="flex items-center gap-2 text-indigo-600 font-bold text-xs border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
                              >
                                <Star size={14} /> Review Trip
                              </button>
                            ))}
                          {activeTab === "upcoming" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelBooking(item._id);
                              }}
                              className="text-rose-600 font-bold text-xs px-4 py-2 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors whitespace-nowrap"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setExpandedRow(
                                expandedRow === item._id ? null : item._id,
                              )
                            }
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            {expandedRow === item._id ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === item._id && (
                      <tr
                        className={`${theme === "dark" ? "bg-slate-800/30" : "bg-slate-50/50"} animate-in fade-in slide-in-from-top-1`}
                      >
                        <td colSpan="5" className="p-6 text-sm">
                          <div className="grid grid-cols-4  gap-6">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                Pickup Location
                              </p>
                              <p className="font-semibold">
                                {item.pickupLocation}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                Drop Location
                              </p>
                              <p className="font-semibold">
                                {item.dropLocation}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                Trip Date
                              </p>
                              <p className="font-semibold">
                                {new Date(item.pickupDate).toLocaleDateString()} — {new Date(item.dropDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                Booking Type
                              </p>
                              <p className="font-semibold capitalize">
                                {item.bookingType}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-xs font-bold text-slate-400">
            <span>
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`p-2 rounded-lg border transition-colors ${theme === "dark" ? "bg-slate-800 border-slate-700 text-white disabled:opacity-20" : "bg-white border-slate-200 text-slate-500 disabled:opacity-30"}`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`p-2 rounded-lg border transition-colors ${theme === "dark" ? "bg-slate-800 border-slate-700 text-white disabled:opacity-20" : "bg-white border-slate-200 text-slate-500 disabled:opacity-30"}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* --- REVIEW MODAL --- */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-slate-900/40  flex items-center justify-center p-4 z-100 transition-all">
            <div
              className={`rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl transition-all ${theme === "dark" ? "bg-slate-900 border border-slate-800" : "bg-white"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  {isEditing ? "Modify Your Experience" : "Share Your Journey"}
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="flex items-start gap-3 p-4 mb-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400 leading-snug font-medium">
                  Your feedback helps us improve! Please rate the vehicle
                  condition and the overall booking service.
                </p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        size={32}
                        className={`cursor-pointer transition-all active:scale-90 ${reviewData.rating >= num ? "text-yellow-400 fill-yellow-400" : theme === "dark" ? "text-slate-700" : "text-gray-200"}`}
                        onClick={() =>
                          setReviewData({ ...reviewData, rating: num })
                        }
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Star Rating
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                    Tell us more
                  </label>
                  <textarea
                    className={`w-full border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 text-sm font-medium transition-colors resize-none ${theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-slate-50 text-slate-700"}`}
                    rows="4"
                    placeholder="Describe your trip, car condition, or any issues you faced..."
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, comment: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
                >
                  {isEditing ? "Update Review" : "Post Review"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mybooking;
