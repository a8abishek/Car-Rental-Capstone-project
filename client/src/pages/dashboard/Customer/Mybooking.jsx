import React, { useEffect, useState } from 'react';
import { apiFetch } from "../../../api/apiFetch";
import { toast } from "react-hot-toast";
import { 
  Search, MapPin, Calendar, X, Star, Download, ChevronDown, ChevronUp, RefreshCcw
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Mybooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // --- REVIEW STATES ---
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/bookings/my-bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyBookings(); }, []);

const handleReviewSubmit = async (e) => {
  e.preventDefault();
  
  if (!reviewData.comment.trim()) {
    return toast.error("Please add a comment");
  }

  try {
    // We manually wrap the body in JSON.stringify because your apiFetch doesn't do it
    await apiFetch("/api/review/addreview", {
      method: "POST",
      body: JSON.stringify({
        carId: selectedBooking.car._id,
        bookingId: selectedBooking._id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
    });
    
    toast.success("Thank you for your review!");
    setSelectedBooking(null);
    setReviewData({ rating: 5, comment: "" });
    fetchMyBookings(); 
  } catch (err) {
    toast.error(err.message || "Failed to submit review");
  }
};

  const filteredBookings = bookings.filter((item) => {
    const isPast = new Date(item.dropDate) < new Date();
    const carName = (item.car?.carName || "").toLowerCase();
    const matchesSearch = carName.includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'cancelled') return item.status === 'cancelled';
    if (activeTab === 'completed') return item.status === 'confirmed' && isPast;
    if (activeTab === 'upcoming') return (item.status === 'pending' || item.status === 'confirmed') && !isPast;
    return false;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-10">Booking History</h1>

        {/* TABS */}
        <div className="flex gap-8 mb-6 border-b border-gray-100">
          {['upcoming', 'completed', 'cancelled'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`pb-4 text-sm font-bold capitalize relative ${activeTab === tab ? "text-indigo-600" : "text-gray-400"}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-5">Car Details</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img src={item.car?.carImage} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="car" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{item.car?.brand} {item.car?.carName}</p>
                        <p className="text-[10px] text-gray-400 font-mono italic">#{item._id?.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-sm font-black text-slate-700">₹{item.totalAmount}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    {activeTab === 'completed' && (
                      <button 
                        onClick={() => setSelectedBooking(item)}
                        className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xs border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      >
                        <Star size={14} /> Rate Trip
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && !loading && (
            <div className="p-20 text-center text-gray-400 font-medium">No bookings found in this category.</div>
          )}
        </div>

        {/* REVIEW MODAL */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl scale-in-center">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Rate your Experience</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-1">{selectedBooking.car?.carName}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="text-center bg-slate-50 py-6 rounded-3xl">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">Overall Rating</label>
                  <div className="flex justify-center gap-2">
                    {[1,2,3,4,5].map(num => (
                      <Star 
                        key={num} 
                        size={32} 
                        className={`cursor-pointer transition-transform active:scale-90 ${reviewData.rating >= num ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                        onClick={() => setReviewData({...reviewData, rating: num})} 
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Feedback</label>
                  <textarea 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
                    rows="4" 
                    placeholder="How was the car and the service?"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-[0.98]">
                  Submit Review
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