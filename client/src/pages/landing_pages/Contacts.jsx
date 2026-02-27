import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import Navbar from "./../../components/Navbar";

function Contacts() {
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const bgPrimary = theme === "dark" ? "bg-[#0f172a]" : "bg-[#f8fafc]";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const cardBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800 shadow-black/20"
      : "bg-white border-slate-200 shadow-slate-200/50";
  const inputBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-white"
      : "bg-[#f8fafc] border-slate-200 text-slate-900";

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${bgPrimary} ${textPrimary}`}
    >
      <Navbar />

      <section className="relative pt-24 pb-24 overflow-hidden">
        {/* Soft Glow */}
        <div
          className={`absolute top-0 right-0 w-125 h-125 blur-[100px] rounded-full z-0 transition-colors duration-500 ${
            theme === "dark" ? "bg-blue-900/20" : "bg-blue-100/50"
          }`}
        ></div>

        <div className="max-w-300 mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Text Info */}
            <div className="space-y-8">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors ${
                  theme === "dark"
                    ? "bg-blue-500/10 border-blue-500/20"
                    : "bg-blue-600/10 border-blue-200"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span
                  className={`${theme === "dark" ? "text-blue-400" : "text-blue-700"} font-bold uppercase tracking-widest text-[10px]`}
                >
                  24/7 Concierge
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter">
                Get in <span className="text-blue-600">Touch.</span>
              </h1>

              <p
                className={`text-xl max-w-md leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
              >
                Experience the gold standard of customer support. We are ready
                to assist with your premium travel needs.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div
                    className={`w-10 h-10 shadow-md border text-blue-600 flex items-center justify-center rounded-xl group-hover:scale-110 transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-100"
                    }`}
                  >
                    <Mail size={18} />
                  </div>
                  <span
                    className={`font-bold ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
                  >
                    info@carrental.com
                  </span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div
                    className={`w-10 h-10 shadow-md border text-blue-600 flex items-center justify-center rounded-xl group-hover:scale-110 transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-100"
                    }`}
                  >
                    <Phone size={18} />
                  </div>
                  <span
                    className={`font-bold ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
                  >
                    +91 (902) 541-1792
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: The Form Card */}
            <div className="relative">
              <div
                className={`border rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all duration-300 ${cardBg}`}
              >
                {submitted ? (
                  <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Message Sent!</h2>
                    <p
                      className={
                        theme === "dark" ? "text-slate-400" : "text-slate-500"
                      }
                    >
                      Thank you for choosing CarRental Elite.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label
                          className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}
                        >
                          Full Name
                        </label>
                        <input
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          type="text"
                          placeholder="John Doe"
                          className={`w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-500 border ${inputBg}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}
                        >
                          Email
                        </label>
                        <input
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email"
                          placeholder="john@example.com"
                          className={`w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-500 border ${inputBg}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}
                      >
                        Message
                      </label>
                      <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        placeholder="How can we assist you today?"
                        className={`w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none placeholder:text-slate-500 border ${inputBg}`}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                    >
                      SEND INQUIRY <Send size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contacts;
