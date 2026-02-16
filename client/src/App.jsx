import { Link } from "react-router";
import {
  CircleStar,
  MapPin,
  Calendar,
  CalendarArrowDown,
  ArrowRight,
  TicketPlus,
  Headset,
  X,
  CarFront,
} from "lucide-react";
// import
import Navbar from "./components/Navbar";
import LandingCars from "./pages/landing_pages/carFeatyure";

function App() {
  return (
    <div className="bg-gray-50">
      <Navbar />
      {/*Home section */}
      <div className="flex justify-between px-16 pt-10">
        {/*left side */}
        <div>
          <div className="flex mb-5 items-center space-x-1 bg-blue-200  text-blue-600 font-bold w-60 justify-center rounded-2xl">
            <CircleStar size={18} />
            <span>#Car Rental Service</span>
          </div>
          <h1 className="text-6xl font-bold w-[50%]">
            Drive Your Dream :{" "}
            <span className="text-blue-500">Premium Rentals</span>
          </h1>{" "}
          <br />
          <p className="text-gray-500 font-medium  w-[85%]">
            Experience luxury and comfort with our extensive fleet of high-end
            vehicles. From sleek sedans to rugged SUVs, we have the perfect ride
            for every journey.
          </p>
          <div className="flex space-x-1.5 mt-2">
            <div className="w-10 rounded-full">
              <img
                src="https://photodpshare.com/wp-content/uploads/2025/09/cute-cartoon-dp-smiling.jpeg"
                alt=""
                className="rounded-full"
              />
            </div>
            <div className="w-10 rounded-full">
              <img
                src="https://statusvibes.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fy3ko4alw%2Fproduction%2F627d04257228b6f6bdb3c232549987a510adebb1-1080x1080.jpg&w=3840&q=75"
                alt=""
                className="rounded-full"
              />
            </div>
            <div className="w-10 rounded-full">
              <img
                src="https://photodpshare.com/wp-content/uploads/2025/09/cute-cartoon-dp.jpeg"
                alt=""
                className="rounded-full"
              />
            </div>
            <div className="w-10 rounded-full">
              <img
                src="https://i.pinimg.com/236x/94/d8/a8/94d8a8e6ce1089c4918a5abd711af940.jpg"
                alt=""
                className="rounded-full"
              />
            </div>
          </div>
        </div>
        {/**image */}
        <div className="w-[85%] mt-3">
          <img
            src="https://images.turo.com/media/vehicle/images/cpq_uryfQjGnl5aZA3uBYw.jpg"
            alt=""
            className="w-full  rounded-2xl"
          />
        </div>
      </div>
      {/*Search*/}
      <div className="flex bg-white items-center justify-between mx-25 py-8 shadow mt-5 px-8 rounded-2xl">
        <div>
          {/*pickup location */}
          <div className="flex items-center space-x-1 mb-2.5">
            <MapPin strokeWidth={2} size={20} color="#2b7fff" />
            <p className="text-gray-500">Pick-up location</p>
          </div>
          <input
            type="text"
            placeholder="Select City"
            className="outline-none"
          />
        </div>
        <div>
          <div className="flex items-center space-x-1 mb-2.5">
            <Calendar strokeWidth={2} size={20} color="#2b7fff" />
            <p className="text-gray-500">Pick-up Date</p>
          </div>
          <input type="Date" className="outline-none text-gray-500" />
        </div>
        <div>
          <div className="flex items-center space-x-1 mb-2.5">
            <CalendarArrowDown strokeWidth={2} size={20} color="#2b7fff" />
            <p className="text-gray-500">Return Date</p>
          </div>
          <input type="Date" className="outline-none text-gray-500" />
        </div>
        <div>
          <button className="bg-blue-600 px-8 py-2 rounded-md text-white cursor-pointer ">
            Find Your Car
          </button>
        </div>
      </div>
      {/*Our featyred Car */}
      <div className="px-16 my-8 bg-white py-10">
        <h1 className="text-3xl font-bold py-1">Our Featured Fleet</h1>
        <div className="flex justify-between">
          <p className="text-gray-500 pb-5">
            choose from our selection of premium and exotic Vehicles.
          </p>
          <Link to={"/cars"}>
            <div className="flex items-center space-x-1">
              <div className="text-blue-600">View car</div>
              <div>
                <ArrowRight size={18} color="#1781ec" />
              </div>
            </div>
          </Link>
        </div>
        <LandingCars />
      </div>
      {/*why choose CarRental */}
      <div className="mx-18 pb-8">
        <h1 className="text-xl font-bold flex justify-center">
          Why Choose CarRental ?
        </h1>
        <p className="text-gray-500 flex justify-center">
          We provide the best rental experience with premium benefits 24/7
          support.
        </p>
        <div className="flex justify-between space-x-10 items-center py-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#e0edfa] flex justify-center items-center mb-3.5">
              <TicketPlus color="#137fec" />
            </div>
            <h1 className="text-xl font-bold">Best Price Guarantee</h1>
            <p className="text-gray-500 text-center">
              Find a lower price elsewhere and we'll beat it by 10%.No hidden
              fees,ever.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#e0edfa] flex justify-center items-center mb-3.5">
              <Headset color="#137fec" />
            </div>
            <h1 className="text-xl font-bold">24/7 Roasside Assist</h1>
            <p className="text-gray-500 text-center">
              Drive with peace of mind knowing our support team is just one call
              away,anytime.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#e0edfa] flex justify-center items-center mb-3.5">
              <X color="#137fec" />
            </div>
            <h1 className="text-xl font-bold">Free cancellation</h1>
            <p className="text-gray-500 text-center">
              Plan changed ? Cancel your booking up to 24 hours before pick-up
              for a full refund.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-18 bg-[#137fec] px-10 py-10  space-x-28 rounded-2xl flex mb-10">
        <div className="flex flex-col justify-center ml-10">
          <h1 className="text-white font-bold text-5xl">
            Ready to hit the road?
          </h1>
          <p className="text-gray-200 py-2.5">
            Join thousands of happy travels who trust CarRental for their
            adventures
          </p>
          <div className="flex space-x-5 mt-5">
            <Link to={"/register"}>
              <button className="px-8 py-2 rounded-md bg-white text-blue-600 font-bold">
                Join Us
              </button>
            </Link>
            <Link to={"/contacts"}>
              <button className="px-8 border py-2 rounded-md text-white font-bold">
                Contacts Us
              </button>
            </Link>
          </div>
        </div>
        <div>
          <img
            src="https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Punch/13254/1768985724266/rear-view-119.jpg"
            className="w-140 h-90 rounded-2xl "
            alt="Car image"
          />
        </div>
      </div>
      {/*Footer*/}
      <div className="bg-black text-white flex justify-between px-28 py-10">
        <div>
          <div className="flex items-center space-x-1">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <CarFront color="white" />
            </div>
            <p className="font-bold text-xl">CarRental</p>
          </div>
          <p className="w-80 mt-4.5 text-gray-500">
            The premier choice for luxury and premium car rentals
            worldwide.Making every journey a memory worth Keeping.
          </p>
          <p className="text-gray-500 mt-2">
            © {new Date().getFullYear()} CarRentals. All rights reserved.
          </p>
        </div>

        <div>
          <h1 className="font-bold">Quick Links</h1>
          <ul className="mt-4.5">
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer">
              cars
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer">
              Special Offers
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer">
              RentalLocations
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer">
              Career
            </li>
          </ul>
        </div>

        <div>
          <h1 className="font-bold">Support</h1>
          <ul className="mt-4.5">
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer">
              Help Center
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer">
              Privacy Policy
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer">
              Terms of Service
            </li>
            <li className="text-gray-500 py-1 hover:text-white cursor-pointer">
              Cookie Policy
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
