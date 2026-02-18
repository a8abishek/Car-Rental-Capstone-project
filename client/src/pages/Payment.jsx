import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
// import
import { apiFetch } from '../api/apiFetch'

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { car, bookingType, formData, daysCount, totalAmount } =
    location.state || {};

  const [method, setMethod] = useState("card");

  if (!car) {
    return <div className="p-20">Invalid Access</div>;
  }

  const handleConfirmPayment = async () => {
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          carId: car._id,
          bookingType,
          pickupLocation: formData.pickupLocation,
          dropLocation: formData.dropLocation,
          pickupDate: formData.pickupDate,
          dropDate: formData.dropDate,
          drivingLicense:
            bookingType === "self"
              ? formData.drivingLicense
              : undefined,
        }),
      });

      toast.success("Payment Successful & Booking Created!");
      navigate("/dashboard");

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

        {/* LEFT - Booking Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

          <img
            src={car.carImage}
            className="rounded-xl mb-4"
            alt={car.carName}
          />

          <h3 className="font-bold text-lg">{car.carName}</h3>

          <p className="text-sm text-gray-500">
            {formData.pickupLocation} → {formData.dropLocation}
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <p>Days: {daysCount}</p>
            <p>Daily Rate: ₹{car.pricePerDay}</p>
            {bookingType === "driver" && (
              <p>Driver Included</p>
            )}
          </div>

          <div className="mt-6 border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-blue-600">₹{totalAmount}</span>
          </div>
        </div>

        {/* RIGHT - Payment Section */}
        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-md">

          <h2 className="text-2xl font-bold mb-6">
            Payment Method
          </h2>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMethod("card")}
              className={`px-6 py-3 rounded-xl font-bold ${
                method === "card"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Card
            </button>

            <button
              onClick={() => setMethod("paypal")}
              className={`px-6 py-3 rounded-xl font-bold ${
                method === "paypal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              PayPal
            </button>
          </div>

          {method === "card" && (
            <div className="space-y-4">
              <input
                placeholder="Cardholder Name"
                className="w-full border p-3 rounded-lg"
              />
              <input
                placeholder="Card Number"
                className="w-full border p-3 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="MM/YY"
                  className="border p-3 rounded-lg"
                />
                <input
                  placeholder="CVV"
                  className="border p-3 rounded-lg"
                />
              </div>
            </div>
          )}

          {method === "paypal" && (
            <div className="p-6 bg-gray-50 rounded-lg">
              Pay with PayPal account
            </div>
          )}

          <button
            onClick={handleConfirmPayment}
            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg"
          >
            Confirm & Pay ₹{totalAmount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
