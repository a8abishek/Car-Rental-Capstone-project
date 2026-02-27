import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Calendar,
  Layers,
  RotateCcw,
  Download,
  Percent,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { apiFetch } from "../../../api/apiFetch";

function DealerAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/cars/dealer/stats");
      setData(res);
    } catch (err) {
      console.error("Dealer Analytics Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const downloadReport = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("Dealer Revenue Report", 14, 22);

    autoTable(doc, {
      startY: 45,
      head: [["Metric", "Value"]],
      body: [
        ["Total Fleet Size", `${data?.totalCars} Vehicles`],
        ["Active Cars", `${data?.activeCars}`],
        ["Gross Revenue", `Rs. ${data?.revenue?.gross?.toLocaleString()}`],
        ["Net Earnings (70%)", `Rs. ${data?.revenue?.net?.toLocaleString()}`],
      ],
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save(`Dealer_Report_${today}.pdf`);
  };

  if (loading)
    return (
      <div
        className={`h-screen flex items-center justify-center ${theme === "dark" ? "bg-[#0f172a]" : "bg-[#F8FAFC]"}`}
      >
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const chartData =
    data?.weeklyRevenue?.map((item) => ({
      name: new Date(item._id).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      revenue: item.total * 0.7,
    })) || [];

  return (
    <div
      className={`p-6 md:p-10 min-h-screen font-sans transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#F8FAFC] text-slate-900"}`}
    >
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1
            className={`text-3xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Dealer Dashboard
          </h1>
          <p
            className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} font-medium`}
          >
            Tracking your fleet performance and net take-home.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchStats}
            className={`p-3 border rounded-2xl shadow-sm transition-all ${theme === "dark" ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-slate-200 hover:bg-slate-50"}`}
          >
            <RotateCcw
              size={18}
              className={theme === "dark" ? "text-slate-300" : "text-slate-600"}
            />
          </button>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all"
          >
            <Download size={16} /> Export Earnings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 2. CHART SECTION */}
        <div
          className={`lg:col-span-3 p-8 rounded-[2.5rem] border shadow-sm ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3
                className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              >
                Net Earnings (70%)
              </h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Weekly Revenue Share
              </p>
            </div>
            <div
              className={`p-3 rounded-2xl ${theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"}`}
            >
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={theme === "dark" ? "#1e293b" : "#F1F5F9"}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    padding: "15px",
                  }}
                  itemStyle={{
                    color: "#2563eb",
                    fontWeight: "800",
                    fontSize: "14px",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill={theme === "dark" ? "#1e293b" : "#eff6ff"}
                  radius={[10, 10, 10, 10]}
                  barSize={40}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={4}
                  fill="url(#blueGradient)"
                  dot={{
                    r: 4,
                    fill: "#2563eb",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. SIDEBAR CARDS */}
        <div className="space-y-8">
          <div
            className={`p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between min-h-50 border ${theme === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-[#1e293b] border-slate-700"} text-white`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 text-blue-400 rounded-lg">
                <DollarSign size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100/70">
                Net Take-Home
              </span>
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-1">
                ₹{data?.revenue?.net?.toLocaleString()}
              </h2>
              <div className="flex items-center gap-1 text-blue-400 text-[10px] font-bold uppercase tracking-tighter">
                <ArrowUpRight size={12} /> Total Dealer Profit
              </div>
            </div>
          </div>

          <div
            className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col items-center ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
          >
            <h4 className="font-bold text-[10px] mb-6 self-start uppercase tracking-[0.2em] text-slate-400">
              Fleet Status
            </h4>
            <div className="relative h-44 w-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { value: data?.activeCars },
                      { value: data?.totalCars - data?.activeCars },
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#2563eb" cornerRadius={10} />
                    <Cell
                      fill={theme === "dark" ? "#1e293b" : "#F1F5F9"}
                      cornerRadius={10}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-4xl font-black leading-none ${theme === "dark" ? "text-white" : "text-slate-800"}`}
                >
                  {data?.activeCars}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <MetricCard
          theme={theme}
          icon={<Layers size={22} />}
          label="Total Inventory"
          value={data?.totalCars}
          sub="Cars"
        />
        <MetricCard
          theme={theme}
          icon={<Calendar size={22} />}
          label="Bookings"
          value={data?.bookingCount}
          sub="Total"
        />
        <MetricCard
          theme={theme}
          icon={<Percent size={22} />}
          label="Gross Revenue"
          value={`₹${data?.revenue?.gross?.toLocaleString()}`}
          sub="Total Bill"
        />
      </div>

      {/* 5. RECENT ACTIVITY TABLE */}
      <div
        className={`mt-8 p-8 rounded-[3rem] border shadow-sm ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
      >
        <h3
          className={`text-lg font-bold mb-6 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
        >
          Recent Activity
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                className={`text-slate-400 text-[10px] uppercase tracking-[0.2em] border-b ${theme === "dark" ? "border-slate-800" : "border-slate-50"}`}
              >
                <th className="pb-4 font-black">Car Model</th>
                <th className="pb-4 font-black">Customer</th>
                <th className="pb-4 font-black text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              {data?.recentBookings?.map((booking, i) => (
                <tr
                  key={i}
                  className={`border-b last:border-0 group transition-colors ${theme === "dark" ? "border-slate-800 hover:bg-blue-900/10" : "border-slate-50 hover:bg-blue-50/30"}`}
                >
                  <td
                    className={`py-5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                  >
                    {booking.car?.carName}
                  </td>
                  <td className="py-5 text-slate-500">
                    {booking.customer?.name}
                  </td>
                  <td className="py-5 text-right font-black text-blue-600">
                    ₹{(booking.totalAmount * 0.7).toLocaleString()}
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

function MetricCard({ icon, label, value, sub, theme }) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] border flex items-center gap-6 shadow-sm group transition-all ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 transition-colors shrink-0 ${theme === "dark" ? "bg-slate-800 group-hover:bg-blue-900/30" : "bg-slate-50 group-hover:bg-blue-50"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h4
            className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-slate-800"}`}
          >
            {value}
          </h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DealerAnalytics;
