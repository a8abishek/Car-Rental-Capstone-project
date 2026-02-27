import { useEffect, useState } from "react";
import {
  Settings,
  Users,
  Zap,
  IndianRupee,
  Fuel,
  EvCharger,
} from "lucide-react";
import { useNavigate } from "react-router";

function CarCard({ car }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const fuelType = car.carRunning?.toLowerCase();

  //theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  const renderFuelIcon = () => {
    if (fuelType === "petrol" || fuelType === "diesel") {
      return <Fuel color="#1781ec" />;
    } else if (fuelType === "electric") {
      return <Zap color="#1781ec" />;
    } else if (fuelType === "hybrid") {
      return <EvCharger color="#1781ec" />;
    }
  };

  return (
    <div
      onClick={() => navigate(`/cars/${car._id}`)}
      className={`w-100 rounded-2xl h-115 border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
        theme === "dark"
          ? "bg-slate-800 border-slate-700 text-white"
          : "bg-[#f8fafc] border-gray-300 text-slate-900"
      }`}
    >
      <div>
        <img
          className="h-60 w-full rounded-t-2xl object-cover"
          src={car.carImage}
          alt={car.carName}
        />
      </div>
      <div className="flex justify-between mt-2 px-5 items-center">
        <div>
          <h1 className="font-bold text-xl">{car.carName}</h1>
          <span
            className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
          >
            {car.carRunning}
          </span>
        </div>
        <div>
          <span className="flex items-center text-[#1781ec] font-bold text-md">
            <IndianRupee color="#1781ec" size={18} />
            {car.pricePerDay}
          </span>
          <p
            className={`text-right ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
          >
            /day
          </p>
        </div>
      </div>

      <div
        className={`flex justify-between mx-5 border-y my-3 py-2 ${
          theme === "dark" ? "border-slate-700" : "border-gray-200"
        }`}
      >
        <div className="flex flex-col items-center">
          <Settings color="#1781ec" />
          <span
            className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
          >
            {car.transmission}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <Users color="#1781ec" />
          <span
            className={`${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
          >
            {car.seatingCapacity}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span>{renderFuelIcon()}</span>
          <span
            className={`capitalize ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
          >
            {car.carRunning}
          </span>
        </div>
      </div>
      <div className="mx-5 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cars/${car._id}`);
          }}
          className={`font-bold w-full py-1.5 rounded-md transition-colors ${
            theme === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Rent Now
        </button>
      </div>
    </div>
  );
}

export default CarCard;
