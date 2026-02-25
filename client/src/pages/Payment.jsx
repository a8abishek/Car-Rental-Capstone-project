import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { CreditCard, ShieldCheck, Info } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "../api/apiFetch";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { car, bookingType, formData, daysCount, totalAmount } = location.state || {};

  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  if (!car) return <div className="p-20 text-center font-bold">Invalid Access</div>;

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          carId: car._id,
          bookingType,
          pickupLocation: formData.pickupLocation,
          dropLocation: formData.dropLocation,
          pickupDate: formData.pickupDate,
          dropDate: formData.dropDate,
          drivingLicense: bookingType === "self" ? formData.drivingLicense : undefined,
          // Sending full amount to sync with backend
          paidAmount: totalAmount 
        }),
      });

      toast.success("100% Payment Successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* Left: Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-black mb-4">Booking Summary</h2>
          <img src={car.carImage} className="rounded-2xl mb-4 w-full h-40 object-cover" alt={car.carName} />
          <h3 className="font-bold text-xl">{car.carName}</h3>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">{car.brand}</p>
          
          <div className="mt-6 space-y-3 border-t pt-4 text-sm">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Rental ({daysCount} Days)</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Payment Required</span>
              <span>100% (Full)</span>
            </div>
          </div>

          <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
            <div className="flex justify-between items-center font-black text-xl">
              <span>Total Pay</span>
              <span className="text-indigo-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Right: Payment Form */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black mb-6">Secure Checkout</h2>

          <div className="flex gap-3 mb-8">
            {['card', 'paypal'].map((m) => (
              <button 
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 py-3 rounded-2xl font-bold capitalize transition-all ${
                  method === m ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-500"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-4">
             <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block tracking-widest">Cardholder Name</label>
                <input className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold focus:ring-2 ring-indigo-500 outline-none" placeholder="John Doe" />
             </div>
             <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block tracking-widest">Card Number</label>
                <input className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold focus:ring-2 ring-indigo-500 outline-none" placeholder="0000 0000 0000 0000" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <input className="bg-slate-50 border-none p-4 rounded-2xl font-bold focus:ring-2 ring-indigo-500 outline-none" placeholder="MM/YY" />
                <input className="bg-slate-50 border-none p-4 rounded-2xl font-bold focus:ring-2 ring-indigo-500 outline-none" placeholder="CVV" />
             </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 rounded-2xl flex gap-3 items-start border border-amber-100">
            <Info className="text-amber-600 shrink-0" size={20} />
            <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
              Cancellation Policy: Cancellations made more than 24 hours before pickup receive a 100% refund. Inside 24 hours, a 3% processing fee is deducted.
            </p>
          </div>

          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className="mt-8 w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <ShieldCheck size={20} /> {loading ? "PROCESSING..." : `CONFIRM ₹${totalAmount} PAYMENT`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;