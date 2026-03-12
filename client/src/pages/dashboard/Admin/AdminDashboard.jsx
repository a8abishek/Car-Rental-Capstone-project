import { useEffect, useState } from "react";
import {
  Users,
  Car,
  Calendar,
  DollarSign,
  UserCheck,
  Clock,
  RotateCcw,
  X,
  CheckCircle,
  Fuel,
  Gauge,
  CreditCard,
} from "lucide-react";
import { apiFetch } from "../../../api/apiFetch";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");

  // Added theme state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Logic to monitor theme changes instantly
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

  //FETCH DATA
  const fetchStats = async () => {
    try {
      const data = await apiFetch("/api/admin/stats");
      setStats(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const data = await apiFetch("/api/driver/active");
      setDrivers(data);
    } catch (err) {
      console.error("Driver fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchDrivers();
  }, []);

  //HANDLERS
  const handleApproveDealer = async (id) => {
    try {
      await apiFetch(`/api/admin/approve/${id}`, { method: "PUT" });
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await apiFetch(`/api/bookings/admin-cancel/${selectedBooking._id}`, {
        method: "PUT",
      });
      alert("Booking cancelled successfully");
      setSelectedBooking(null);
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      if (!selectedBooking) return;
      if (selectedBooking.bookingType === "self") {
        await apiFetch(`/api/bookings/confirm/${selectedBooking._id}`, {
          method: "PUT",
        });
      } else {
        if (!selectedDriverId) return alert("Please select a driver!");
        await apiFetch(`/api/bookings/assign/${selectedBooking._id}`, {
          method: "PUT",
          body: JSON.stringify({ driverId: selectedDriverId }),
        });
      }
      alert("Booking confirmed successfully");
      setSelectedBooking(null);
      setSelectedDriverId("");
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div
        className={`h-screen flex items-center justify-center transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a]" : "bg-gray-50"}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p
            className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"} font-medium animate-pulse text-sm uppercase tracking-widest`}
          >
            Initializing Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 md:p-8 font-sans ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#F8FAFC] text-slate-900"}`}
    >
      {/*HEADER  */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1
            className={`text-3xl font-extrabold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Master Admin
          </h1>
          <p
            className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} text-sm mt-1`}
          >
            Manage your fleet, dealers, and customer bookings.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className={`flex items-center justify-center gap-2 border px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm font-semibold ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <RotateCcw size={18} /> Refresh Data
        </button>
      </header>

      <main className="max-w-7xl mx-auto space-y-10">
        {/*STAT CARDS*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            theme={theme}
            icon={<Users size={22} />}
            title="Total Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatCard
            theme={theme}
            icon={<Car size={22} />}
            title="Active Fleet"
            value={stats.totalCars}
            color="purple"
          />
          <StatCard
            theme={theme}
            icon={<Calendar size={22} />}
            title="Bookings"
            value={stats.totalBookings}
            color="orange"
          />
          <StatCard
            theme={theme}
            icon={<DollarSign size={22} />}
            title="Revenue"
            value={`₹${stats.totalRevenue?.toLocaleString()}`}
            color="green"
          />
        </div>

        {/*CONTENT GRID*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RECENT BOOKINGS */}
          <section
            className={`lg:col-span-1 rounded-3xl border shadow-sm overflow-hidden transition-colors ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100"
            }`}
          >
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-slate-800" : "border-slate-50"}`}
            >
              <h3 className="font-bold flex items-center gap-2">
                <Clock size={18} className="text-slate-400" /> Recent Bookings
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {stats.recentBookings?.slice(0, 3).map((b) => (
                <div
                  key={b._id}
                  onClick={() => setSelectedBooking(b)}
                  className={`group p-4 rounded-2xl border border-transparent transition-all cursor-pointer ${
                    theme === "dark"
                      ? "hover:border-blue-900/50 hover:bg-blue-900/10"
                      : "hover:border-blue-100 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-sm font-bold group-hover:text-blue-500 transition-colors ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                    >
                      {b.car?.carName}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    <span>{b.customer?.name}</span>
                    <span>{b.bookingType} drive</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DEALER REQUESTS  */}
          <section
            className={`rounded-3xl border shadow-sm overflow-hidden transition-colors ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100"
            }`}
          >
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-slate-800" : "border-slate-50"}`}
            >
              <h3 className="font-bold flex items-center gap-2">
                <UserCheck size={18} className="text-slate-400" /> Dealer
                Approval
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {stats.recentDealers?.slice(0, 3).map((d) => (
                <div
                  key={d._id}
                  className={`flex justify-between items-center p-4 rounded-2xl ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"}`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`font-bold text-sm truncate ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                    >
                      {d.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{d.email}</p>
                  </div>
                  <button
                    onClick={() => handleApproveDealer(d._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/20"
                  >
                    Approve
                  </button>
                </div>
              ))}
              {stats.recentDealers?.length === 0 && (
                <p className="text-center py-6 text-xs text-slate-400 font-medium">
                  No pending requests
                </p>
              )}
            </div>
          </section>

          {/* NEW CUSTOMERS*/}
          <section
            className={`rounded-3xl border shadow-sm overflow-hidden transition-colors ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100"
            }`}
          >
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-slate-800" : "border-slate-50"}`}
            >
              <h3 className="font-bold flex items-center gap-2">
                <Users size={18} className="text-slate-400" /> New Customers
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {stats.recentCustomers?.slice(0, 3).map((c) => (
                <div
                  key={c._id}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${theme === "dark" ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs uppercase border ${
                      theme === "dark"
                        ? "bg-slate-800 text-slate-400 border-slate-700"
                        : "bg-slate-100 text-slate-600 border-white"
                    }`}
                  >
                    {c.name?.substring(0, 2)}
                  </div>
                  <div>
                    <p
                      className={`font-bold text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                    >
                      {c.name}
                    </p>
                    <p className="text-xs text-slate-400">{c.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* MODAL  */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-2xl rounded-4xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 ${theme === "dark" ? "bg-slate-900 border border-slate-800" : "bg-white"}`}
          >
            <div className="relative h-56 bg-slate-900">
              <img
                src={selectedBooking.car?.carImage}
                alt="Car"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
              <button
                onClick={() => setSelectedBooking(null)}
                className={`absolute top-6 right-6 p-2 rounded-full backdrop-blur-md transition ${theme === "dark" ? "bg-white/10 hover:bg-white/20 text-white" : "bg-white/20 hover:bg-white/30 text-white"}`}
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-6 left-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded">
                    {selectedBooking.car?.carType}
                  </span>
                  <span className="text-white/60 text-xs font-medium">
                    #{selectedBooking._id.slice(-6)}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white leading-none">
                  {selectedBooking.car?.carName}
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <SectionTitle title="Journey Route" />
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center py-1">
                      <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white" />
                      <div
                        className={`w-0.5 grow my-1 ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}
                      />
                      <div
                        className={`w-3 h-3 rounded-full ${theme === "dark" ? "bg-white" : "bg-slate-900"}`}
                      />
                    </div>
                    <div className="flex flex-col justify-between space-y-4 text-sm">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Pickup
                        </p>
                        <p
                          className={`font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                        >
                          {selectedBooking.pickupLocation}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(
                            selectedBooking.pickupDate,
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Drop-off
                        </p>
                        <p
                          className={`font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                        >
                          {selectedBooking.dropLocation}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(selectedBooking.dropDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <SectionTitle title="Booking Specs" />
                  <div className="space-y-4">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-2xl ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}
                    >
                      <div
                        className={`${theme === "dark" ? "bg-slate-900" : "bg-white"} h-10 w-10 rounded-xl shadow-sm flex items-center justify-center text-blue-600`}
                      >
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Customer
                        </p>
                        <p
                          className={`text-sm font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                        >
                          {selectedBooking.customer?.name}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`p-3 rounded-2xl text-center ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}
                      >
                        <Fuel
                          size={16}
                          className="mx-auto mb-1 text-slate-400"
                        />
                        <p
                          className={`text-[10px] font-bold uppercase ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}
                        >
                          {selectedBooking.car?.carRunning}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-2xl text-center ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}
                      >
                        <Gauge
                          size={16}
                          className="mx-auto mb-1 text-slate-400"
                        />
                        <p
                          className={`text-[10px] font-bold uppercase ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}
                        >
                          {selectedBooking.car?.transmission}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-4xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl shadow-blue-900/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">
                      Total Transaction
                    </p>
                    <p className="text-3xl font-black">
                      ₹{selectedBooking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {selectedBooking.paymentStatus}
                  </span>
                  <p className="text-blue-100 text-xs mt-2 italic font-medium">
                    Advance: ₹{selectedBooking.advancePaid}
                  </p>
                </div>
              </div>

              {selectedBooking.bookingType === "driver" &&
                selectedBooking.status === "pending" && (
                  <div className="space-y-3">
                    <SectionTitle title="Assign Professional Driver" />
                    <select
                      value={selectedDriverId}
                      onChange={(e) => setSelectedDriverId(e.target.value)}
                      className={`w-full p-4 rounded-2xl text-sm font-semibold outline-none transition appearance-none ${
                        theme === "dark"
                          ? "bg-slate-800 text-white border-none"
                          : "bg-slate-50 text-slate-800 border-none"
                      }`}
                    >
                      <option value="">Choose Available Driver...</option>
                      {drivers.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name} — {d.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              {selectedBooking.status === "pending" ? (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCancelBooking}
                    className={`flex-1 px-6 py-4 rounded-2xl font-bold transition-all ${theme === "dark" ? "text-slate-400 hover:text-red-400 hover:bg-red-900/20" : "text-slate-400 hover:text-red-500 hover:bg-red-50"}`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-2 bg-slate-900 dark:bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl transition-all hover:opacity-90"
                  >
                    Confirm Booking
                  </button>
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center gap-2 py-4 font-bold rounded-2xl ${theme === "dark" ? "text-green-400 bg-green-900/20" : "text-green-600 bg-green-50"}`}
                >
                  <CheckCircle size={20} /> This booking is{" "}
                  {selectedBooking.status}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ icon, title, value, color, theme }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    green: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  };
  return (
    <div
      className={`p-6 rounded-3xl shadow-sm border transition-all ${
        theme === "dark"
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-100"
      }`}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-4 ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
        {title}
      </p>
      <h2
        className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-slate-800"}`}
      >
        {value}
      </h2>
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
    {title}
  </h4>
);

const StatusBadge = ({ status }) => {
  const isConfirmed = status === "confirmed";
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-tight ${
        isConfirmed
          ? "bg-emerald-100 text-emerald-700"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {status}
    </span>
  );
};

export default AdminDashboard;
