import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const StripeCheckoutForm = ({ totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const applyTheme = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      setTheme(currentTheme);
    };

    window.addEventListener("storage", applyTheme);
    window.addEventListener("themeChanged", applyTheme);

    return () => {
      window.removeEventListener("storage", applyTheme);
      window.removeEventListener("themeChanged", applyTheme);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className={`p-4 rounded-2xl border transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <PaymentElement
          options={{
            layout: "tabs",
            appearance: {
              theme: theme === "dark" ? "night" : "stripe",
              variables: {
                colorPrimary: "#1877F2",
                colorBackground: theme === "dark" ? "#1e293b" : "#f8fafc",
                colorText: theme === "dark" ? "#ffffff" : "#0f172a",
                colorDanger: "#df1b41",
                fontFamily: "Ideal Sans, system-ui, sans-serif",
                spacingUnit: "4px",
                borderRadius: "8px",
              },
            },
          }}
        />
      </div>

      <button
        disabled={isProcessing || !stripe}
        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95 shadow-xl ${
          theme === "dark"
            ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20"
            : "bg-[#1877F2] hover:bg-blue-700 shadow-blue-200"
        } text-white`}
      >
        {isProcessing
          ? "Validating..."
          : `Pay ₹${totalAmount?.toLocaleString()}`}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
