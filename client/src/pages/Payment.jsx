import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ShieldCheck, Lock, CheckCircle2, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "../api/apiFetch";
import StripeCheckoutForm from "../components/StripeCheckoutForm";

// Initialize Stripe with your Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { car, formData, daysCount, totalAmount, bookingType } =
    location.state || {};

  const [clientSecret, setClientSecret] = useState("");

  if (!car)
    return (
      <div className="p-20 text-center font-bold text-slate-800">
        Invalid Access
      </div>
    );

    useEffect(() => {
    if (!location.state || !car) {
      toast.error("Session expired. Please restart booking.");
      navigate("/fleet"); // or wherever your car listing is
    }
  }, [location.state, car, navigate]);
  
  // 1. Get the Client Secret from your Backend
  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const response = await apiFetch("/api/payment/create-intent", {
          method: "POST",
          body: JSON.stringify({ amount: totalAmount }),
        });
        setClientSecret(response.clientSecret);
      } catch (err) {
        toast.error("Failed to initialize payment gateway");
      }
    };

    if (totalAmount) fetchSecret();
  }, [totalAmount]);

  // 2. Finalize Booking after Stripe success
  const handlePaymentSuccess = async (paymentIntentId) => {
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
          paymentId: paymentIntentId,
        }),
      });
      toast.success("Booking Confirmed!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Payment was successful, but booking failed to save.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F7] py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        {/* LEFT: Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-10">
            <h2 className="text-xl font-bold mb-6">Booking Summary</h2>
            <div className="bg-[#E9EDF0] rounded-xl mb-5 p-4">
              <img
                src={car.carImage}
                className="w-full h-32 object-contain"
                alt={car.carName}
              />
            </div>
            <h3 className="text-2xl font-black">{car.carName}</h3>
            <p className="text-blue-600 font-bold text-[10px] uppercase mb-6">
              {car.brand} • Full Insurance
            </p>
            <div className="mt-8 pt-6 border-t flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Total to Pay
                </p>
                <p className="text-3xl font-black">
                  ₹{totalAmount?.toLocaleString()}
                </p>
              </div>
              <ShieldCheck className="text-emerald-500 mb-1" size={28} />
            </div>
          </div>
        </div>

        {/* RIGHT: Stripe UI */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900">
                Secure Checkout
              </h2>
              <p className="text-slate-500 font-medium">
                Payment powered by Stripe Encryption
              </p>
            </div>

            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm
                  totalAmount={totalAmount}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            ) : (
              <div className="flex flex-col items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-slate-500 font-bold animate-pulse">
                  Establishing Secure Connection...
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold">
              <Lock size={12} /> SECURE 256-BIT ENCRYPTED TRANSACTION
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
