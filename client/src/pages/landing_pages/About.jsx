import React from "react";
import {
  Eye,
  Heart,
  ArrowRight,
  TicketPlus,
  Headset,
  X,
  CarFront,
} from "lucide-react";
// import
import Navbar from "../../components/Navbar";

function About() {
  return (
    <div>
      <Navbar />
      <div className="bg-[#f9fafb] px-10 py-20 flex space-x-10">
        <div className="flex flex-col justify-center">
          <h1 className="text-7xl font-bold w-160 tracking-wide">
            Redefining the{" "}
            <span className="text-blue-600">Car Rental Experience</span>
          </h1>
          <p className="text-gray-500 w-150 mt-5 tracking-wide">
            we're more than just a rental service.We're your gateway to premium
            mobility,combing a world-class fleet with unparalleled customer
            Services.
          </p>
          <button className="px-8 py-2.5 border rounded-md font-bold w-40 text-blue-600 cursor-pointer mt-10">
            Explore Cars
          </button>
        </div>
        <div>
          <img
            src="https://i.pinimg.com/736x/c8/bb/ae/c8bbaee908c2bedf845b674888fa6d36.jpg"
            alt=""
            className="rounded-2xl h-110"
          />
        </div>
      </div>
      {/*about us */}
      <div className="px-10 py-10 bg-[#f9fafb] shadow flex space-x-10 ">
        <div>
          <span className="text-4xl text-blue-600 font-semibold">
            OUR MISSION
          </span>
          <h1 className="text-4xl font-bold w-160 my-3">
            Redefining mobility by providing accessible, reliable, and premium
            car rental experiences for every journey.
          </h1>

          <div className="flex space-x-3.5 bg-white p-4 rounded-2xl">
            <div className=" bg-blue-300 w-12 h-12 flex justify-center items-center rounded-xl">
              <Eye color="blue" />
            </div>
            <div>
              <h1 className="font-bold">Our Vision</h1>
              <p className="text-gray-500 w-100">
                To become the world's most customer-center car rental
                platform,leveraging technology to simplify travel for everyone.
              </p>
            </div>
          </div>

          <div className="flex space-x-3.5 bg-white p-4 my-4 rounded-2xl">
            <div className=" bg-blue-300 w-12 h-12 flex justify-center items-center rounded-xl">
              <Heart color="blue" />
            </div>
            <div>
              <h1 className="font-bold">Our Values</h1>
              <p className="text-gray-500 w-100">
                Integrity, transparency, and service excellence are at the heart
                of everything we do, every single day.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <img
            src="https://i.pinimg.com/736x/1b/3f/ad/1b3fad548ea401cd660ff8da9783bf86.jpg"
            alt="image"
            className="rounded-xl w-180"
          />
        </div>
      </div>
      {/*our growth */}
      <div className="bg-[#eaf1f7] py-10">
        <h1 className="text-3xl font-bold flex justify-center">
          Our Growth Story
        </h1>
        <div className="py-10 px-[10%] ">
          <div className="flex space-x-50 items-center">
            <div>
              <span className="text-blue-600 font-extrabold flex justify-end">
                2012
              </span>
              <p className="text-gray-500 w-100">
                Founded with a small fleet of 10 cars in London, focused on
                local commuters.
              </p>
            </div>
            <div>
              <ArrowRight size={50} color="blue" />
            </div>
            <div>
              <h1 className="font-bold text-2xl">The Humble Beginning</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-50 px-[10%] my-10">
          <div>
            <span className="font-extrabold  text-blue-600 flex justify-end">
              Digital Transformation
            </span>
            <p className="text-gray-500 w-100">
              Launched our first mobile booking platform, reaching over 50,000
              customer
            </p>
          </div>
          <div>
            <ArrowRight size={50} color="blue" />
          </div>
          <div>
            <h1 className="font-bold text-2xl">2016</h1>
          </div>
        </div>

        <div className="flex items-center space-x-50 px-[10%] my-10">
          <div>
            <span className="text-blue-600 font-extrabold flex justify-end">
              Present
            </span>
            <p className="text-gray-500 w-100">
              Operating in 15 countries with a diverse fleet of over 5000
              premium vehicles
            </p>
          </div>
          <div>
            <ArrowRight size={50} color="blue" />
          </div>
          <div>
            <h1 className="font-bold text-2xl">Global Mobility Leader</h1>
          </div>
        </div>
      </div>
      {/*why choose CarRental */}
      <div className="px-18 py-8 bg-[#f9fafb]">
        <h1 className="text-xl font-bold flex justify-center">
          Why Choose CarRental ?
        </h1>
        <p className="text-gray-500 flex justify-center">
          We provide the best rental experience with premium benefits 24/7
          support.
        </p>
        <div className="flex justify-between space-x-10 items-center py-10">
          <div className="flex flex-col items-center bg-white p-10 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#e0edfa] flex justify-center items-center mb-3.5">
              <TicketPlus color="#137fec" />
            </div>
            <h1 className="text-xl font-bold">Best Price Guarantee</h1>
            <p className="text-gray-500 text-center">
              Find a lower price elsewhere and we'll beat it by 10%.No hidden
              fees,ever.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white p-10 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#e0edfa] flex justify-center items-center mb-3.5">
              <Headset color="#137fec" />
            </div>
            <h1 className="text-xl font-bold">24/7 Roasside Assist</h1>
            <p className="text-gray-500 text-center">
              Drive with peace of mind knowing our support team is just one call
              away,anytime.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white p-10 rounded-2xl">
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

export default About;
