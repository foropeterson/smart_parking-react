import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const BookingDetails = () => {
  const { bookingId } = useParams(); // Extract bookingId from URL params
  const navigate = useNavigate(); // Use navigate to redirect to '/my-bookings'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (bookingId) {
      setLoading(true);
      api
        .get(`/bookings/${bookingId}`)
        .then((response) => {
          console.log("API Response:", response.data); // Log the API response here
          if (response.data.responseCode === "200") {
            setBooking(response.data.body);
          } else {
            setError("Error retrieving booking details");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching booking details:", err); // Log the error if any
          setError("Error fetching booking details");
          setLoading(false);
        });
    }
  }, [bookingId]);

  const handleActionClick = (paymentStatus, bookingId) => {
    switch (paymentStatus) {
      case "PAID":
        alert(`Exit parking for booking ID ${bookingId}`);
        break;
      case "PENDING":
        alert(`Redirect to payment page for booking ID ${bookingId}`);
        break;
      case "INITIATED":
        alert(`Complete payment for booking ID ${bookingId}`);
        break;
      default:
        alert("Invalid action");
    }
  };
const formatTime = (datetimeArray) => {
  // Convert the array [year, month, day, hour, minute] into a Date object
  const dateObj = new Date(
    datetimeArray[0],
    datetimeArray[1] - 1,
    datetimeArray[2],
    datetimeArray[3],
    datetimeArray[4]
  );

  // Use toLocaleTimeString to format the time (12-hour format with AM/PM)
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return dateObj.toLocaleTimeString("en-US", options);
};
  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Booking Details
      </h2>
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : booking ? (
        <div className="bg-gray-50 rounded-lg shadow-md p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Booking ID:</span>
              <span className="text-gray-600">{booking.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Booked By (Email):
              </span>
              <span className="text-gray-600">{booking.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Spot Number:</span>
              <span className="text-gray-600">
                {booking.parkingSpot.spotId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Spot Location:
              </span>
              <span className="text-gray-600">
                {booking.parkingSpot.spotLocation}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Vehicle Type:</span>
              <span className="text-gray-600">{booking.vehicleType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Vehicle Number:
              </span>
              <span className="text-gray-600">
                {booking.vehicleRegistration}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Start Time:</span>
              <span className="text-gray-600">
                {formatTime(booking.startTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">End Time:</span>
              <span className="text-gray-600">
                {formatTime(booking.endTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Amount:</span>
              <span className="text-gray-600">{booking.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Payment Status:
              </span>
              <span className="text-gray-600">{booking.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Booking Status:
              </span>
              <span className="text-gray-600">{booking.bookingStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Booked At:</span>
              <span className="text-gray-600">
                {formatTime(booking.startTime)}
              </span>
            </div>
          </div>

          {/* Action buttons based on payment status */}
          <div className="mt-6 flex justify-center gap-4">
            {booking.paymentStatus === "PAID" && (
              <>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition"
                >
                  Back to My Bookings
                </button>
              </>
            )}
            {booking.paymentStatus === "PENDING" && (
              <>
                <button
                  onClick={() =>
                    handleActionClick("PENDING", booking.bookingId)
                  }
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                >
                  Pay Now
                </button>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition"
                >
                  Back to My Bookings
                </button>
              </>
            )}
            {booking.paymentStatus === "INITIATED" && (
              <>
                <button
                  onClick={() =>
                    handleActionClick("INITIATED", booking.bookingId)
                  }
                  className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition"
                >
                  Complete Payment
                </button>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition"
                >
                  Back to My Bookings
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">No booking found.</div>
      )}
    </div>
  );
};

export default BookingDetails;
