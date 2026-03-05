import React, { useEffect, useState } from "react";
import {
  Download,
  Calendar,
  History,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiFetch } from "../../../api/apiFetch";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const theme = localStorage.getItem("theme") || "light";

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    apiFetch("/api/bookings/payment-history")
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDownload = (item) => {
    setSelectedInvoice(item);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const filteredPayments = payments.filter((p) =>
    filter === "All"
      ? true
      : p.paymentStatus.toLowerCase() === filter.toLowerCase(),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm font-medium tracking-tight">
          Loading transactions...
        </p>
      </div>
    );

  return (
    <div
      className={`w-full min-h-screen ${theme === "dark" ? "bg-[#0B0F1A]" : "bg-[#F8FAFC]"} p-4 md:p-8`}
    >
      <div className="max-w-6xl mx-auto no-print">
        {/* TAB NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
          <div
            className={`flex flex-wrap p-1 rounded-xl border ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
          >
            {["All", "Paid", "Refunded", "Pending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 md:px-6 py-2 rounded-lg text-[11px] md:text-xs font-bold transition-all ${
                  filter === tab
                    ? "bg-indigo-600 text-white shadow-lg"
                    : theme === "dark"
                      ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                {tab === "All" ? "All Transactions" : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-800 text-white hover:bg-slate-800"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div
          className={`overflow-hidden rounded-2xl border transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
        >
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr
                  className={`border-b ${theme === "dark" ? "border-slate-800" : "border-slate-100"}`}
                >
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Car Model
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className={`transition-colors group ${theme === "dark" ? "hover:bg-slate-800/40" : "hover:bg-indigo-50/30"}`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p
                        className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                      >
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-xs font-mono font-bold text-slate-400 whitespace-nowrap">
                      #TRX-{item._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 min-w-37.5">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/50">
                          <img
                            src={item.car?.carImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-bold truncate ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                          >
                            {item.car?.carName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase truncate">
                            {item.car?.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p
                        className={`text-sm font-black ${item.paymentStatus === "refunded" ? "text-red-500" : theme === "dark" ? "text-white" : "text-slate-900"}`}
                      >
                        {item.paymentStatus === "refunded" ? "-" : ""}₹
                        {item.totalAmount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${item.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-600" : item.paymentStatus === "refunded" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.paymentStatus === "paid" ? "bg-emerald-500" : item.paymentStatus === "refunded" ? "bg-red-500" : "bg-blue-500"}`}
                        ></span>
                        {item.paymentStatus.charAt(0).toUpperCase() +
                          item.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleDownload(item)}
                        className={`p-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                            : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        }`}
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {filteredPayments.length > 0 && (
            <div
              className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center gap-4 justify-between ${theme === "dark" ? "border-slate-800" : "border-slate-100"}`}
            >
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider order-2 sm:order-1">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredPayments.length)} of{" "}
                {filteredPayments.length}
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={`p-2 rounded-lg border transition-all ${theme === "dark" ? "border-slate-800 text-white disabled:opacity-20 hover:bg-slate-800" : "border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50"}`}
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1 overflow-x-auto max-w-37.5 sm:max-w-none custom-scrollbar">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`min-w-8 h-8 rounded-lg text-[11px] font-bold transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white" : theme === "dark" ? "text-slate-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`p-2 rounded-lg border transition-all ${theme === "dark" ? "border-slate-800 text-white disabled:opacity-20 hover:bg-slate-800" : "border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50"}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- INVOICE PRINT TEMPLATE --- */}
      {selectedInvoice && (
        <div className="print-only bg-white text-black p-12">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-10 mb-10">
            <div>
              <h1 className="text-3xl font-black italic mb-1 uppercase tracking-tighter">
                Receipt.
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Transaction Confirmation
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black uppercase mb-1">
                Car Rental Services
              </p>
              <p className="text-[10px] text-slate-500">
                Document ID: TRX-{selectedInvoice._id.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="mb-10 text-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
              Billed To
            </p>
            <p className="font-black text-base uppercase mb-1">
              Premium Customer
            </p>
            <p className="text-slate-500 italic">
              Booking Ref: {selectedInvoice._id}
            </p>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-10">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-black uppercase">
                    Service / Vehicle
                  </th>
                  <th className="px-6 py-4 font-black uppercase text-right">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-6">
                    <p className="font-black text-lg mb-1">
                      {selectedInvoice.car?.carName}
                    </p>
                    <p className="text-slate-400 font-medium">
                      Reservation and Full Advance Payment
                    </p>
                  </td>
                  <td className="px-6 py-6 text-right font-black text-lg tracking-tight">
                    {selectedInvoice.paymentStatus === "refunded" ? "-" : ""}₹
                    {selectedInvoice.totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-10 text-xs text-slate-400 font-bold uppercase">
              <span>Subtotal</span>
              <span>₹{selectedInvoice.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex gap-10 text-xl font-black tracking-tighter pt-2">
              <span>Final Total</span>
              <span
                className={
                  selectedInvoice.paymentStatus === "refunded"
                    ? "text-red-600"
                    : "text-indigo-600"
                }
              >
                {selectedInvoice.paymentStatus === "refunded" ? "-" : ""}₹
                {selectedInvoice.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-32 text-center pt-8 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
              Thank you for choosing our premium fleet
            </p>
          </div>
        </div>
      )}

      <style>{`
        @media screen { .print-only { display: none !important; } }
        @media print {
          /* Aggressive removal of all sidebar/nav elements */
          aside, nav, [role="navigation"], .sidebar-container, .sidebar, 
          div[class*="w-64"], div[class*="sidebar"], .no-print { 
            display: none !important; 
            width: 0 !important;
            height: 0 !important;
            visibility: hidden !important;
          }
          
          /* Force main container to use full width and remove margins */
          body, html, #root, .flex-1, div[class*="md:ml-64"] { 
            margin: 0 !important; 
            padding: 0 !important; 
            margin-left: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .print-only { 
            display: block !important; 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%;
          }
          
          @page { size: auto; margin: 10mm; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

export default PaymentHistory;
