import { useEffect, useState } from "react";
import toast from "react-hot-toast";
//import
import { apiFetch } from "../../api/apiFetch.js";
import CarCard from "../../components/carCard.jsx";
const LandingCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await apiFetch("/api/cars/approved");

        //Show only first 3 cars
        setCars(data.slice(0, 3));
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading cars...</p>;
  }

  return (
    <div className="flex justify-between">
      {cars.map((car) => (
        <CarCard key={car._id} car={car} />
      ))}
    </div>
  );
};

export default LandingCars;
