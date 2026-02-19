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
} from "lucide-react";
import { apiFetch } from "../../../api/apiFetch";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");

  /* ================= FETCH DATA ================= */

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

  /* ================= DEALER APPROVE ================= */

  const handleApproveDealer = async (id) => {
    try {
      await apiFetch(`/api/admin/approve/${id}`, {
        method: "PUT",
      });
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= CONFIRM BOOKING ================= */

  const handleConfirmBooking = async () => {
    try {
      if (!selectedBooking) return;

      if (selectedBooking.bookingType === "self") {
        // Self drive confirm
        await apiFetch(`/api/booking/confirm/${selectedBooking._id}`, {
          method: "PUT",
        });
      } else {
        // With driver confirm
        if (!selectedDriverId)
          return alert("Please select a driver!");

        await apiFetch(`/api/booking/assign/${selectedBooking._id}`, {
          method: "PUT",
          body: JSON.stringify({ driverId: selectedDriverId }),
        });
      }

      alert("Booking confirmed successfully");
      setSelectedBooking(null);
      setSelectedDriverId("");
      fetchStats();
      fetchDrivers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-blue-600 font-bold animate-pulse">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Master Admin Overview</h1>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border text-sm"
        >
          <RotateCcw size={16} /> Refresh
        </button>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users />} title="Total Users" value={stats.totalUsers} />
        <StatCard icon={<Car />} title="Total Cars" value={stats.totalCars} />
        <StatCard icon={<Calendar />} title="Total Bookings" value={stats.totalBookings} />
        <StatCard
          icon={<DollarSign />}
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
        />
      </div>

      {/* ================= 3 COLUMN SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* RECENT BOOKINGS */}
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Clock size={18} /> Recent Bookings
          </h3>

          {stats.recentBookings?.map((b) => (
            <div
              key={b._id}
              onClick={() => setSelectedBooking(b)}
              className="p-3 border rounded-xl mb-3 cursor-pointer hover:bg-blue-50"
            >
              <div className="flex justify-between text-sm font-bold">
                <span>{b.car?.carName}</span>
                <span className={b.status === "confirmed" ? "text-green-600" : "text-orange-500"}>
                  {b.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {b.bookingType} drive - {b.customer?.name}
              </p>
            </div>
          ))}
        </div>

        {/* DEALER REQUESTS */}
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <UserCheck size={18} /> Dealer Requests
          </h3>

          {stats.recentDealers?.map((d) => (
            <div
              key={d._id}
              className="flex justify-between items-center p-3 border rounded-xl mb-3"
            >
              <div>
                <p className="font-bold text-sm">{d.name}</p>
                <p className="text-xs text-gray-400">{d.email}</p>
              </div>

              <button
                onClick={() => handleApproveDealer(d._id)}
                className="bg-green-600 text-white px-3 py-1 text-xs rounded-lg"
              >
                Approve
              </button>
            </div>
          ))}
        </div>

        {/* NEW CUSTOMERS */}
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Users size={18} /> New Customers
          </h3>

          {stats.recentCustomers?.map((c) => (
            <div key={c._id} className="p-3 border rounded-xl mb-3">
              <p className="font-bold text-sm">{c.name}</p>
              <p className="text-xs text-gray-500">{c.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOOKING MODAL ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white w-[500px] rounded-2xl p-6 space-y-6">
            <div className="flex justify-between">
              <h2 className="font-bold text-lg">Booking Details</h2>
              <X className="cursor-pointer" onClick={() => setSelectedBooking(null)} />
            </div>

            <div className="space-y-2 text-sm">
              <p><strong>Car:</strong> {selectedBooking.car?.carName}</p>
              <p><strong>Customer:</strong> {selectedBooking.customer?.name}</p>
              <p><strong>Total:</strong> ₹{selectedBooking.totalAmount}</p>
            </div>

            {/* DRIVER SELECT */}
            {selectedBooking.bookingType === "driver" &&
              selectedBooking.status === "pending" && (
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.phone})
                    </option>
                  ))}
                </select>
              )}

            {selectedBooking.status === "pending" && (
              <button
                onClick={handleConfirmBooking}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STAT CARD COMPONENT ================= */

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="text-blue-600 mb-2">{icon}</div>
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default AdminDashboard;
