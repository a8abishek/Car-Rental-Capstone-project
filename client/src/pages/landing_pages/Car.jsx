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
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
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

    // Price Logic
    if (selectedPriceRanges.length > 0) {
      updated = updated.filter((car) => {
        const price = car.pricePerDay;
        return selectedPriceRanges.some((range) => {
          if (range === "0-2000") return price <= 2000;
          if (range === "2000-5000") return price > 2000 && price <= 5000;
          if (range === "5000+") return price > 5000;
          return false;
        });
      });
    }

    // Rating Logic (New)
    if (selectedRatings.length > 0) {
      updated = updated.filter((car) => {
        const rating = Math.floor(car.rating || 0); // Round down to match star level
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
    selectedPriceRanges,
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
    setSelectedPriceRanges([]);
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
      <div className="max-w-360 mx-auto px-4 sm:px-8 lg:px-12 py-10">
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

              {/* Price Range */}
              <div className="mb-8 border-b border-slate-100 pb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Price Range
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Under ₹2,000", value: "0-2000" },
                    { label: "₹2,000 - ₹5,000", value: "2000-5000" },
                    { label: "Above ₹5,000", value: "5000+" },
                  ].map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(range.value)}
                        onChange={() =>
                          handleCheckbox(
                            range.value,
                            selectedPriceRanges,
                            setSelectedPriceRanges,
                          )
                        }
                        className="w-5 h-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="ml-3 text-slate-600 font-medium group-hover:text-blue-600">
                        {range.label}
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
