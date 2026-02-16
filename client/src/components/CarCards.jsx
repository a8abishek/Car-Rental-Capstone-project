import {
  Settings,
  Users,
  Zap,
  IndianRupee,
  Fuel,
  EvCharger,
} from "lucide-react";

const CarCards = ({ car }) => {
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
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={car.carImage}
          alt={car.carName}
        />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm">
          {car.carType || "Luxury"}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-800 leading-tight">
              {car.carName}
            </h3>
            <p className="text-gray-400 text-sm capitalize">
              {car.carType} {car.carRunning}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end text-blue-600 font-extrabold text-xl">
              <IndianRupee size={16} strokeWidth={3} />
              <span>{car.pricePerDay}</span>
            </div>
            <p className="text-gray-400 text-xs">/day</p>
          </div>
        </div>

        {/* Specs Divider */}
        <div className="grid grid-cols-3 gap-2 border-y border-gray-50 py-4 my-4">
          <div className="flex flex-col items-center gap-1">
            <Users className="text-blue-500/80" size={18} />
            <span className="text-[11px] font-medium text-gray-500">
              {car.seatingCapacity} Seats
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-gray-50">
            <Settings className="text-blue-500/80" size={18} />
            <span className="text-[11px] font-medium text-gray-500 capitalize">
              {car.transmission}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            {renderFuelIcon()}
            <span className="text-[11px] font-medium text-gray-500 capitalize">
              {car.carRunning}
            </span>
          </div>
        </div>

        {/* Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-100">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default CarCards;
