import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Eye,
  Heart,
  ArrowRight,
  TicketPlus,
  Headset,
  X,
  CarFront,
} from "lucide-react";
// import
import Navbar from "../../components/Navbar";

function About() {
  // Added theme state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // theme changes instantly
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

  const bgPrimary = theme === "dark" ? "bg-[#0f172a]" : "bg-[#f9fafb]";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const cardBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-white";

  return (
    <div
      className={`transition-colors duration-300 ${bgPrimary} ${textPrimary}`}
    >
      <Navbar />

      {/* Hero Section */}
      <div
        className={`px-6 md:px-14 py-12 md:py-24 flex flex-col lg:flex-row lg:space-x-10 space-y-10 lg:space-y-0 transition-colors ${bgPrimary}`}
      >
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-7xl font-bold w-full lg:w-160 tracking-wide">
            Redefining the{" "}
            <span className="text-blue-600">Car Rental Experience</span>
          </h1>
          <p className={`${textSecondary} w-full lg:w-150 mt-5 tracking-wide`}>
            We're more than just a rental service. We're your gateway to premium
            mobility, combining a world-class fleet with unparalleled customer
            services.
          </p>
          <Link to={"/cars"}>
            <button className="px-8 py-2.5 border rounded-md font-bold w-40 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer mt-10">
              Explore Cars
            </button>
          </Link>
        </div>
        <div className="w-full lg:w-auto flex justify-center">
          <img
            src="https://i.pinimg.com/736x/c8/bb/ae/c8bbaee908c2bedf845b674888fa6d36.jpg"
            alt="Hero Car"
            className="rounded-2xl h-64 md:h-110 w-full lg:w-auto object-cover shadow-2xl"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div
        className={`px-6 md:px-10 py-10 shadow flex flex-col lg:flex-row lg:space-x-10 space-y-10 lg:space-y-0 transition-colors ${bgPrimary}`}
      >
        <div className="w-full lg:w-auto">
          <span className="text-2xl md:text-4xl text-blue-600 font-semibold uppercase">
            OUR MISSION
          </span>
          <h1 className="text-2xl md:text-4xl font-bold w-full lg:w-160 my-6">
            Redefining mobility by providing accessible, reliable, and premium
            car rental experiences for every journey.
          </h1>

          <div
            className={`flex space-x-3.5 p-6 rounded-2xl border transition-colors ${cardBg}`}
          >
            <div className="bg-blue-600/20 w-12 h-12 flex justify-center items-center rounded-xl shrink-0">
              <Eye className="text-blue-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Our Vision</h1>
              <p className={textSecondary}>
                To become the world's most customer-centric car rental platform,
                leveraging technology to simplify travel for everyone.
              </p>
            </div>
          </div>

          <div
            className={`flex space-x-3.5 p-6 my-4 rounded-2xl border transition-colors ${cardBg}`}
          >
            <div className="bg-blue-600/20 w-12 h-12 flex justify-center items-center rounded-xl shrink-0">
              <Heart className="text-blue-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Our Values</h1>
              <p className={textSecondary}>
                Integrity, transparency, and service excellence are at the heart
                of everything we do, every single day.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center w-full lg:w-auto">
          <img
            src="https://i.pinimg.com/736x/1b/3f/ad/1b3fad548ea401cd660ff8da9783bf86.jpg"
            alt="Values Image"
            className="rounded-3xl w-full lg:w-180 shadow-xl"
          />
        </div>
      </div>

      {/* Growth Story Section*/}
      <div
        className={`${theme === "dark" ? "bg-slate-900/50" : "bg-[#eaf1f7]"} py-20 transition-colors`}
      >
        <h1 className="text-3xl md:text-4xl font-black flex justify-center mb-16">
          Our Growth Story
        </h1>

        <div className="space-y-12">
          {/* 2012 */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-20 px-6 md:px-[10%]">
            <div className="text-center md:text-right w-full md:w-1/3">
              <span className="text-blue-600 text-2xl font-black block mb-2">
                2012
              </span>
              <p className={textSecondary}>
                Founded with a small fleet of 10 cars in London, focused on
                local commuters.
              </p>
            </div>
            <ArrowRight
              size={40}
              className="text-blue-600 shrink-0 rotate-90 md:rotate-0"
            />
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h1 className="font-bold text-2xl">The Humble Beginning</h1>
            </div>
          </div>

          {/* 2016 */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-20 px-6 md:px-[10%]">
            <div className="text-center md:text-right w-full md:w-1/3">
              <span className="text-blue-600 text-2xl font-black block mb-2">
                Digital Transformation
              </span>
              <p className={textSecondary}>
                Launched our first mobile booking platform, reaching over 50,000
                customers.
              </p>
            </div>
            <ArrowRight
              size={40}
              className="text-blue-600 shrink-0 rotate-90 md:rotate-0"
            />
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h1 className="font-bold text-2xl">2016</h1>
            </div>
          </div>

          {/* Present */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-20 px-6 md:px-[10%]">
            <div className="text-center md:text-right w-full md:w-1/3">
              <span className="text-blue-600 text-2xl font-black block mb-2">
                Present
              </span>
              <p className={textSecondary}>
                Operating in 15 countries with a diverse fleet of over 5000
                premium vehicles.
              </p>
            </div>
            <ArrowRight
              size={40}
              className="text-blue-600 shrink-0 rotate-90 md:rotate-0"
            />
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h1 className="font-bold text-2xl">Global Mobility Leader</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section  */}
      <div className={`px-6 md:px-18 py-20 transition-colors ${bgPrimary}`}>
        <h1 className="text-2xl md:text-3xl font-black flex justify-center text-center mb-2">
          Why Choose CarRental?
        </h1>
        <p className={`${textSecondary} flex justify-center text-center mb-12`}>
          We provide the best rental experience with premium benefits and 24/7
          support.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <BenefitCard
            theme={theme}
            icon={<TicketPlus />}
            title="Best Price Guarantee"
            desc="Find a lower price elsewhere and we'll beat it by 10%. No hidden fees, ever."
          />
          <BenefitCard
            theme={theme}
            icon={<Headset />}
            title="24/7 Roadside Assist"
            desc="Drive with peace of mind knowing our support team is just one call away, anytime."
          />
          <BenefitCard
            theme={theme}
            icon={<X />}
            title="Free Cancellation"
            desc="Plan changed? Cancel your booking up to 24 hours before pick-up for a full refund."
          />
        </div>
      </div>

      {/* Footer*/}
      <div
        className={`${theme === "dark" ? "bg-black border-t border-slate-800" : "bg-black"} text-white flex flex-col md:flex-row justify-between px-6 md:px-28 py-16 space-y-12 md:space-y-0`}
      >
        <div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <CarFront size={24} color="white" />
            </div>
            <p className="font-bold text-2xl tracking-tighter">CarRental</p>
          </div>
          <p className="w-full md:w-80 mt-6 text-gray-500 leading-relaxed">
            The premier choice for luxury and premium car rentals worldwide.
            Making every journey a memory worth keeping.
          </p>
          <p className="text-gray-600 mt-8 text-sm">
            © {new Date().getFullYear()} CarRentals. All rights reserved.
          </p>
        </div>

        <div>
          <h1 className="font-bold text-lg mb-6">Quick Links</h1>
          <ul className="space-y-3">
            <li className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
              Cars
            </li>
            <li className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
              Special Offers
            </li>
            <li className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
              Rental Locations
            </li>
            <li className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
              Careers
            </li>
          </ul>
        </div>

        <div>
          <h1 className="font-bold text-lg mb-6">Support</h1>
          <ul className="space-y-3">
            <li className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
              Help Center
            </li>
            <li className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
              Privacy Policy
            </li>
            <li className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
              Terms of Service
            </li>
            <li className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
              Cookie Policy
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, desc, theme }) {
  const cardBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-slate-100";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";

  return (
    <div
      className={`flex flex-col items-center p-10 rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all ${cardBg}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex justify-center items-center mb-6 text-blue-600">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h1 className={`text-xl font-bold mb-3 ${textPrimary}`}>{title}</h1>
      <p className={`${textSecondary} text-center leading-relaxed`}>{desc}</p>
    </div>
  );
}

export default About;
