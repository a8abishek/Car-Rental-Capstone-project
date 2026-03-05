import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../../../api/apiFetch";
import {
  Calendar,
  Clock,
  Wallet,
  MapPin,
  Plus,
  XCircle,
  Info,
  FileText,
} from "lucide-react";

function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

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
        await apiFetch(`/api/bookings/cancel/${id}`, { method: "PUT" });
        alert("Booking cancelled successfully");
        fetchDashboard();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading)
    return (
      <div
        className={`p-10 text-center font-medium transition-colors duration-300 h-screen flex items-center justify-center ${theme === "dark" ? "bg-[#0f172a] text-slate-400" : "bg-white text-slate-500"}`}
      >
        Loading your dashboard...
      </div>
    );

  return (
    <div
      className={`p-4 md:p-8 min-h-screen font-sans transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#F4F7FE] text-slate-900"}`}
    >
      {/* HEADER - Responsive Flex */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <h1
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Dashboard
          </h1>
          <p
            className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} text-sm mt-1`}
          >
            Check your latest rentals and account activity
          </p>
        </div>
        <button
          onClick={() => navigate("/cars")}
          className="w-full sm:w-auto bg-[#4318FF] hover:bg-[#3311CC] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={20} /> New Booking
        </button>
      </div>

      {/* STATS CARDS - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div
          className={`p-5 rounded-3xl flex items-center gap-4 shadow-sm border transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-white"}`}
        >
          <div
            className={`${theme === "dark" ? "bg-indigo-900/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"} p-4 rounded-2xl`}
          >
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Total Bookings
            </p>
            <h2
              className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-slate-800"}`}
            >
              {data?.totalBookings || 0}
            </h2>
          </div>
        </div>
        <div
          className={`p-5 rounded-3xl flex items-center gap-4 shadow-sm border transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-white"}`}
        >
          <div
            className={`${theme === "dark" ? "bg-amber-900/20 text-amber-500" : "bg-amber-50 text-amber-500"} p-4 rounded-2xl`}
          >
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Active Trips
            </p>
            <h2
              className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-slate-800"}`}
            >
              {data?.activeRental ? 1 : 0}
            </h2>
          </div>
        </div>
        <div
          className={`p-5 rounded-3xl flex items-center gap-4 shadow-sm border transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-white"}`}
        >
          <div
            className={`${theme === "dark" ? "bg-emerald-900/20 text-emerald-400" : "bg-emerald-50 text-emerald-500"} p-4 rounded-2xl`}
          >
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Spent Total
            </p>
            <h2
              className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-slate-800"}`}
            >
              ₹{data?.totalSpent?.toLocaleString() || "0"}
            </h2>
          </div>
        </div>
      </div>

      {/* ACTIVE RENTAL - Responsive Layout */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4 px-2">
          <h3
            className={`text-xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-800"}`}
          >
            Current Rental
          </h3>
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
          <div
            className={`rounded-4xl md:rounded-4xl overflow-hidden shadow-sm flex flex-col lg:flex-row border p-2 transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-white"}`}
          >
            <div className="w-full lg:w-2/5 h-56 md:h-72 lg:h-auto relative overflow-hidden rounded-3xl md:rounded-3xl shrink-0">
              <img
                src={data.activeRental.car?.carImage}
                alt="Car"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Live
                </span>
                <span
                  className={`${theme === "dark" ? "bg-slate-800/90 text-white" : "bg-white/90 text-slate-800"} backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest`}
                >
                  {data.activeRental.car?.carNumber}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2
                    className={`text-xl md:text-2xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                  >
                    {data.activeRental.car?.carName}
                  </h2>
                  <p className="text-slate-400 flex items-center gap-1.5 text-sm font-medium mt-1 uppercase tracking-tighter">
                    <MapPin size={14} className="text-indigo-500" />{" "}
                    {data.activeRental.pickupLocation}
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                    Total Amount
                  </p>
                  <p className="text-2xl md:text-3xl font-black text-[#4318FF]">
                    ₹{data.activeRental.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-2xl border transition-colors ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              >
                <div className="flex gap-3 items-center">
                  <div
                    className={`${theme === "dark" ? "bg-slate-900" : "bg-white"} p-2.5 rounded-xl shadow-sm`}
                  >
                    <Calendar size={18} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Pickup
                    </p>
                    <p
                      className={`text-sm font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}
                    >
                      {new Date(
                        data.activeRental.pickupDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div
                    className={`${theme === "dark" ? "bg-slate-900" : "bg-white"} p-2.5 rounded-xl shadow-sm`}
                  >
                    <Clock size={18} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Drop-off
                    </p>
                    <p
                      className={`text-sm font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}
                    >
                      {new Date(
                        data.activeRental.dropDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t gap-4 ${theme === "dark" ? "border-slate-800" : "border-slate-50"}`}
              >
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">
                      Fuel
                    </p>
                    <p
                      className={`text-xs font-bold ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {data.activeRental.car?.carRunning}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">
                      Type
                    </p>
                    <p
                      className={`text-xs font-bold ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {data.activeRental.car?.carType}
                    </p>
                  </div>
                </div>
                <button className="w-full sm:w-auto bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                  Booking Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`p-10 md:p-16 rounded-4xl md:rounded-4xl text-center border-2 border-dashed transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <div className="bg-slate-50/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Info size={32} />
            </div>
            <p className="text-slate-400 font-bold">
              You don't have any active rentals right now.
            </p>
            <button
              onClick={() => navigate("/cars")}
              className="text-indigo-500 text-sm font-black mt-2 hover:underline"
            >
              Book your first ride &rarr;
            </button>
          </div>
        )}
      </div>

      {/* HISTORY TABLE - Responsive Scroll */}
      <div
        className={`rounded-4xl md:rounded-4xl shadow-sm border overflow-hidden p-4 transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-white"}`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-3">
          <h3
            className={`text-lg font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-800"}`}
          >
            Recent History
          </h3>
          <button
            onClick={() => navigate("/dashboard/booking")}
            className="text-indigo-500 text-xs font-black uppercase tracking-widest hover:bg-indigo-50/10 px-4 py-2 rounded-xl transition-all"
          >
            View All Activity
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-187.5">
            <thead>
              <tr
                className={`text-[10px] uppercase font-black text-slate-400 tracking-widest border-b ${theme === "dark" ? "border-slate-800" : "border-slate-50"}`}
              >
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-center">Payment</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Records</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${theme === "dark" ? "divide-slate-800" : "divide-slate-50"}`}
            >
              {data?.bookingHistory?.map((item) => (
                <tr
                  key={item._id}
                  className={`group transition-all ${theme === "dark" ? "hover:bg-slate-800/50" : "hover:bg-slate-50/50"}`}
                >
                  <td className="px-6 py-5 flex items-center gap-4">
                    <div
                      className={`w-14 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}
                    >
                      <img
                        src={item.car?.carImage}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all"
                        alt=""
                      />
                    </div>
                    <div>
                      <p
                        className={`font-black text-sm tracking-tight ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}
                      >
                        {item.car?.carName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">
                        {item.car?.brand}
                      </p>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-5 text-sm font-bold tracking-tight whitespace-nowrap ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {new Date(item.pickupDate).toLocaleDateString("en-GB")}
                  </td>
                  <td
                    className={`px-6 py-5 font-black text-sm text-center whitespace-nowrap ${theme === "dark" ? "text-white" : "text-slate-800"}`}
                  >
                    ₹{item.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg tracking-widest whitespace-nowrap ${
                        item.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-600"
                          : item.status === "cancelled"
                            ? "bg-rose-100 text-rose-500"
                            : theme === "dark"
                              ? "bg-slate-800 text-slate-400"
                              : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      className={`p-2 rounded-lg transition-all shadow-sm border ${theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-indigo-400" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-indigo-600"}`}
                    >
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
