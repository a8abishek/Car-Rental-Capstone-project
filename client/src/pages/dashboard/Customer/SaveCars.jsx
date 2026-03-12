import { useEffect, useState } from "react";
import { apiFetch } from "../../../api/apiFetch";
import CarCards from "../../../components/CarCards";
import { Car, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

function SaveCars() {
  const [savedCars, setSavedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Added theme state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

  // Logic to monitor theme changes instantly
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

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await apiFetch("/api/users/saved-cars");
        setSavedCars(Array.isArray(data) ? data.filter((c) => c !== null) : []);
      } catch (error) {
        console.error("Error fetching saved cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  // Pagination Logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = savedCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(savedCars.length / carsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div
        className={`min-h-[60vh] flex flex-col items-center justify-center gap-4 transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a]" : ""}`}
      >
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p
          className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} font-medium`}
        >
          Loading your collection...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-transparent text-slate-900"}`}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2
              className={`text-4xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              Saved <span className="text-blue-600">Cars</span>
            </h2>
            <p
              className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} mt-1 font-medium`}
            >
              Showing {indexOfFirstCar + 1}-
              {Math.min(indexOfLastCar, savedCars.length)} of {savedCars.length}{" "}
              vehicles
            </p>
          </div>

          <button
            onClick={() => navigate("/cars")}
            className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-2xl font-bold transition-all shadow-sm active:scale-95 ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ArrowLeft size={18} />
            Back to Fleet
          </button>
        </div>

        {/* Main Content */}
        {savedCars.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center py-20 px-4 rounded-4xl border shadow-sm text-center transition-colors ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100"
            }`}
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"}`}
            >
              <Car size={40} className="text-blue-500 opacity-50" />
            </div>
            <h3
              className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-800"}`}
            >
              Your wishlist is empty
            </h3>
            <button
              onClick={() => navigate("/cars")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95"
            >
              Explore Cars
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {currentCars.map((car) => (
                <div
                  key={car._id}
                  className="hover:-translate-y-2 transition-transform duration-300"
                >
                  <CarCards
                    car={car}
                    isInitiallySaved={true}
                    userRole="customer"
                  />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                  className={`p-2 rounded-xl border transition-colors disabled:opacity-30 ${
                    theme === "dark"
                      ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : theme === "dark"
                          ? "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                  className={`p-2 rounded-xl border transition-colors disabled:opacity-30 ${
                    theme === "dark"
                      ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SaveCars;
