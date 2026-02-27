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
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  // Filter States
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [transmission, setTransmission] = useState([]);
  const [carType, setCarType] = useState([]);
  const [fuelType, setFuelType] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. THEME SYNC LOGIC
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

    if (search.trim() !== "") {
      updated = updated.filter(
        (car) =>
          car.carName.toLowerCase().includes(search.toLowerCase()) ||
          car.brand.toLowerCase().includes(search.toLowerCase()),
      );
    }

    updated = updated.filter((car) => {
      const price = car.pricePerDay;
      return price >= minPrice && price <= maxPrice;
    });

    if (selectedRatings.length > 0) {
      updated = updated.filter((car) => {
        const rating = Math.floor(car.rating || 0);
        return selectedRatings.includes(rating.toString());
      });
    }

    if (transmission.length > 0) {
      updated = updated.filter((car) =>
        transmission.includes(car.transmission.toLowerCase()),
      );
    }

    if (carType.length > 0) {
      updated = updated.filter((car) =>
        carType.includes(car.carType.toLowerCase()),
      );
    }

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a]" : "bg-[#F8FAFC]"}`}
    >
      <Navbar />
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <header className="mb-10">
          <h2
            className={`text-4xl font-extrabold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Browse Our Fleet
          </h2>
          <p
            className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} mt-2`}
          >
            Discover the perfect vehicle for your next adventure.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-80 shrink-0">
            <div
              className={`p-6 rounded-2xl shadow-sm border sticky top-24 transition-colors ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <h3
                  className={`font-bold text-xl ${theme === "dark" ? "text-white" : "text-slate-800"}`}
                >
                  Filters
                </h3>
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
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl outline-none border transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/50"
                      : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500"
                  }`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* PRICE FILTER */}
              <div
                className={`mb-8 border-b pb-8 ${theme === "dark" ? "border-slate-800" : "border-slate-100"}`}
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Price Range
                </p>
                <div className="space-y-6">
                  <div
                    className={`relative h-1 w-full rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}
                  >
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
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">
                        Min
                      </label>
                      <div
                        className={`border rounded-lg px-2 py-1 text-sm font-semibold ${theme === "dark" ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-700"}`}
                      >
                        ₹{minPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-slate-300 mt-4">to</div>
                    <div className="flex-1 text-right">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">
                        Max
                      </label>
                      <div
                        className={`border rounded-lg px-2 py-1 text-sm font-semibold ${theme === "dark" ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-700"}`}
                      >
                        ₹{maxPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkbox Groups Styling */}
              {[
                {
                  label: "Rating",
                  options: ["5", "4", "3"],
                  state: selectedRatings,
                  setter: setSelectedRatings,
                  suffix: " Stars",
                },
                {
                  label: "Category",
                  options: ["Mid-size", "Standard", "Premium", "Luxury"],
                  state: carType,
                  setter: setCarType,
                },
                {
                  label: "Transmission",
                  options: ["Automatic", "Manual"],
                  state: transmission,
                  setter: setTransmission,
                },
                {
                  label: "Fuel Type",
                  options: ["Petrol", "Diesel", "Electric", "Hybrid"],
                  state: fuelType,
                  setter: setFuelType,
                },
              ].map((group, idx, arr) => (
                <div
                  key={group.label}
                  className={`mb-8 ${idx !== arr.length - 1 ? "border-b pb-8" : ""} ${theme === "dark" ? "border-slate-800" : "border-slate-100"}`}
                >
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                    {group.label}
                  </p>
                  <div className="space-y-4">
                    {group.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={group.state.includes(opt.toLowerCase())}
                          onChange={() =>
                            handleCheckbox(opt, group.state, group.setter)
                          }
                          className={`w-5 h-5 rounded focus:ring-blue-500 ${theme === "dark" ? "bg-slate-800 border-slate-700 text-blue-600" : "border-slate-300 text-blue-600"}`}
                        />
                        <span
                          className={`ml-3 font-medium transition-colors ${theme === "dark" ? "text-slate-300 group-hover:text-blue-400" : "text-slate-600 group-hover:text-blue-600"}`}
                        >
                          {opt}
                          {group.suffix || ""}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8 px-2">
              <p
                className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} font-medium`}
              >
                Showing{" "}
                <span
                  className={`${theme === "dark" ? "text-white" : "text-slate-900"} font-bold`}
                >
                  {filteredCars.length}
                </span>{" "}
                vehicles
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentCars.length > 0 ? (
                currentCars.map((car) => <CarCards key={car._id} car={car} />)
              ) : (
                <div
                  className={`col-span-full py-24 rounded-3xl text-center border-2 border-dashed ${
                    theme === "dark"
                      ? "bg-slate-900/50 border-slate-800"
                      : "bg-white border-slate-200"
                  }`}
                >
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
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all disabled:opacity-40 ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-blue-400"
                      : "bg-white border-slate-200 text-slate-600 hover:text-blue-600"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPage(index + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white shadow-lg"
                        : theme === "dark"
                          ? "bg-slate-800 text-slate-300 border border-slate-700 hover:border-blue-500"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-blue-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all disabled:opacity-40 ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-blue-400"
                      : "bg-white border-slate-200 text-slate-600 hover:text-blue-600"
                  }`}
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
