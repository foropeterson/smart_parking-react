import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    bookingId: "",
    amount: "",
    quantity: 1, // Set quantity to 1
    name: "", // Dynamic name to be passed from BookParking
    currency: "USD", // Static currency
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // For validation errors
 
  
  // Populate form data from the location state passed from the previous page
  useEffect(() => {
    if (location.state) {
      const { bookingId, amount, vehicleRegistration, name } = location.state;
      setFormData({
        bookingId: bookingId || "",
        amount: amount || "",
        quantity: 1,
        name: name || `Parking fee for ${vehicleRegistration}`,
        currency: "USD", // Static currency
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation error when user starts typing or selecting a value
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { bookingId, amount } = formData;

    let validationErrors = {};

    // Validation checks
    if (!bookingId) validationErrors.bookingId = "Booking ID is required";
    if (!amount) validationErrors.amount = "Amount is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await api.post("/checkout", {
        bookingId,
        amount,
        quantity: 1, 
        name: formData.name,
        currency: formData.currency,
      });

      if (response.data.status === "SUCCESS") {
        toast.success(response.data.message || "Payment session created");

  
        window.location.href = response.data.sessionUrl; 
      } else {
        toast.error(response.data.message || "Error creating payment session");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.responseMessage || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMpesaPayment = async (amount, bookingId) => {
    navigate("/mpesa-checkout", { state: { amount, bookingId } });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-700 mb-4">Make Payment</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Booking ID</label>
            <input
              type="text"
              name="bookingId"
              value={formData.bookingId}
              readOnly
              className={`mt-1 block w-full max-w-md rounded-md bg-gray-100 border p-2 text-sm ${
                errors.bookingId ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.bookingId && <p className="text-red-500 text-sm">{errors.bookingId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              readOnly
              className={`mt-1 block w-full max-w-md rounded-md bg-gray-100 border p-2 text-sm ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className={`mt-1 block w-full max-w-md rounded-md bg-gray-100 border p-2 text-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="flex justify-end space-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={() => handleMpesaPayment(formData.amount, formData.bookingId)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 disabled:bg-gray-400 text-sm"
          >
            {loading ? <span>Loading...</span> : "Pay By M-PESA"}
          </button>
            <Buttons
              disabled={loading}
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:bg-gray-400 text-sm"
            >
              {loading ? <span>Loading...</span> : "Pay By Card"}
            </Buttons>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
