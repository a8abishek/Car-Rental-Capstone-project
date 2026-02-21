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

  /*EXPORT PDF LOGIC  */
  const downloadReport = () => {
    const doc = new jsPDF();
    const monthName = new Date(0, filterMonth).toLocaleString("default", {
      month: "long",
    });

    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text(`Revenue Report: ${monthName} 2026`, 14, 20);

    // Summary Stats
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
      <div className="h-screen flex items-center justify-center text-slate-400 animate-pulse font-medium">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-[#fbfcfd] min-h-screen font-sans text-slate-900">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Revenue Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Track and manage your bookings for 2026
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          {/* PDF DOWNLOAD BUTTON */}
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition shadow-lg shadow-slate-200"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Gross Total"
          value={totalGrossAmount}
          icon={<TrendingUp size={18} />}
          color="text-slate-600"
          bg="bg-slate-100"
        />
        <StatCard
          label="Cancelled"
          value={totalCancelledAmount}
          icon={<XCircle size={18} />}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          label="Net Revenue"
          value={netRevenue}
          icon={<Wallet size={18} />}
          color="text-blue-600"
          bg="bg-blue-50"
          isPrimary
        />
      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-semibold text-slate-500">
                Customer & Vehicle
              </th>
              <th className="p-4 font-semibold text-slate-500">Amount</th>
              <th className="p-4 font-semibold text-slate-500 text-center">
                Status
              </th>
              <th className="p-4 font-semibold text-slate-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentData.map((b) => (
              <tr
                key={b._id}
                className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                onClick={() => setSelectedBooking(b)}
              >
                <td className="p-4">
                  <div className="font-semibold text-slate-800">
                    {b.customer?.name}
                  </div>
                  <div className="text-xs text-slate-500">{b.car?.carName}</div>
                </td>
                <td className="p-4 font-bold text-slate-700">
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
                        onClick={(e) => handleUpdateStatus(e, b._id, "confirm")}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        onClick={(e) => handleUpdateStatus(e, b._id, "cancel")}
                        className="bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:text-red-600"
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

      {/* PAGINATION */}
      <div className="max-w-6xl mx-auto mt-6 flex justify-between items-center text-xs font-bold text-slate-400">
        <span>
          Showing {currentData.length} of {filteredBookings.length}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Booking Summary</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 hover:bg-slate-200 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InfoBox
                  icon={<User size={14} />}
                  label="Customer"
                  value={selectedBooking.customer?.name}
                  sub={selectedBooking.customer?.phone}
                />
                <InfoBox
                  icon={<Car size={14} />}
                  label="Vehicle"
                  value={selectedBooking.car?.carName}
                  sub={selectedBooking.bookingType}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl grid grid-cols-2 gap-y-4">
                <InfoBox
                  icon={<Calendar size={14} />}
                  label="Pickup Date"
                  value={new Date(
                    selectedBooking.pickupDate,
                  ).toLocaleDateString()}
                  sub={selectedBooking.pickupTime}
                />
                <InfoBox
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
                  icon={<MapPin size={14} />}
                  label="Pickup Location"
                  value={selectedBooking.pickupLocation}
                />
                <InfoBox
                  icon={<Navigation size={14} />}
                  label="Drop Location"
                  value={selectedBooking.dropLocation}
                />
              </div>

              <div className="flex justify-between items-end pt-2">
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
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${selectedBooking.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}
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

function StatCard({ label, value, icon, color, bg, isPrimary }) {
  return (
    <div
      className={`p-6 rounded-2xl border border-slate-100 bg-white ${isPrimary ? "ring-2 ring-blue-500/10" : ""}`}
    >
      <div
        className={`w-9 h-9 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
        {label}
      </p>
      <h2 className={`text-2xl font-bold mt-1 ${color}`}>
        ₹{value.toLocaleString("en-IN")}
      </h2>
    </div>
  );
}

function InfoBox({ icon, label, value, sub }) {
  return (
    <div className="flex gap-3">
      <div className="text-slate-400 mt-1">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700 leading-tight">
          {value}
        </p>
        {sub && <p className="text-xs text-slate-500 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

export default BookingRequests;
