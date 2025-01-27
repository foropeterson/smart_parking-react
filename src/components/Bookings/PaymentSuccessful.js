import React from "react";
import { useNavigate } from "react-router-dom";


const PaymentSuccessful = () => {
    const navigate = useNavigate();

    const handleBackToBockings =() =>{
        navigate("/my-bookings");
    }
navigate("/make-payment")
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
        <div className="w-16 h-16 flex items-center justify-center bg-green-500 rounded-full">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">Payment Success!</h1>
        <p className="text-gray-600 text-center mt-2">
          Thank you for completing your payment for parking.
        </p>
        <hr/>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-6 hover:bg-blue-700 focus:outline-none"
          onClick={handleBackToBockings}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
