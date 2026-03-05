import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  XCircle,
  Wallet,
  MapPin,
  IndianRupee,
  Download,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  User,
  Car,
  Calendar,
  X,
  Navigation,
} from "lucide-react";
// import
import { apiFetch } from "./../../../api/apiFetch";

function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 8;

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
  const fetchData = async () => {
    try {
      setLoading(true);
      const bookingData = await apiFetch("/api/bookings/all");
      setBookings(bookingData);
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*EXPORT PDF LOGIC   */
  const downloadReport = () => {
    const doc = new jsPDF();
    const monthName = new Date(0, filterMonth).toLocaleString("default", {
      month: "long",
    });

    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text(`Revenue Report: ${monthName} 2026`, 14, 20);

    doc.setFontSize(10);
    doc.text(
      `Gross Revenue: Rs. ${totalGrossAmount.toLocaleString("en-IN")}`,
      14,
      30,
    );
    doc.text(
      `Cancelled Amount: Rs. ${totalCancelledAmount.toLocaleString("en-IN")}`,
      14,
      35,
    );
    doc.text(`Net Revenue: Rs. ${netRevenue.toLocaleString("en-IN")}`, 14, 40);

    const tableRows = filteredBookings.map((b) => [
      new Date(b.pickupDate).toLocaleDateString(),
      b.customer?.name || "N/A",
      b.car?.carName || "N/A",
      `Rs. ${Number(b.totalAmount).toLocaleString("en-IN")}`,
      b.status.toUpperCase(),
    ]);

    autoTable(doc, {
      head: [["Date", "Customer", "Vehicle", "Amount", "Status"]],
      body: tableRows,
      startY: 50,
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 },
      styles: { fontSize: 9 },
    });

    doc.save(`Revenue_Report_${monthName}_2026.pdf`);
  };

  const handleUpdateStatus = async (e, id, actionType) => {
    e.stopPropagation();
    const confirmAction = window.confirm(`Confirm ${actionType}?`);
    if (!confirmAction) return;

    try {
      const endpoint =
        actionType === "confirm"
          ? `/api/bookings/confirm/${id}`
          : `/api/bookings/admin-cancel/${id}`;
      const res = await apiFetch(endpoint, { method: "PUT" });
      alert(res.message);
      fetchData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const d = new Date(b.pickupDate);
    return d.getMonth() === parseInt(filterMonth) && d.getFullYear() === 2026;
  });

  const totalGrossAmount = filteredBookings.reduce(
    (sum, b) => sum + (Number(b.totalAmount) || 0),
    0,
  );
  const totalCancelledAmount = filteredBookings
    .filter((b) => b.status === "cancelled")
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const netRevenue = totalGrossAmount - totalCancelledAmount;

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentData = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterMonth]);

  if (loading)
    return (
      <div
        className={`h-screen flex items-center justify-center transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a] text-slate-400" : "bg-[#fbfcfd] text-slate-400"} animate-pulse font-medium`}
      >
        Loading Dashboard...
      </div>
    );

  return (
    <div
      className={`p-4 md:p-8 min-h-screen font-sans transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#fbfcfd] text-slate-900"}`}
    >
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-800"}`}
          >
            Revenue Overview
          </h1>
          <p
            className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} text-sm`}
          >
            Track and manage your bookings for 2026
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className={`grow md:grow-0 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm outline-none border transition-colors ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/50"
                : "bg-white border-slate-200 text-slate-900 focus:ring-blue-500"
            }`}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* STAT CARDS - Updated Grid Breakpoints */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Gross Total"
          value={totalGrossAmount}
          icon={<TrendingUp size={18} />}
          color={theme === "dark" ? "text-slate-200" : "text-slate-600"}
          bg={theme === "dark" ? "bg-slate-800" : "bg-slate-100"}
          theme={theme}
        />
        <StatCard
          label="Cancelled"
          value={totalCancelledAmount}
          icon={<XCircle size={18} />}
          color="text-red-600"
          bg={theme === "dark" ? "bg-red-900/20" : "bg-red-50"}
          theme={theme}
        />
        <StatCard
          label="Net Revenue"
          value={netRevenue}
          icon={<Wallet size={18} />}
          color="text-blue-600"
          bg={theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"}
          isPrimary
          theme={theme}
        />
      </div>

      {/* TABLE - Added overflow-x-auto for mobile */}
      <div
        className={`max-w-6xl mx-auto rounded-2xl shadow-sm border overflow-hidden transition-colors ${
          theme === "dark"
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-100"
        }`}
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm min-w-175">
            <thead
              className={`${theme === "dark" ? "bg-slate-800/50 border-slate-800" : "bg-slate-50 border-slate-100"} border-b`}
            >
              <tr>
                <th
                  className={`p-4 font-semibold ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}
                >
                  Customer & Vehicle
                </th>
                <th
                  className={`p-4 font-semibold ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}
                >
                  Amount
                </th>
                <th
                  className={`p-4 font-semibold text-center ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}
                >
                  Status
                </th>
                <th
                  className={`p-4 font-semibold text-right ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${theme === "dark" ? "divide-slate-800" : "divide-slate-50"}`}
            >
              {currentData.map((b) => (
                <tr
                  key={b._id}
                  className={`transition-colors cursor-pointer ${theme === "dark" ? "hover:bg-slate-800/50" : "hover:bg-blue-50/30"}`}
                  onClick={() => setSelectedBooking(b)}
                >
                  <td className="p-4">
                    <div
                      className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                    >
                      {b.customer?.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {b.car?.carName}
                    </div>
                  </td>
                  <td
                    className={`p-4 font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}
                  >
                    ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div
                      className="flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {b.status === "pending" && (
                        <button
                          onClick={(e) =>
                            handleUpdateStatus(e, b._id, "confirm")
                          }
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-transform"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <button
                          onClick={(e) =>
                            handleUpdateStatus(e, b._id, "cancel")
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            theme === "dark"
                              ? "bg-slate-800 border border-slate-700 text-slate-300 hover:text-red-400"
                              : "bg-white border border-slate-200 text-slate-500 hover:text-red-600"
                          }`}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION - Adaptive Layout */}
      <div className="max-w-6xl mx-auto mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
        <span>
          Showing {currentData.length} of {filteredBookings.length}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`p-2 rounded-lg border disabled:opacity-30 transition-colors ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-slate-200 text-slate-500"
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`p-2 rounded-lg border disabled:opacity-30 transition-colors ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-slate-200 text-slate-500"
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* DETAIL MODAL - Mobile Optimized */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-60 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-xl rounded-3xl shadow-xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-150 transition-colors ${
              theme === "dark"
                ? "bg-slate-900 border border-slate-800 text-white"
                : "bg-white text-slate-900"
            }`}
          >
            <div
              className={`p-6 border-b flex justify-between items-center sticky top-0 z-10 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}
            >
              <h3 className="font-bold">Booking Summary</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className={`p-1.5 rounded-full transition ${theme === "dark" ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-200 text-slate-600"}`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoBox
                  theme={theme}
                  icon={<User size={14} />}
                  label="Customer"
                  value={selectedBooking.customer?.name}
                  sub={selectedBooking.customer?.phone}
                />
                <InfoBox
                  theme={theme}
                  icon={<Car size={14} />}
                  label="Vehicle"
                  value={selectedBooking.car?.carName}
                  sub={selectedBooking.bookingType}
                />
              </div>

              <div
                className={`p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 transition-colors ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"}`}
              >
                <InfoBox
                  theme={theme}
                  icon={<Calendar size={14} />}
                  label="Pickup Date"
                  value={new Date(
                    selectedBooking.pickupDate,
                  ).toLocaleDateString()}
                  sub={selectedBooking.pickupTime}
                />
                <InfoBox
                  theme={theme}
                  icon={<Calendar size={14} />}
                  label="Drop Date"
                  value={
                    selectedBooking.dropDate
                      ? new Date(selectedBooking.dropDate).toLocaleDateString()
                      : "N/A"
                  }
                  sub={selectedBooking.dropTime}
                />
                <InfoBox
                  theme={theme}
                  icon={<MapPin size={14} />}
                  label="Pickup Location"
                  value={selectedBooking.pickupLocation}
                />
                <InfoBox
                  theme={theme}
                  icon={<Navigation size={14} />}
                  label="Drop Location"
                  value={selectedBooking.dropLocation}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Total Paid
                  </span>
                  <div className="text-2xl font-black text-blue-600">
                    ₹{selectedBooking.totalAmount}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${selectedBooking.status === "confirmed" ? "bg-green-100 text-green-700" : theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, bg, isPrimary, theme }) {
  return (
    <div
      className={`p-6 rounded-2xl border transition-all ${
        theme === "dark"
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-100"
      } ${isPrimary ? (theme === "dark" ? "ring-2 ring-blue-500/20" : "ring-2 ring-blue-500/10") : ""}`}
    >
      <div
        className={`w-9 h-9 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
        {label}
      </p>
      <h2
        className={`text-2xl font-bold mt-1 ${theme === "dark" && color === "text-slate-600" ? "text-slate-200" : color}`}
      >
        ₹{value.toLocaleString("en-IN")}
      </h2>
    </div>
  );
}

function InfoBox({ icon, label, value, sub, theme }) {
  return (
    <div className="flex gap-3">
      <div className="text-slate-400 mt-1 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          {label}
        </p>
        <p
          className={`text-sm font-semibold leading-tight wrap-break-word ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}
        >
          {value}
        </p>
        {sub && <p className="text-xs font-medium text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

export default BookingRequests;
