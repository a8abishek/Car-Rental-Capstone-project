import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/apiFetch";
import { toast } from "react-hot-toast";
import {
  Search,
  MapPin,
  Calendar,
  X,
  Star,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  ChevronLeft, // Added for pagination
  ChevronRight, // Added for pagination
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

  // THEME STATE
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  //REVIEW STATES
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
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

    window.addEventListener("storage", applyTheme);
    window.addEventListener("themeChanged", applyTheme);
    applyTheme();

    return () => {
      window.removeEventListener("storage", applyTheme);
      window.removeEventListener("themeChanged", applyTheme);
    };
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/bookings/my-bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.comment.trim()) return toast.error("Comment is required");

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
      setReviewData({ rating: 5, comment: "" });
      fetchMyBookings();
    } catch (err) {
      toast.error("Action failed");
    }
  };

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

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 md:p-10 font-sans ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#FDFDFD] text-slate-900"}`}
    >
      <div className="max-w-7xl mx-auto">
        <h1
          className={`text-3xl font-black mb-10 tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
        >
          Booking History
        </h1>

        <div
          className={`flex gap-8 mb-6 border-b ${theme === "dark" ? "border-slate-800" : "border-gray-100"}`}
        >
          {["upcoming", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold capitalize relative ${activeTab === tab ? "text-indigo-600" : "text-gray-400"}`}
            >
              {tab}{" "}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div
          className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
        >
          <table className="w-full text-left">
            <thead>
              <tr
                className={`text-[11px] font-black text-gray-400 uppercase tracking-widest ${theme === "dark" ? "bg-slate-800/50 border-b border-slate-800" : "bg-gray-50/50 border-b border-gray-100"}`}
              >
                <th className="p-5">Car Details</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <React.Fragment key={item._id}>
                  <tr
                    className={`transition-all cursor-pointer border-b ${theme === "dark" ? "border-slate-800 hover:bg-slate-800/50" : "border-gray-50 hover:bg-gray-50/50"}`}
                    onClick={() =>
                      setExpandedRow(expandedRow === item._id ? null : item._id)
                    }
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.car?.carImage}
                          className="w-12 h-12 rounded-lg object-cover"
                          alt="car"
                        />
                        <div>
                          <p
                            className={`font-bold text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                          >
                            {item.car?.carName}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono italic">
                            #{item._id?.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`p-5 text-sm font-black ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}
                    >
                      ₹{item.totalAmount}
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.status === "cancelled" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
                      >
                        {item.status}
                      </span>
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
                                className={`p-2 rounded-lg transition ${theme === "dark" ? "text-blue-400 bg-blue-900/20 hover:bg-blue-900/40" : "text-blue-600 bg-blue-50 hover:bg-blue-100"}`}
                                title="Edit Review"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteReview(item.review._id);
                                }}
                                className={`p-2 rounded-lg transition ${theme === "dark" ? "text-rose-400 bg-rose-900/20 hover:bg-rose-900/40" : "text-rose-600 bg-rose-50 hover:bg-rose-100"}`}
                                title="Delete Review"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(false);
                                setReviewData({ rating: 5, comment: "" });
                                setSelectedBooking(item);
                              }}
                              className="flex items-center gap-2 text-indigo-600 font-bold text-xs border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
                            >
                              <Star size={14} /> Review
                            </button>
                          ))}
                        {activeTab === "upcoming" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(item._id);
                            }}
                            className="text-rose-600 font-bold text-xs px-4 py-2 rounded-xl border border-rose-100 hover:bg-rose-50"
                          >
                            Cancel
                          </button>
                        )}
                        <div className="text-gray-400">
                          {expandedRow === item._id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === item._id && (
                    <tr
                      className={`${theme === "dark" ? "bg-slate-800/30" : "bg-slate-50/50"} animate-in fade-in slide-in-from-top-1`}
                    >
                      <td
                        colSpan="4"
                        className={`p-6 text-sm border-b ${theme === "dark" ? "border-slate-800" : "border-gray-100"}`}
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              Pickup Location
                            </p>
                            <p
                              className={`font-semibold ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
                            >
                              {item.pickupLocation}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              Drop Location
                            </p>
                            <p
                              className={`font-semibold ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
                            >
                              {item.dropLocation}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              Trip Date
                            </p>
                            <p
                              className={`font-semibold ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
                            >
                              {new Date(item.pickupDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              Booking Type
                            </p>
                            <p
                              className={`font-semibold capitalize ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
                            >
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

          {/* --- PAGINATION CONTROLS --- */}
          {filteredBookings.length > itemsPerPage && (
            <div className={`p-4 flex items-center justify-between border-t ${theme === "dark" ? "border-slate-800 bg-slate-900/50" : "border-gray-100 bg-gray-50/30"}`}>
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={`p-2 rounded-lg transition-all ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : theme === "dark" ? "hover:bg-slate-800 text-white" : "hover:bg-gray-100 text-slate-700"}`}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : theme === "dark" ? "hover:bg-slate-800 text-white" : "hover:bg-gray-100 text-slate-700"}`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {filteredBookings.length === 0 && (
            <p className="text-center py-12 text-slate-400">
              No bookings in this category
            </p>
          )}
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
              className={`rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 border border-slate-800" : "bg-white"}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className={`text-xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  {isEditing ? "Update Review" : "Add a Review"}
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className={`p-1 rounded-full transition ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
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
                <textarea
                  className={`w-full border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-colors ${theme === "dark" ? "bg-slate-800 text-slate-200 placeholder:text-slate-500" : "bg-slate-50 text-slate-700"}`}
                  rows="4"
                  placeholder="How was your trip?"
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  {isEditing ? "Save Changes" : "Submit Review"}
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