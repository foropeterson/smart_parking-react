import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
//import aboutImage from "./path/to/your/image.jpg"; // Add your image path here

const AboutPage = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="mb-4">
          Welcome to SecurePark, your reliable partner for safe and convenient parking management. 
          We are committed to making parking easier, faster, and more secure. Our system enables you 
          to book and pay for your parking spot securely from anywhere, ensuring a hassle-free experience 
          tailored to your comfort and convenience.
        </p>
  
        <ul className="list-disc list-inside mb-4 text-sm px-6 py-2">
          <li className="mb-2">
            Log in to your account to access personalized parking options.
          </li>
          <li className="mb-2">
            Easily book your parking spot in advance to avoid last-minute hassles.
          </li>
          <li className="mb-2">
            Enjoy secure online payments with end-to-end encryption for peace of mind.
          </li>
          <li className="mb-2">
            Access your booking history and manage your reservations effortlessly.
          </li>
          <li className="mb-2">
            Designed for your convenience, our system is user-friendly and accessible from anywhere.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
