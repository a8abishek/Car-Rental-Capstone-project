import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
// import
import Navbar from "../../components/Navbar";
import { apiFetch } from "../../api/apiFetch";
import CarCards from "../../components/CarCards";

const Car = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  // Filter States
  const [search, setSearch] = useState("");

  // STYLE PRICE STATES
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);

  const [transmission, setTransmission] = useState([]);
  const [carType, setCarType] = useState([]);
  const [fuelType, setFuelType] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // FETCH DATA
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await apiFetch("/api/cars/approved");
        setCars(data);
        setFilteredCars(data);
      } catch (error) {
        toast.error("Failed to load cars");
      }
    };
    fetchCars();
  }, []);

  // Filter Logic
  useEffect(() => {
    let updated = [...cars];

    // Search Logic
    if (search.trim() !== "") {
      updated = updated.filter(
        (car) =>
          car.carName.toLowerCase().includes(search.toLowerCase()) ||
          car.brand.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Range Price Logic
    updated = updated.filter((car) => {
      const price = car.pricePerDay;
      return price >= minPrice && price <= maxPrice;
    });

    // Rating Logic
    if (selectedRatings.length > 0) {
      updated = updated.filter((car) => {
        const rating = Math.floor(car.rating || 0);
        return selectedRatings.includes(rating.toString());
      });
    }

    // Transmission Filter
    if (transmission.length > 0) {
      updated = updated.filter((car) =>
        transmission.includes(car.transmission.toLowerCase()),
      );
    }

    // Car Type Filter
    if (carType.length > 0) {
      updated = updated.filter((car) =>
        carType.includes(car.carType.toLowerCase()),
      );
    }

    // Fuel Type Filter
    if (fuelType.length > 0) {
      updated = updated.filter((car) =>
        fuelType.includes(car.carRunning.toLowerCase()),
      );
    }

    setFilteredCars(updated);
    setCurrentPage(1);
  }, [
    search,
    minPrice,
    maxPrice,
    transmission,
    carType,
    fuelType,
    selectedRatings,
    cars,
  ]);

  // HANDLERS
  const handleCheckbox = (value, state, setState) => {
    const lowerVal = value.toString().toLowerCase();
    if (state.includes(lowerVal)) {
      setState(state.filter((item) => item !== lowerVal));
    } else {
      setState([...state, lowerVal]);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setMinPrice(0);
    setMaxPrice(50000);
    setTransmission([]);
    setCarType([]);
    setFuelType([]);
    setSelectedRatings([]);
    setCurrentPage(1);
  };

  // PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <header className="mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900">
            Browse Our Fleet
          </h2>
          <p className="text-slate-500 mt-2">
            Discover the perfect vehicle for your next adventure.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-xl text-slate-800">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-blue-600 text-xs font-bold flex items-center gap-1 uppercase tracking-wider hover:text-blue-700"
                >
                  <RotateCcw size={14} /> RESET ALL
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-8">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search brand..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* PRICE FILTER */}
              <div className="mb-8 border-b border-slate-100 pb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Price Range
                </p>

                <div className="space-y-6">
                  {/* Visual Slider */}
                  <div className="relative h-1 w-full bg-slate-200 rounded-lg">
                    <div
                      className="absolute h-1 bg-blue-600 rounded-lg"
                      style={{
                        left: `${(minPrice / 50000) * 100}%`,
                        right: `${100 - (maxPrice / 50000) * 100}%`,
                      }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(
                          Math.min(Number(e.target.value), maxPrice - 500),
                        )
                      }
                      className="absolute w-full -top-1 h-1 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                    />
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(
                          Math.max(Number(e.target.value), minPrice + 500),
                        )
                      }
                      className="absolute w-full -top-1 h-1 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                    />
                  </div>

                  {/* Price Inputs Boxes */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">
                        Min
                      </label>
                      <div className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-700 font-semibold">
                        ₹{minPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-slate-300 mt-4">to</div>
                    <div className="flex-1 text-right">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">
                        Max
                      </label>
                      <div className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-700 font-semibold">
                        ₹{maxPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8 border-b border-slate-100 pb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Rating
                </p>
                <div className="space-y-4">
                  {["5", "4", "3"].map((star) => (
                    <label
                      key={star}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(star)}
                        onChange={() =>
                          handleCheckbox(
                            star,
                            selectedRatings,
                            setSelectedRatings,
                          )
                        }
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-slate-600 font-medium group-hover:text-blue-600 transition-colors">
                        {star} Stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-8 border-b border-slate-100 pb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Category
                </p>
                <div className="space-y-4">
                  {["Mid-size", "Standard", "Premium", "Luxury"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={carType.includes(type.toLowerCase())}
                        onChange={() =>
                          handleCheckbox(type, carType, setCarType)
                        }
                        className="w-5 h-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="ml-3 text-slate-600 font-medium group-hover:text-blue-600">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div className="mb-8 border-b border-slate-100 pb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Transmission
                </p>
                <div className="space-y-4 text-sm">
                  {["Automatic", "Manual"].map((trans) => (
                    <label
                      key={trans}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={transmission.includes(trans.toLowerCase())}
                        onChange={() =>
                          handleCheckbox(trans, transmission, setTransmission)
                        }
                        className="w-5 h-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="ml-3 text-slate-600 font-medium group-hover:text-blue-600">
                        {trans}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Fuel Type
                </p>
                <div className="space-y-4">
                  {["Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) => (
                    <label
                      key={fuel}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={fuelType.includes(fuel.toLowerCase())}
                        onChange={() =>
                          handleCheckbox(fuel, fuelType, setFuelType)
                        }
                        className="w-5 h-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="ml-3 text-slate-600 font-medium group-hover:text-blue-600">
                        {fuel}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8 px-2">
              <p className="text-slate-500 font-medium">
                Showing{" "}
                <span className="text-slate-900 font-bold">
                  {filteredCars.length}
                </span>{" "}
                vehicles
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentCars.length > 0 ? (
                currentCars.map((car) => <CarCards key={car._id} car={car} />)
              ) : (
                <div className="col-span-full bg-white py-24 rounded-3xl text-center border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 text-lg font-medium">
                    No vehicles found matching your criteria.
                  </p>
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:border-blue-500 hover:text-blue-600 shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-xl font-bold shadow-sm ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white shadow-blue-200"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-blue-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:border-blue-500 hover:text-blue-600 shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Car;
