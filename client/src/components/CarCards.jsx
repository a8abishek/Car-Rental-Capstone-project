import {
  Settings,
  Users,
  Zap,
  IndianRupee,
  Fuel,
  EvCharger,
  Star
} from "lucide-react";
import { useNavigate } from "react-router";   // ✅ ADD THIS

const CarCards = ({ car }) => {
  const navigate = useNavigate();   // ✅ ADD THIS

  const fuelType = car.carRunning?.toLowerCase();

  const renderFuelIcon = () => {
    if (fuelType === "petrol" || fuelType === "diesel") {
      return <Fuel className="text-blue-500" size={20} />;
    } else if (fuelType === "electric") {
      return <Zap className="text-blue-500" size={20} />;
    } else if (fuelType === "hybrid") {
      return <EvCharger className="text-blue-500" size={20} />;
    }
    return <Fuel className="text-blue-500" size={20} />;
  };

  return (
    <div
      onClick={() => navigate(`/cars/${car._id}`)}   // ✅ CLICK NAVIGATION
      className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group max-w-sm"
    >
      {/* Image Section */}
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

        <span className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
          {car.carType || "Luxury"}
        </span>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-slate-800 leading-tight truncate">
              {car.carName}
            </h3>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="flex items-baseline text-blue-600">
              <IndianRupee size={16} strokeWidth={3} className="mr-0.5" />
              <span className="font-extrabold text-xl tracking-tight">
                {car.pricePerDay}
              </span>
              <span className="text-gray-500 text-sm font-semibold ml-1">
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
            <span className="text-[11px] font-bold text-slate-600 capitalize">
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
            e.stopPropagation();   // ✅ Prevent double click issue
            navigate(`/cars/${car._id}`);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default CarCards;
