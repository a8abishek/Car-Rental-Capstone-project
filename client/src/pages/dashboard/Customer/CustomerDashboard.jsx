import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { apiFetch } from '../../../api/apiFetch';
import { 
  Calendar, Clock, Wallet, MapPin, 
  ArrowRightLeft, Plus, XCircle, Info, FileText 
} from 'lucide-react';

function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const response = await apiFetch("/api/bookings/customer/stats");
      setData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await apiFetch(`/api/bookings/cancel/${id}`, { method: 'PUT' });
        alert("Booking cancelled successfully");
        fetchDashboard(); // Refresh data
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading your dashboard...</div>;

  return (
    <div className="p-8 bg-[#F4F7FE] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Check your latest rentals and account activity</p>
        </div>
        <button 
          onClick={() => navigate("/cars")}
          className="bg-[#4318FF] hover:bg-[#3311CC] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={20} /> New Booking
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-5 rounded-3xl flex items-center gap-4 shadow-sm border border-white">
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><Calendar size={24}/></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Bookings</p>
            <h2 className="text-2xl font-black text-slate-800">{data?.totalBookings || 0}</h2>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl flex items-center gap-4 shadow-sm border border-white">
          <div className="bg-amber-50 p-4 rounded-2xl text-amber-500"><Clock size={24}/></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Trips</p>
            <h2 className="text-2xl font-black text-slate-800">{data?.activeRental ? 1 : 0}</h2>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl flex items-center gap-4 shadow-sm border border-white">
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-500"><Wallet size={24}/></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Spent Total</p>
            <h2 className="text-2xl font-black text-slate-800">₹{data?.totalSpent?.toLocaleString() || "0"}</h2>
          </div>
        </div>
      </div>

      {/* ACTIVE RENTAL */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Current Rental</h3>
            {data?.activeRental && (
                <button 
                    onClick={() => handleCancel(data.activeRental._id)}
                    className="flex items-center gap-1 text-rose-500 text-xs font-bold hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <XCircle size={14} /> Cancel Booking
                </button>
            )}
        </div>
        
        {data?.activeRental ? (
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm flex flex-col lg:flex-row border border-white p-2">
            <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden rounded-[24px]">
              <img src={data.activeRental.car?.carImage} alt="Car" className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-200">Live</span>
                <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{data.activeRental.car?.carNumber}</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{data.activeRental.car?.carName}</h2>
                  <p className="text-slate-400 flex items-center gap-1.5 text-sm font-medium mt-1 uppercase tracking-tighter">
                    <MapPin size={14} className="text-indigo-500" /> {data.activeRental.pickupLocation}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-[#4318FF]">₹{data.activeRental.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex gap-3 items-center">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm"><Calendar size={18} className="text-indigo-500" /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pickup</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(data.activeRental.pickupDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm"><Clock size={18} className="text-indigo-500" /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Drop-off</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(data.activeRental.dropDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex gap-6">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase">Fuel</p>
                        <p className="text-xs font-bold text-slate-600">{data.activeRental.car?.carRunning}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase">Type</p>
                        <p className="text-xs font-bold text-slate-600">{data.activeRental.car?.carType}</p>
                    </div>
                </div>
                <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                  Booking Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-16 rounded-[32px] text-center border-2 border-dashed border-slate-200">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Info size={32} />
             </div>
             <p className="text-slate-500 font-bold">You don't have any active rentals right now.</p>
             <button onClick={() => navigate("/cars")} className="text-indigo-600 text-sm font-black mt-2 hover:underline">Book your first ride &rarr;</button>
          </div>
        )}
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-white rounded-[32px] shadow-sm border border-white overflow-hidden p-4">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent History</h3>
          <button onClick={() => navigate("/my-bookings")} className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">View All Activity</button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase font-black text-slate-400 tracking-[0.1em]">
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Records</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data?.bookingHistory?.map((item) => (
              <tr key={item._id} className="group hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-5 flex items-center gap-4">
                  <div className="w-14 h-10 rounded-xl overflow-hidden shadow-sm bg-slate-100">
                    <img src={item.car?.carImage} className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                  </div>
                  <div>
                    <p className="font-black text-slate-700 text-sm tracking-tight">{item.car?.carName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">{item.car?.brand}</p>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-600 font-bold tracking-tight">
                   {new Date(item.pickupDate).toLocaleDateString('en-GB')}
                </td>
                <td className="px-6 py-5 font-black text-slate-800 text-sm italic">₹{item.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-5">
                  <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg tracking-widest ${
                    item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                    item.status === 'cancelled' ? 'bg-rose-100 text-rose-500' : 
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                    <button className="bg-slate-50 p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm border border-slate-100">
                        <FileText size={16} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerDashboard;