import {
  Settings,
  Users,
  Zap,
  IndianRupee,
  Fuel,
  EvCharger,
  Star,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../api/apiFetch";

function CarCards({ car, isInitiallySaved }) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [loading, setLoading] = useState(false);

  // Get the role directly from localStorage
  const userRole = localStorage.getItem("role"); // 'customer', 'dealer', or 'admin'
  const token = localStorage.getItem("token");

  const fuelType = car.carRunning?.toLowerCase();

  // Update heart state if the car prop changes (important for the Dashboard)
  useEffect(() => {
    setIsSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    if (!token) {
      alert("Please login to save cars!");
      navigate("/login");
      return;
    }

    // Double check role logic
    if (userRole !== "customer") {
      alert("Only customer accounts can save cars to their profile.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/users/toggle-favorite", {
        method: "POST",
        body: JSON.stringify({ carId: car._id }),
      });
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Favorite Error:", error.message);
      alert("Could not update favorites.");
    } finally {
      setLoading(false);
    }
  };

  const renderFuelIcon = () => {
    const iconProps = { className: "text-blue-500", size: 18 };
    if (fuelType === "petrol" || fuelType === "diesel")
      return <Fuel {...iconProps} />;
    if (fuelType === "electric") return <Zap {...iconProps} />;
    if (fuelType === "hybrid") return <EvCharger {...iconProps} />;
    return <Fuel {...iconProps} />;
  };

  return (
    <div
      onClick={() => navigate(`/cars/${car._id}`)}
      className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group max-w-sm relative"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={car.carImage}
          alt={car.carName}
        />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-slate-700">
            {car.rating || "4.8"}
          </span>
        </div>

        {/* LOGIC: Only show the Heart button if the user is a CUSTOMER.
            If role is dealer/admin, they won't even see the button.
        */}
        {userRole === "customer" && (
          <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-all active:scale-90 z-10"
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${
                isSaved ? "fill-red-500 text-red-500" : "text-gray-400"
              } ${loading ? "opacity-30" : "opacity-100"}`}
            />
          </button>
        )}

        <span className="absolute bottom-3 left-3 bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
          {car.carType || "Luxury"}
        </span>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center gap-2 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-xl text-slate-800 leading-tight truncate">
              {car.carName}
            </h3>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="flex items-center text-blue-600">
              <IndianRupee size={16} strokeWidth={3} className="mr-0.5" />
              <span className="font-extrabold text-lg tracking-tight">
                {car.pricePerDay}
              </span>
              <span className="text-gray-500 text-xs font-semibold ml-1">
                /day
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-y border-gray-100 py-4 my-4 bg-gray-50/50 rounded-lg">
          <div className="flex flex-col items-center gap-1">
            <Users className="text-blue-500" size={18} />
            <span className="text-[11px] font-bold text-slate-600">
              {car.seatingCapacity} Seats
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-gray-200">
            <Settings className="text-blue-500" size={18} />
            <span className="text-[11px] font-bold text-slate-600 capitalize truncate w-full text-center px-1">
              {car.transmission}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            {renderFuelIcon()}
            <span className="text-[11px] font-bold text-slate-600 capitalize">
              {car.carRunning}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cars/${car._id}`);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default CarCards;
