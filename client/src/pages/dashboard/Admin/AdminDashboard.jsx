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
  MapPin,
  ChevronRight,
  Fuel,
  Gauge,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { apiFetch } from "../../../api/apiFetch";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");

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
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse text-sm uppercase tracking-widest">
            Initializing Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      {/*HEADER  */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Master Admin
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your fleet, dealers, and customer bookings.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 transition-all active:scale-95"
        >
          <RotateCcw size={18} /> Refresh Data
        </button>
      </header>

      <main className="max-w-7xl mx-auto space-y-10">
        {/*STAT CARDS*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users size={22} />}
            title="Total Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatCard
            icon={<Car size={22} />}
            title="Active Fleet"
            value={stats.totalCars}
            color="purple"
          />
          <StatCard
            icon={<Calendar size={22} />}
            title="Bookings"
            value={stats.totalBookings}
            color="orange"
          />
          <StatCard
            icon={<DollarSign size={22} />}
            title="Revenue"
            value={`₹${stats.totalRevenue?.toLocaleString()}`}
            color="green"
          />
        </div>

        {/*CONTENT GRID (WITH SLICES)*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RECENT BOOKINGS */}
          <section className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Clock size={18} className="text-slate-400" /> Recent Bookings
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {stats.recentBookings?.slice(0, 3).map((b) => (
                <div
                  key={b._id}
                  onClick={() => setSelectedBooking(b)}
                  className="group p-4 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-blue-50/50 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold group-hover:text-blue-700 transition-colors">
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
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <UserCheck size={18} className="text-slate-400" /> Dealer
                Approval
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {stats.recentDealers?.slice(0, 3).map((d) => (
                <div
                  key={d._id}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">{d.name}</p>
                    <p className="text-xs text-slate-400 truncate">{d.email}</p>
                  </div>
                  <button
                    onClick={() => handleApproveDealer(d._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-100"
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
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold flex items-center gap-2">
                <Users size={18} className="text-slate-400" /> New Customers
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {stats.recentCustomers?.slice(0, 3).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-linear-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase border border-white">
                    {c.name?.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{c.name}</p>
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
          <div className="bg-white w-full max-w-2xl rounded-4xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="relative h-56 bg-slate-900">
              <img
                src={selectedBooking.car?.carImage}
                alt="Car"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition"
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

            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* TRIP JOURNEY */}
                <div className="space-y-6">
                  <SectionTitle title="Journey Route" />
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center py-1">
                      <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white" />
                      <div className="w-0.5 grow bg-slate-100 my-1" />
                      <div className="w-3 h-3 rounded-full bg-slate-900" />
                    </div>
                    <div className="flex flex-col justify-between space-y-4 text-sm">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Pickup
                        </p>
                        <p className="font-bold text-slate-800">
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
                        <p className="font-bold text-slate-800">
                          {selectedBooking.dropLocation}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(selectedBooking.dropDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-6">
                  <SectionTitle title="Booking Specs" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                      <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Customer
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {selectedBooking.customer?.name}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl text-center">
                        <Fuel
                          size={16}
                          className="mx-auto mb-1 text-slate-400"
                        />
                        <p className="text-[10px] font-bold text-slate-800 uppercase">
                          {selectedBooking.car?.carRunning}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl text-center">
                        <Gauge
                          size={16}
                          className="mx-auto mb-1 text-slate-400"
                        />
                        <p className="text-[10px] font-bold text-slate-800 uppercase">
                          {selectedBooking.car?.transmission}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT INFO */}
              <div className="bg-blue-600 rounded-4xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl shadow-blue-100">
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

              {/* DRIVER SELECT */}
              {selectedBooking.bookingType === "driver" &&
                selectedBooking.status === "pending" && (
                  <div className="space-y-3">
                    <SectionTitle title="Assign Professional Driver" />
                    <select
                      value={selectedDriverId}
                      onChange={(e) => setSelectedDriverId(e.target.value)}
                      className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
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

              {/* FOOTER ACTIONS */}
              {selectedBooking.status === "pending" ? (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCancelBooking}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-black transition-all"
                  >
                    Confirm Booking
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-4 text-green-600 font-bold bg-green-50 rounded-2xl">
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

/*HELPER COMPONENTS  */

const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
    green: "text-emerald-600 bg-emerald-50",
  };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-4 ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
        {title}
      </p>
      <h2 className="text-2xl font-black text-slate-800">{value}</h2>
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
