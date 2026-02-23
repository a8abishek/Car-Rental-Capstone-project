import React, { useEffect, useState } from 'react';
import { apiFetch } from "../../../api/apiFetch";
import { toast } from "react-hot-toast";
import { 
  Search, MapPin, Calendar, User as UserIcon, Phone, 
  X, Car, ChevronDown, ChevronUp, Clock, CreditCard, Download,
  AlertCircle, RefreshCcw
} from 'lucide-react';

// PDF LIBRARIES
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Mybooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/bookings/my-bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyBookings(); }, []);

  // UPDATED: GENERATE INVOICE OR CANCELLATION SLIP
  const generateInvoice = (item) => {
    try {
      const doc = new jsPDF();
      const carName = item.car ? `${item.car.brand} ${item.car.carName}` : "N/A";
      const invoiceNo = item._id?.slice(-6).toUpperCase() || 'N/A';
      const isCancelled = item.status === 'cancelled';

      // --- 1. Header Branding ---
      doc.setFillColor(isCancelled ? 225 : 79, isCancelled ? 29 : 70, isCancelled ? 72 : 229); 
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("DRIVE-EASE", 20, 25);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(isCancelled ? "CANCELLATION & REFUND ADVISORY" : "PREMIUM CAR RENTALS", 20, 32);

      // --- 2. Title & Meta ---
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(isCancelled ? "CREDIT NOTE" : "INVOICE", 140, 65);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Doc No: #${isCancelled ? 'CN' : 'INV'}-${invoiceNo}`, 140, 75);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 80);

      // --- 3. Bill To ---
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("CUSTOMER DETAILS:", 20, 65);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80);
      doc.text(`Booking ID: ${item._id}`, 20, 72);
      doc.text(`Pickup: ${item.pickupLocation}`, 20, 79);

      // --- 4. Main Table ---
      autoTable(doc, {
        startY: 100,
        head: [['Description', 'Booking Status', 'Total Value', 'Amount Paid']],
        body: [[
          carName, 
          item.status.toUpperCase(), 
          `INR ${item.totalAmount}`, 
          `INR ${item.advancePaid}`
        ]],
        theme: 'striped',
        headStyles: { fillColor: isCancelled ? [225, 29, 72] : [79, 70, 229] }
      });

      // --- 5. Financial Summary ---
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFillColor(248, 250, 252);
      doc.rect(120, finalY, 75, 45, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Total Paid:", 125, finalY + 10);
      doc.text(`INR ${item.advancePaid}`, 188, finalY + 10, { align: 'right' });
      
      if(isCancelled) {
        doc.text("Cancellation Fee:", 125, finalY + 18);
        doc.text(`- INR ${item.cancellationFee || 0}`, 188, finalY + 18, { align: 'right' });
        
        doc.setDrawColor(220);
        doc.line(125, finalY + 23, 190, finalY + 23);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(225, 29, 72);
        doc.text("REFUND AMOUNT:", 125, finalY + 32);
        doc.text(`INR ${item.refundAmount || item.advancePaid}`, 188, finalY + 32, { align: 'right' });
        doc.setFontSize(8);
        doc.text(`Status: ${item.refundStatus || 'Processing'}`, 125, finalY + 38);
      } else {
        doc.text("Balance Due:", 125, finalY + 18);
        doc.text(`INR ${item.totalAmount - item.advancePaid}`, 188, finalY + 18, { align: 'right' });
      }

      // --- 6. Footer ---
      doc.setFontSize(8);
      doc.setTextColor(160);
      doc.text("For refund queries, contact admin@driveease.com", 105, 280, { align: "center" });

      doc.save(`${isCancelled ? 'Refund' : 'Invoice'}_${invoiceNo}.pdf`);
      toast.success("Document downloaded!");
    } catch (err) {
      toast.error("Error generating PDF");
    }
  };

  const filteredBookings = bookings.filter((item) => {
    const isPast = new Date(item.dropDate) < new Date();
    const carName = (item.car?.carName || "").toLowerCase();
    const matchesSearch = carName.includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'cancelled') return item.status === 'cancelled';
    if (activeTab === 'completed') return item.status === 'confirmed' && isPast;
    if (activeTab === 'upcoming') return (item.status === 'pending' || item.status === 'confirmed') && !isPast;
    return false;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Booking History</h1>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-8 mb-6 border-b border-gray-100">
          {['upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setExpandedRow(null); }}
              className={`pb-4 text-sm font-bold capitalize relative ${activeTab === tab ? "text-indigo-600" : "text-gray-400"}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Car Details</th>
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((item) => (
                <React.Fragment key={item._id}>
                  <tr 
                    onClick={() => setExpandedRow(expandedRow === item._id ? null : item._id)}
                    className="cursor-pointer hover:bg-gray-50 transition-all border-b border-gray-50"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img src={item.car?.carImage} className="w-12 h-12 rounded-lg object-cover" alt="car" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.car?.brand} {item.car?.carName}</p>
                          <p className="text-[10px] text-gray-400 font-mono uppercase">#{item._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-black">₹{item.totalAmount}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {expandedRow === item._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </td>
                  </tr>

                  {/* EXPANDED SECTION */}
                  {expandedRow === item._id && (
                    <tr className="bg-white">
                      <td colSpan="4" className="p-8 border-b border-indigo-50 shadow-inner">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          
                          {/* INFO SECTION */}
                          <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4">Trip Details</h4>
                            <div className="space-y-3">
                              <p className="text-xs font-bold flex items-center gap-2"><MapPin size={14} className="text-indigo-400"/> {item.pickupLocation}</p>
                              <p className="text-xs font-bold flex items-center gap-2"><Calendar size={14} className="text-indigo-400"/> {new Date(item.pickupDate).toDateString()}</p>
                            </div>
                          </div>

                          {/* REFUND / DRIVER SECTION */}
                          <div>
                            {item.status === 'cancelled' ? (
                              <>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 text-rose-500">Refund Information</h4>
                                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                  <div className="flex items-center gap-3 mb-2">
                                    <RefreshCcw size={16} className="text-rose-600 animate-spin-slow" />
                                    <p className="text-xs font-bold text-rose-700">Refund {item.refundStatus || 'Initiated'}</p>
                                  </div>
                                  <p className="text-[10px] text-rose-600">Refund will be credited to your original payment method within 5-7 business days.</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4">Service Assigned</h4>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                                  <UserIcon size={16} className="text-indigo-500" />
                                  <p className="text-xs font-bold text-gray-600">{item.bookingType === 'driver' ? (item.driverAssigned?.name || "Allocation Pending") : "Self-Drive Mode"}</p>
                                </div>
                              </>
                            )}
                          </div>

                          {/* FINANCIALS */}
                          <div className={`p-6 rounded-2xl text-white ${item.status === 'cancelled' ? 'bg-rose-600' : 'bg-gray-900'}`}>
                            <div className="flex justify-between text-xs mb-2">
                              <span>{item.status === 'cancelled' ? 'Refundable Amount' : 'Paid Advance'}</span>
                              <span className="font-bold">₹{item.status === 'cancelled' ? (item.refundAmount || item.advancePaid) : item.advancePaid}</span>
                            </div>
                            <div className="pt-3 border-t border-white/20">
                              <button 
                                onClick={(e) => { e.stopPropagation(); generateInvoice(item); }}
                                className="w-full bg-white text-gray-900 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                              >
                                <Download size={14} /> {item.status === 'cancelled' ? 'Refund Receipt' : 'Get Invoice'}
                              </button>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Mybooking;