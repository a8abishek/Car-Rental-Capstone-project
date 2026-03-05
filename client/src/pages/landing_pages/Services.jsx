import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Calendar,
  UserCheck,
  Briefcase,
  Star,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";
// import
import Navbar from "../../components/Navbar";

const Services = () => {
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

  const services = [
    {
      title: "Short-term Rental",
      desc: "Flexible daily and weekly options for city exploration or weekend getaways with full coverage.",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      title: "Chauffeur Service",
      desc: "Professional multilingual drivers for airport transfers and executive travel requirements.",
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      title: "Corporate Fleet",
      desc: "Customized management solutions for business teams and dedicated executive support.",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      title: "Luxury Events",
      desc: "Exclusive vehicle selection for weddings, galas, and red-carpet appearances.",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0f172a]" : "bg-gray-50"
      }`}
    >
      <Navbar />

      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="max-w-5xl flex flex-col items-center">
            {/* Centered Badge */}
            <div className="flex mb-8 items-center space-x-1 bg-blue-200 text-blue-600 font-bold px-6 py-1.5 justify-center rounded-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="uppercase tracking-widest text-[10px]">
                Premium Services
              </span>
            </div>

            {/* Large Centered Heading */}
            <h1
              className={`text-8xl font-bold leading-tight mb-8 ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Premium Mobility <br />
              <span className="text-blue-500">Tailored for You.</span>
            </h1>

            <p
              className={`text-xl mb-12 w-[80%] mx-auto leading-relaxed font-medium ${
                theme === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Experience the next level of automotive luxury. We provide
              world-class solutions for every journey, driven by excellence.
              From executive travel to special events, we have you covered.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/cars"
                className="bg-blue-600 text-white hover:bg-blue-700 px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 text-sm shadow-xl shadow-blue-500/30 active:scale-95"
              >
                EXPLORE FLEET <ChevronRight size={18} />
              </Link>
              <Link
                to="/contacts"
                className={`px-10 py-4 rounded-2xl font-bold transition-all text-sm border shadow-sm active:scale-95 ${
                  theme === "dark"
                    ? "text-white border-slate-700 hover:bg-slate-800"
                    : "text-slate-900 border-slate-200 bg-white hover:bg-gray-50"
                }`}
              >
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Services Grid --- */}
      <section className="py-24">
        <div className="w-full max-w-7xl mx-auto px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((item, idx) => (
              <div
                key={idx}
                className={`group relative p-10 border transition-all duration-500 rounded-[2.5rem] shadow-xl hover:-translate-y-2 ${
                  theme === "dark"
                    ? "bg-slate-900 border-slate-800 hover:bg-blue-600 shadow-black/20"
                    : "bg-white border-white hover:bg-blue-600 shadow-blue-900/5"
                }`}
              >
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-8 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-slate-800 text-blue-400 group-hover:bg-white/20 group-hover:text-white"
                      : "bg-blue-50 text-blue-600 group-hover:bg-white/20 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </div>

                <h4
                  className={`text-xl font-bold mb-4 group-hover:text-white transition-colors ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h4>
                <p
                  className={`text-sm leading-relaxed mb-8 group-hover:text-blue-100 transition-colors ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {item.desc}
                </p>

                <Link
                  to="/contacts"
                  className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors group-hover:text-white ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  Details <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer
        className={`pt-24 pb-12 ${
          theme === "dark"
            ? "bg-slate-950 border-t border-slate-900"
            : "bg-black text-white"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1">
              <h3 className="text-2xl font-black tracking-tighter text-white mb-8">
                CAR<span className="text-blue-400">RENTAL</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                The leading provider of luxury automotive experiences.
                Excellence in every mile.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 hover:bg-blue-600 transition-all cursor-pointer"
                  >
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-8 uppercase tracking-widest">
                Navigation
              </h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <Link to="/" className="hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/cars" className="hover:text-white transition">
                    Fleet
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white transition">
                    Services
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-8 uppercase tracking-widest">
                Legal
              </h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-white cursor-pointer transition">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer transition">
                  Terms of Use
                </li>
                <li className="hover:text-white cursor-pointer transition">
                  Refund Policy
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-8 uppercase tracking-widest">
                Contact
              </h4>
              <ul className="space-y-6 text-sm text-gray-500">
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-400" />
                  info@carrental.com
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-400" /> +91 902 541 1792
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-gray-600">
            <p>
              © {new Date().getFullYear()} CARRENTAL ELITE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer">INSTAGRAM</span>
              <span className="hover:text-white cursor-pointer">LINKEDIN</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;
