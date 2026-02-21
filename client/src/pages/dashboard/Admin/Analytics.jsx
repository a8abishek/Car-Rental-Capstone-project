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
  Car,
  DollarSign,
  ArrowUpRight,
  Calendar,
  Layers,
  Filter,
  Download,
  RotateCcw,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import
import { apiFetch } from "../../../api/apiFetch";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/admin/stats");
      setData(res);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // PDF GENERATION LOGIC
  const downloadPDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("CarRental Analytics Report", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${today}`, 14, 30);
    doc.text("Master Admin Dashboard | Business Performance", 14, 35);

    // Summary Box
    doc.setDrawColor(240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 45, 180, 40, 3, 3, "FD");

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont(undefined, "bold");
    doc.text("Executive Summary", 20, 55);

    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text(
      `Total Net Worth: Rs. ${data?.totalRevenue?.toLocaleString()}`,
      20,
      65,
    );
    doc.text(`Total Approved Fleet: ${data?.totalCars} Vehicles`, 20, 72);
    doc.text(
      `Current Utilization: ${Math.round((data?.utilization?.onTrip / data?.totalCars) * 100)}% on road`,
      20,
      79,
    );

    // Table 1: Bookings
    const carBookingRows =
      data?.recentBookings?.map((b) => [
        b.car?.carName || "N/A",
        b.customer?.name || "Guest",
        b.status.toUpperCase(),
        `Rs. ${b.totalAmount?.toLocaleString()}`,
      ]) || [];

    autoTable(doc, {
      startY: 100,
      head: [["Car Model", "Customer", "Status", "Value"]],
      body: carBookingRows,
      theme: "grid",
      headStyles: { fillColor: [30, 41, 59] },
    });

    doc.save(`Rentify_Analytics_${today.replace(/\//g, "-")}.pdf`);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">
            Analysing Records...
          </p>
        </div>
      </div>
    );

  const chartData =
    data?.weeklyRevenue?.map((item) => ({
      name: new Date(item._id).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      revenue: item.total,
    })) || [];

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Data Insights
          </h1>
          <p className="text-slate-500 font-medium">
            Real-time financial and fleet breakdown.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAnalytics}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm transition-all"
          >
            <RotateCcw size={18} className="text-slate-600" />
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg hover:scale-105 transition-all"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* REVENUE CHART*/}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-w-0 overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-bold">Revenue Flow</h3>
              <p className="text-xs text-slate-400 font-semibold">
                Weekly earnings trend
              </p>
            </div>
            <div className="bg-blue-50 text-blue-700 p-3 rounded-2xl">
              <TrendingUp size={20} />
            </div>
          </div>

          {/* PARENT DIV WITH FIXED HEIGHT */}
          <div className="h-100 w-full min-h-100">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: "#94A3B8" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    barSize={45}
                    fill="#E2E8F0"
                    radius={[10, 10, 10, 10]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    strokeWidth={4}
                    fill="url(#areaGradient)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Waiting for data...
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8 min-w-0">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
            <h4 className="font-bold text-sm mb-6 self-start uppercase tracking-widest text-slate-400">
              Live Fleet
            </h4>
            <div className="relative h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Active", value: data?.utilization?.onTrip || 0 },
                      { name: "Idle", value: data?.utilization?.idle || 0 },
                    ]}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    <Cell fill="#2563EB" cornerRadius={10} />
                    <Cell fill="#F1F5F9" cornerRadius={10} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">
                  {data?.utilization?.onTrip}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  On Road
                </span>
              </div>
            </div>
            <div className="w-full mt-8">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                <span>Utilization</span>
                <span>
                  {data?.totalCars > 0
                    ? Math.round(
                        (data.utilization.onTrip / data.totalCars) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                  style={{
                    width: `${(data?.utilization?.onTrip / data?.totalCars) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 flex flex-col justify-between min-h-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest opacity-70">
                Total Earnings
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-black">
                ₹{data?.totalRevenue?.toLocaleString()}
              </h2>
              <div className="flex items-center gap-1 text-emerald-300 mt-2 text-xs font-bold font-mono">
                <ArrowUpRight size={14} /> +12.5% vs last week
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <MetricCard
          icon={<Calendar />}
          label="Booking Frequency"
          value={data?.totalBookings}
          sub="Total Lifetime"
        />
        <MetricCard
          icon={<Layers />}
          label="Fleet Size"
          value={data?.totalCars}
          sub="Approved Vehicles"
        />
        <MetricCard
          icon={<Car />}
          label="Current Demand"
          value={data?.utilization?.onTrip}
          sub="Active Sessions"
        />
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 min-w-0">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-black text-slate-800">{value}</h4>
          <span className="text-xs font-bold text-slate-400 truncate">
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
