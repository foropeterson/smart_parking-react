import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

const MpesaCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [bookingId, setBookingId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Extract amount and bookingId from location state
  useEffect(() => {
    if (location.state) {
      const { amount, bookingId } = location.state;
      setAmount(amount || 0);
      setBookingId(bookingId || "");
    }
  }, [location.state]);

  // API call to process payment using Axios
  const processPayment = async () => {
    if (!phoneNumber || !amount || !bookingId) {
      setError("Please provide all the required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/mpayments/process/${bookingId}`,
        {
          phoneNumber: phoneNumber,
          amount: amount.toString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "200") {
        navigate("/payment-success");
      } else {
        setError(response.data.responseMessage || "Payment failed. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-[350px] bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <span className="text-xl font-bold">{`KES ${amount}`}</span>
        </div>
        <div className="border rounded-lg p-4 bg-gray-50 mb-6">
          <h3 className="text-center font-medium text-green-600 text-lg mb-2">
            LIPA NA M-PESA
          </h3>
        </div>
        <div className="border rounded-lg p-4 bg-gray-50">
          <form>
            <label
              htmlFor="phone-number"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="254123456789"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              required
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="button"
              onClick={processPayment}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MpesaCheckout;
