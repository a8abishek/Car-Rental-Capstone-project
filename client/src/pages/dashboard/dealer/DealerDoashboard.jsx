import { useEffect, useState } from "react";
import {
  Car,
  Calendar,
  DollarSign,
  Clock,
  RotateCcw,
  CheckCircle,
  CarFront,
  TrendingUp,
} from "lucide-react";
import { apiFetch } from "../../../api/apiFetch";

const DealerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/cars/dealer/stats");
      setData(response);
    } catch (err) {
      alert("Error fetching dealer stats: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Dealer Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      {/* HEADER  */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Dealer Console
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor your fleet performance and earnings.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 transition-all active:scale-95"
        >
          <RotateCcw size={18} /> Refresh
        </button>
      </header>

      <main className="max-w-7xl mx-auto space-y-10">
        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Car size={22} />}
            title="Total Cars"
            value={data.totalCars}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle size={22} />}
            title="Active Fleet"
            value={data.activeCars}
            color="green"
          />
          <StatCard
            icon={<Calendar size={22} />}
            title="Total Bookings"
            value={data.bookingCount}
            color="orange"
          />
          <StatCard
            icon={<DollarSign size={22} />}
            title="Your Earnings (70%)"
            value={`₹${data.revenue?.net?.toLocaleString()}`}
            color="emerald"
          />
        </div>

        {/* DASHBOARD CONTEN*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RECENT BOOKINGS */}
          <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold flex items-center gap-2">
                <Clock size={18} className="text-slate-400" /> Recent Bookings
                for Your Cars
              </h3>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-black">
                    <th className="px-6 py-4">Car</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Your Share (70%)</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentBookings?.map((b) => (
                    <tr
                      key={b._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.car?.carImage}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="font-bold text-sm">
                            {b.car?.carName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {b.customer?.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        ₹{b.totalAmount}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                        ₹{b.totalAmount * 0.7}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.recentBookings?.length === 0 && (
                <p className="text-center py-10 text-slate-400">
                  No bookings found
                </p>
              )}
            </div>
          </section>

          {/* FLEET STATUS SIDEBAR */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold flex items-center gap-2">
                <CarFront size={18} className="text-slate-400" /> Fleet Status
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Approved Cars</span>
                <span className="font-bold text-green-600">
                  {data.activeCars}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-1000"
                  style={{
                    width: `${(data.activeCars / data.totalCars) * 100}%`,
                  }}
                />
              </div>

              <div className="pt-4 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Revenue Breakdown
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Total Sales:</span>
                    <span className="font-bold">
                      ₹{data.revenue?.gross?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-red-500">
                    <span>Platform Fee (30%):</span>
                    <span>- ₹{data.revenue?.commission?.toLocaleString()}</span>
                  </div>
                  <hr className="border-slate-200 my-2" />
                  <div className="flex justify-between text-sm font-black text-emerald-600">
                    <span>Net Income:</span>
                    <span>₹{data.revenue?.net?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

/*HELPER COMPONENTS  */

const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    orange: "text-orange-600 bg-orange-50",
    emerald: "text-emerald-600 bg-emerald-50",
  };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-4 ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
        {title}
      </p>
      <h2 className="text-2xl font-black text-slate-800">{value}</h2>
    </div>
  );
};

export default DealerDashboard;
