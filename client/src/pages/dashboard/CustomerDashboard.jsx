import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../../api/apiFetch";
import {
  Car,
  Calendar,
  MapPin,
  TrendingUp,
} from "lucide-react";

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiFetch("/api/bookings/my-bookings");

        setBookings(data);

        const active = data.find(
          (b) => b.status === "confirmed"
        );

        setActiveBooking(active || null);

      } catch (err) {
        toast.error("Failed to load bookings");
      }
    };

    fetchBookings();
  }, []);

  const calculateProgress = () => {
    if (!activeBooking) return 0;

    const start = new Date(activeBooking.pickupDate);
    const end = new Date(activeBooking.dropDate);
    const now = new Date();

    const total = end - start;
    const passed = now - start;

    return Math.min(
      100,
      Math.max(0, Math.floor((passed / total) * 100))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-8">
        Welcome back 👋
      </h1>

      {/* ACTIVE RENTAL */}
      {activeBooking ? (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
          <h2 className="text-xl font-bold mb-4">
            Current Rental
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Car Image */}
            <div>
              <img
                src={activeBooking.car.carImage}
                alt={activeBooking.car.carName}
                className="rounded-xl h-40 object-cover w-full"
              />
            </div>

            {/* Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold">
                {activeBooking.car.carName}
              </h3>

              <p className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={14} />
                {new Date(
                  activeBooking.pickupDate
                ).toLocaleDateString()}
                {"  "} → {"  "}
                {new Date(
                  activeBooking.dropDate
                ).toLocaleDateString()}
              </p>

              <p className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={14} />
                {activeBooking.pickupLocation}
              </p>

              <p className="text-sm text-blue-600 font-bold">
                ₹{activeBooking.totalAmount}
              </p>
            </div>

            {/* Progress */}
            <div>
              <p className="text-sm font-medium mb-2">
                Rental Progress
              </p>

              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{
                    width: `${calculateProgress()}%`,
                  }}
                />
              </div>

              <p className="text-sm mt-2 text-gray-600">
                {calculateProgress()}% Completed
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
          <p className="text-gray-500">
            No active rental at the moment.
          </p>
        </div>
      )}

      {/* UPCOMING BOOKINGS */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">
          My Trips
        </h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500">
            No bookings yet.
          </p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="flex justify-between items-center border p-4 rounded-xl"
              >
                <div>
                  <p className="font-bold">
                    {booking.car.carName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.status}
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  ₹{booking.totalAmount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
