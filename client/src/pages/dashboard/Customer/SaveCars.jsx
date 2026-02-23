import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/apiFetch";
import CarCards from "../../../components/CarCards";
import { Heart, Car, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

function SaveCars() {
  const [savedCars, setSavedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading your collection...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Saved <span className="text-blue-600">Cars</span>
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Showing {indexOfFirstCar + 1}-
            {Math.min(indexOfLastCar, savedCars.length)} of {savedCars.length}{" "}
            vehicles
          </p>
        </div>

        <button
          onClick={() => navigate("/cars")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={18} />
          Back to Fleet
        </button>
      </div>

      {/* Main Content */}
      {savedCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-[32px] border border-slate-100 shadow-sm text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Car size={40} className="text-blue-500 opacity-50" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            Your wishlist is empty
          </h3>
          <button
            onClick={() => navigate("/cars")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all"
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
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
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
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SaveCars;
