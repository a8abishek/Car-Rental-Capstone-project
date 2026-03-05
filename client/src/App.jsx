import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  CircleStar,
  MapPin,
  Calendar,
  CalendarArrowDown,
  ArrowRight,
  TicketPlus,
  Headset,
  X,
  CarFront,
} from "lucide-react";
// import
import Navbar from "./components/Navbar";
import LandingCars from "./pages/landing_pages/LandingCar";

function App() {
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

  return (
    <div
      className={`transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a]" : "bg-gray-50"}`}
    >
      <Navbar />
      {/*Home section */}
      <div className="flex flex-col lg:flex-row justify-between px-6 md:px-16 pt-10 lg:pt-18">
        {/*left side */}
        <div className="w-full lg:w-auto">
          <div className="flex mb-5 items-center space-x-1 bg-blue-500 text-white font-bold w-60 justify-center rounded-2xl py-1">
            <CircleStar size={18} />
            <span>#Car Rental Service</span>
          </div>
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-bold w-full lg:w-[50%] ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Drive Your Dream :{" "}
            <span className="text-blue-500">Premium Rentals</span>
          </h1>
          <br />
          <p
            className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"} font-medium w-full lg:w-[85%]`}
          >
            Elevate your journey with a vehicle that reflects your ambition.
            From sleek sedans to elite SUVs, our meticulously maintained fleet
            is ready to turn your next drive into a luxury escape.
          </p>
          <div className="flex space-x-3 mt-5">
            <div className="w-10 rounded-full">
              <img
                src="https://photodpshare.com/wp-content/uploads/2025/09/cute-cartoon-dp-smiling.jpeg"
                alt=""
                className="rounded-full"
              />
            </div>
            <div className="w-10 rounded-full">
              <img
                src="https://statusvibes.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fy3ko4alw%2Fproduction%2F627d04257228b6f6bdb3c232549987a510adebb1-1080x1080.jpg&w=3840&q=75"
                alt=""
                className="rounded-full"
              />
            </div>
            <div className="w-10 rounded-full">
              <img
                src="https://photodpshare.com/wp-content/uploads/2025/09/cute-cartoon-dp.jpeg"
                alt=""
                className="rounded-full"
              />
            </div>
            <div className="w-10 rounded-full">
              <img
                src="https://i.pinimg.com/236x/94/d8/a8/94d8a8e6ce1089c4918a5abd711af940.jpg"
                alt=""
                className="rounded-full"
              />
            </div>
          </div>
        </div>
        {/**image */}
        <div className="w-full lg:w-[85%] mt-8 lg:mt-3">
          <img
            src="https://images.turo.com/media/vehicle/images/cpq_uryfQjGnl5aZA3uBYw.jpg"
            alt=""
            className="w-full rounded-2xl"
          />
        </div>
      </div>
      {/*Search*/}
      <div
        className={`flex flex-col lg:flex-row items-start lg:items-center justify-between mx-6 md:mx-16 lg:mx-30 py-8 shadow mt-10 px-8 rounded-2xl border gap-6 lg:gap-0 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-white"}`}
      >
        <div className="w-full lg:w-auto">
          {/*pickup location */}
          <div className="flex items-center space-x-1 mb-2.5">
            <MapPin strokeWidth={2} size={20} color="#2b7fff" />
            <p
              className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
            >
              Pick-up location
            </p>
          </div>
          <input
            type="text"
            placeholder="Select City"
            className={`w-full outline-none bg-transparent ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          />
        </div>
        <div className="w-full lg:w-auto">
          <div className="flex items-center space-x-1 mb-2.5">
            <Calendar strokeWidth={2} size={20} color="#2b7fff" />
            <p
              className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
            >
              Pick-up Date
            </p>
          </div>
          <input
            type="Date"
            className={`w-full outline-none bg-transparent ${theme === "dark" ? "text-white" : "text-gray-500"}`}
          />
        </div>
        <div className="w-full lg:w-auto">
          <div className="flex items-center space-x-1 mb-2.5">
            <CalendarArrowDown strokeWidth={2} size={20} color="#2b7fff" />
            <p
              className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
            >
              Return Date
            </p>
          </div>
          <input
            type="Date"
            className={`w-full outline-none bg-transparent ${theme === "dark" ? "text-white" : "text-gray-500"}`}
          />
        </div>
        <div className="w-full lg:w-auto">
          <button className="w-full lg:w-auto bg-blue-600 px-8 py-2 rounded-md text-white cursor-pointer hover:bg-blue-700 transition-colors">
            Find Your Car
          </button>
        </div>
      </div>
      {/*Our featured Car */}
      <div
        className={`px-6 md:px-16 my-8 py-10 transition-colors ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}
      >
        <h1
          className={`text-3xl font-bold py-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
        >
          Our Featured Fleet
        </h1>
        <div className="flex flex-col md:flex-row justify-between mb-5 lg:mb-0">
          <p
            className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"} pb-5`}
          >
            choose from our selection of premium and exotic Vehicles.
          </p>
          <Link to={"/cars"}>
            <div className="flex items-center space-x-1">
              <div className="text-blue-600">View car</div>
              <div>
                <ArrowRight size={18} color="#1781ec" />
              </div>
            </div>
          </Link>
        </div>
        <LandingCars />
      </div>
      {/*why choose CarRental */}
      <div className="mx-6 md:mx-18 pb-8">
        <h1
          className={`text-xl font-bold flex justify-center text-center ${theme === "dark" ? "text-white" : "text-slate-900"}`}
        >
          Why Choose CarRental ?
        </h1>
        <p
          className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"} flex justify-center text-center`}
        >
          We provide the best rental experience with premium benefits 24/7
          support.
        </p>
        <div className="flex flex-col md:flex-row justify-between space-y-10 md:space-y-0 md:space-x-10 items-center py-10">
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-2xl flex justify-center items-center mb-3.5 ${theme === "dark" ? "bg-blue-900/30" : "bg-[#e0edfa]"}`}
            >
              <TicketPlus color="#137fec" />
            </div>
            <h1
              className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              Best Price Guarantee
            </h1>
            <p
              className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
            >
              Find a lower price elsewhere and we'll beat it by 10%. No hidden
              fees, ever.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-2xl flex justify-center items-center mb-3.5 ${theme === "dark" ? "bg-blue-900/30" : "bg-[#e0edfa]"}`}
            >
              <Headset color="#137fec" />
            </div>
            <h1
              className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              24/7 Roadside Assist
            </h1>
            <p
              className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
            >
              Drive with peace of mind knowing our support team is just one call
              away, anytime.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-2xl flex justify-center items-center mb-3.5 ${theme === "dark" ? "bg-blue-900/30" : "bg-[#e0edfa]"}`}
            >
              <X color="#137fec" />
            </div>
            <h1
              className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              Free cancellation
            </h1>
            <p
              className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
            >
              Plan changed ? Cancel your booking up to 24 hours before pick-up
              for a full refund.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-6 md:mx-18 bg-[#137fec] px-6 md:px-10 py-10 lg:space-x-28 rounded-2xl flex flex-col lg:flex-row mb-10 shadow-xl shadow-blue-500/20">
        <div className="flex flex-col justify-center lg:ml-10 mb-8 lg:mb-0">
          <h1 className="text-white font-bold text-3xl md:text-5xl">
            Ready to hit the road?
          </h1>
          <p className="text-gray-200 py-2.5">
            Join thousands of happy travels who trust CarRental for their
            adventures
          </p>
          <div className="flex space-x-5 mt-5">
            <Link to={"/register"}>
              <button className="px-8 py-2 rounded-md bg-white text-blue-600 font-bold active:scale-95 transition-transform">
                Join Us
              </button>
            </Link>
            <Link to={"/contacts"}>
              <button className="px-8 border py-2 rounded-md text-white font-bold active:scale-95 transition-transform">
                Contacts Us
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full">
          <img
            src="https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Punch/13254/1768985724266/rear-view-119.jpg"
            className="w-full lg:w-140 h-64 md:h-90 rounded-2xl object-cover"
            alt="Car image"
          />
        </div>
      </div>
      {/*Footer*/}
      <div className="bg-black text-white flex flex-col md:flex-row justify-between px-6 md:px-28 py-10 space-y-10 md:space-y-0">
        <div>
          <div className="flex items-center space-x-1">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <CarFront color="white" />
            </div>
            <p className="font-bold text-xl">CarRental</p>
          </div>
          <p className="w-full md:w-80 mt-4.5 text-gray-500">
            The premier choice for luxury and premium car rentals worldwide.
            Making every journey a memory worth Keeping.
          </p>
          <p className="text-gray-500 mt-2">
            © {new Date().getFullYear()} CarRentals. All rights reserved.
          </p>
        </div>

        <div>
          <h1 className="font-bold">Quick Links</h1>
          <ul className="mt-4.5">
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer transition-colors">
              cars
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer transition-colors">
              Special Offers
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer transition-colors">
              RentalLocations
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer transition-colors">
              Career
            </li>
          </ul>
        </div>

        <div>
          <h1 className="font-bold">Support</h1>
          <ul className="mt-4.5">
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer transition-colors">
              Help Center
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer transition-colors">
              Cookie Policy
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
