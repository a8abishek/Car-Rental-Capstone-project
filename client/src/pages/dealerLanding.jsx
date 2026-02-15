import react from "react";
import { CircleStar, MapPin, Calendar, CalendarArrowDown } from "lucide-react";
// import
import Navbar from "../components/Navbar";

function DriveEliteLanding() {
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
          <input
            type="Date" 
            className="outline-none text-gray-500"
          />
        </div>
        <div>
          <div className="flex items-center space-x-1 mb-2.5">
            <CalendarArrowDown strokeWidth={2} size={20} color="#2b7fff" />
            <p className="text-gray-500">Return Date</p>
          </div>
          <input
            type="Date"
            className="outline-none text-gray-500"
          />
        </div>
        <div>
          <button className="bg-blue-600 px-8 py-2 rounded-md text-white cursor-pointer ">
            Find Your Car
          </button>
        </div>
      </div>
      {/*Our featyred Car */}
      
    </div>
  );
}

export default DriveEliteLanding;
