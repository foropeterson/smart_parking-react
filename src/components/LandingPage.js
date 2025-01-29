import React from "react";
import { Link } from "react-router-dom";
import Buttons from "../utils/Buttons";
import { motion } from "framer-motion";
import { useMyContext } from "../store/ContextApi";

const fadeInFromTop = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
const fadeInFromBotom = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LandingPage = () => {
  const { token } = useMyContext();

  return (
    <div className="min-h-[calc(100vh-74px)] flex flex-col items-center">
      <div className="lg:w-[80%] w-full py-16 space-y-8">
        <motion.h1
          className="font-montserrat text-headerColor xl:text-5xl md:text-4xl text-3xl mx-auto text-center font-bold"
          initial="hidden"
          animate="visible"
          variants={fadeInFromTop}
        >
          Find, Book, and Park with Ease
        </motion.h1>
        <p className="text-slate-700 text-center sm:w-[70%] w-[90%] mx-auto text-lg">
          Experience hassle-free parking with real-time availability and secure reservations. Perfect spots are just a click away.
        </p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInFromBotom}
          className="flex items-center justify-center gap-4 py-10"
        >
          {token ? (
            <>
              <Link to="/book-parking">
                <Buttons className="sm:w-52 w-44 bg-blue-600 font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-200 cursor-pointer text-white px-10 py-3 rounded-lg">
                  Book Parking
                </Buttons>
              </Link>
              <Link to="/my-bookings">
                <Buttons className="sm:w-52 w-44 bg-blue-600 font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-200 cursor-pointer text-white px-10 py-3 rounded-lg">
                  My Reservations
                </Buttons>
              </Link>
            </>
          ) : (
            <Link to="/signup">
              <Buttons className="sm:w-52 w-44 bg-blue-600 font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-200 cursor-pointer text-white px-10 py-3 rounded-lg">
                Book Your Parking Now
              </Buttons>
            </Link>
          )}
        </motion.div>

        <div className="bg-gray-100 py-10 rounded-lg shadow-md text-center">
          <h2 className="font-montserrat text-headerColor text-3xl font-bold">
            Why Choose Our Parking System?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8 px-4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-btnColor mb-4">
                Real-Time Availability
              </h3>
              <p className="text-gray-600">
                Check available parking spaces instantly and reserve your spot with ease.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-btnColor mb-4">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Pay securely using multiple payment options, ensuring a seamless experience.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-btnColor mb-4">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Have questions? Our support team is available around the clock to assist you.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-10 rounded-lg shadow-md text-center">
          <h2 className="font-montserrat text-headerColor text-3xl font-bold mb-6">
            Featured Parking Locations
          </h2>
          <div className="grid md:grid-cols-4 gap-4 px-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">Downtown Plaza</h3>
              <p className="text-gray-600">Near City Center</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">Airport Parking</h3>
              <p className="text-gray-600">24/7 Access</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">Mall Parking</h3>
              <p className="text-gray-600">Connected to Shopping Area</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">Stadium Parking</h3>
              <p className="text-gray-600">For Events & Games</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
