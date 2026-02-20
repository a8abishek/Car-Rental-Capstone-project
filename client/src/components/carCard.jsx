import {
  Settings,
  Users,
  Zap,
  IndianRupee,
  Fuel,
  EvCharger,
} from "lucide-react";

function CarCard ({ car }) {
  const fuelType = car.carRunning?.toLowerCase();

  const renderFuelIcon = () => {
    if (fuelType === "petrol" || fuelType === "diesel") {
      return <Fuel color="#1781ec"  />;
    } else if (fuelType === "electric") {
      return <Zap color="#1781ec" />;
    } else if (fuelType === "hybrid") {
      return <EvCharger color="#1781ec" />;
    }
  };

  return (
    <div className="w-100 rounded-2xl h-115 border border-gray-300 bg-[#f8fafc]">
      <div>
        <img
          className="h-60 w-full rounded-t-2xl"
          src={car.carImage}
          alt={car.carName}
        />
      </div>
      <div className="flex justify-between mt-2 px-5 items-center">
        <div>
          <h1 className="font-bold text-xl">{car.carName}</h1>
          <span className="text-gray-500">{car.carRunning}</span>
        </div>
        <div>
          <span className="flex items-center text-[#1781ec] font-bold text-md">
            <IndianRupee color="#1781ec" size={18} />
            {car.pricePerDay}
          </span>
          <p className="text-gray-500">/day</p>
        </div>
      </div>

      <div className="flex justify-between mx-5 border-y border-gray-200 my-3 py-2 ">
        <div className="flex flex-col items-center">
          <Settings color="#1781ec" />
          <span className="text-gray-500">{car.transmission}</span>
        </div>
        <div className="flex flex-col items-center">
          <Users color="#1781ec" />
          <span className="text-gray-500">{car.seatingCapacity}</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{renderFuelIcon()}</span>
          <span className="capitalize text-gray-500">{car.carRunning}</span>
        </div>
      </div>
      <div className="mx-5 mt-4">
        <button className="bg-black text-white font- w-full bold py-1.5 rounded-md">Rent Now</button>
      </div>
    </div>
  );
};

export default CarCard;
