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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

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

  useEffect(() => {
    if (!location.state || !car) {
      toast.error("Session expired. Please restart booking.");
      navigate("/fleet");
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

  if (!car)
    return (
      <div
        className={`p-20 text-center font-bold transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a] text-white" : "text-slate-800"}`}
      >
        Invalid Access
      </div>
    );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-12 px-4 md:px-10 ${theme === "dark" ? "bg-[#0f172a]" : "bg-[#F3F5F7]"}`}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        {/* LEFT: Summary */}
        {/* LEFT: Summary */}
        <div className="lg:col-span-4">
          <div
            className={`p-6 rounded-2xl shadow-sm border sticky top-10 transition-colors duration-300 ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-blue-500" size={20} />
              Booking Summary
            </h2>

            {/* Car Mini-Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dashed border-slate-700/50">
              <div
                className={`p-2 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}
              >
                <img
                  src={car.carImage}
                  className="w-16 h-12 object-contain"
                  alt={car.carName}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">
                  {car.carName}
                </h3>
                <p className="text-[10px] font-bold text-blue-500 uppercase">
                  {car.brand} • {bookingType}
                </p>
              </div>
            </div>

            {/* Itinerary Details */}
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-blue-500/30">
                <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Pick-up
                </p>
                <p className="font-bold text-sm">{formData?.pickupLocation}</p>
                <p className="text-xs text-slate-400">{formData?.pickupDate}</p>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-700/30">
                <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-slate-500 border-4 border-slate-900" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Drop-off
                </p>
                <p className="font-bold text-sm">{formData?.dropLocation}</p>
                <p className="text-xs text-slate-400">{formData?.dropDate}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div
              className={`mt-8 p-4 rounded-xl ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"}`}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 font-medium">
                  Rental Duration
                </span>
                <span className="font-bold">{daysCount} Days</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 font-medium">Daily Rate</span>
                <span className="font-bold">
                  ₹{(totalAmount / daysCount).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-700/50">
                <span className="font-bold">Subtotal</span>
                <span className="font-bold text-blue-500">
                  ₹{totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Amount
                </p>
                <p className="text-3xl font-black text-emerald-500">
                  ₹{totalAmount?.toLocaleString()}
                </p>
              </div>
              <ShieldCheck className="text-emerald-500" size={32} />
            </div>
          </div>
        </div>

        {/* RIGHT: Stripe UI */}
        <div className="lg:col-span-8">
          <div
            className={`p-8 md:p-10 rounded-3xl shadow-sm border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="mb-10">
              <h2
                className={`text-3xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              >
                Secure Checkout
              </h2>
              <p
                className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} font-medium`}
              >
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
