import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import api from "../../services/api";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";

const BookParking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    userId: "",
    spotId: location.state?.spotId || "",
    vehicleRegistration: "",
    vehicleType:location.state?.vehicleType || "",
    startTime: "",
    endTime: "",
    amount: "",
    paymentStatus: "PENDING", // Set the payment status directly here
  });

  const [loading, setLoading] = useState(false);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
  const [errors, setErrors] = useState({}); // For tracking validation errors
  // Fetch userId from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/user");
        setFormData((prevData) => ({
          ...prevData,
          userId: response.data.id, // Set userId from API response
        }));
      } catch (err) {
        toast.error("Error fetching user details. Please try again.");
      }
    };

    fetchUser();
  }, []);

  // Fetch parking spots from the API
  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const response = await api.get("/parking/spots/with-location");
        setParkingSpots(response.data.body || []);
      } catch (err) {
        toast.error("Error fetching parking spots. Please try again.");
      }
    };

    fetchParkingSpots();
  }, []);

  // Automatically pick the first available spot when "Book Now" is clicked
  const pickAvailableSpot = () => {
    // Find the first spot (or you can select based on user input)
    const availableSpot = parkingSpots[0]; // Use the first spot or select based on user input
    
    console.log("availableSpot:", availableSpot);
    console.log("parkingSpots:", parkingSpots);
    
    if (availableSpot) {
      // Extract vehicleType directly from availableSpot
      const selectedVehicleType = availableSpot.vehicleType; 
      console.log("selectedVehicleType:", selectedVehicleType); // Print the vehicle type
      
      // Set the form data
      setFormData(prevData => ({
        ...prevData,
        spotId: availableSpot.spotInfo.split(" ")[0], // Extract spotId from spotInfo
        vehicleType: selectedVehicleType, // Set vehicleType based on available spot
      }));
    }
  };
  

  // Fetch amount from the API whenever required form fields change
  useEffect(() => {
    const { userId, vehicleType, startTime, endTime } = formData;

    if (userId && vehicleType && startTime && endTime) {
      const fetchAmount = async () => {
        try {
          const response = await api.get(`/bookings/calculate-amount`, {
            params: { userId, vehicleType, startTime, endTime },
          });
          setFormData((prevData) => ({
            ...prevData,
            amount: response.data || "0.0",
          }));
        } catch (err) {
          toast.error("Error fetching amount. Please try again.");
          setFormData((prevData) => ({ ...prevData, amount: "" }));
        }
      };

      fetchAmount();
    }
  }, [formData.userId, formData.vehicleType, formData.startTime, formData.endTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the selected name is spotId
    if (name === "spotId") {
      // Find the selected spot using the spotId
      const selectedSpot = parkingSpots.find(spot => spot.spotInfo.split(" ")[0] === value);
      
      // If the spot is found, extract the vehicleType
      if (selectedSpot) {
        const selectedVehicleType = selectedSpot.vehicleType;
        console.log("selectedVehicleType:", selectedVehicleType); // Print the selected vehicle type
        
        // Set the form data with the selected spotId and vehicleType
        setFormData(prevData => ({
          ...prevData,
          spotId: value, // Set the spotId based on user selection
          vehicleType: selectedVehicleType, // Set the vehicleType based on the selected spot
        }));
      }
    } else {
      // For other fields, update the form data as usual
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      userId,
      spotId,
      vehicleRegistration,
      vehicleType,
      startTime,
      endTime,
      amount,
    } = formData;
  
    let validationErrors = {};
  
    // Validation checks
    if (!spotId) validationErrors.spotId = "Parking spot is required";
    if (!vehicleType) validationErrors.vehicleType = "Vehicle type is required";
    if (!amount) validationErrors.amount = "Amount is required";
    if (!vehicleRegistration) validationErrors.vehicleRegistration = "Vehicle registration is required";
    if (!startTime) validationErrors.startTime = "Start time is required";
    if (!endTime) validationErrors.endTime = "End time is required";
    if (new Date(endTime) <= new Date(startTime)) validationErrors.endTime = "End time must be greater than start time";
  
    setErrors(validationErrors);
  
    // If there are validation errors, return early and highlight the fields
    if (Object.keys(validationErrors).length > 0) return;
  
    try {
      setLoading(true);
      const bookingData = { ...formData };
      const response = await api.post("/bookings/create", bookingData);
  
      if (response.data.responseCode === "200" || response.data.responseCode === "201") {
        toast.success(response.data.responseMessage || "Parking booked successfully");
  
        // Get bookingId, amount, and vehicleRegistration from the response
        const { bookingId, amount, vehicleRegistration } = response.data.body;
        
        // Navigate to make-payment with necessary data passed as state
        navigate("/make-payment", {
          state: {
            bookingId,
            amount,
            vehicleRegistration,
            name: `Parking payment for ${vehicleRegistration}`, // Construct the name dynamically
          },
        });
      } else {
        toast.error(response.data.responseMessage || "Error booking parking");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.responseMessage || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-700 mb-4">Book Parking Spot</h1>
        <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Spot Number</label>
          <select
            name="spotId"
            value={formData.spotId}
            onChange={handleChange}
            className={`mt-1 block w-full max-w-md rounded-md border p-2 text-sm ${
              errors.spotId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="" disabled>Select Parking Spot</option>
            {parkingSpots.map((spot) => (
              <option key={spot.spotInfo} value={spot.spotInfo.split(" ")[0]}>
                {spot.spotInfo}
              </option>
            ))}
          </select>
          {errors.spotId && <p className="text-red-500 text-sm">{errors.spotId}</p>}
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Vehicle Type</label>
            <input
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              readOnly
              className={`mt-1 block w-full max-w-md rounded-md bg-gray-100 border p-2 text-sm ${
                errors.vehicleType ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.vehicleType && <p className="text-red-500 text-sm">{errors.vehicleType}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Vehicle Reg Number</label>
            <input
              type="text"
              name="vehicleRegistration"
              value={formData.vehicleRegistration}
              onChange={handleChange}
              className={`mt-1 block w-full max-w-md rounded-md border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.vehicleRegistration ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Vehicle Registration"
            />
            {errors.vehicleRegistration && <p className="text-red-500 text-sm">{errors.vehicleRegistration}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                className={`mt-1 block w-full max-w-sm rounded-md border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.startTime ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                min={new Date(new Date().getTime() + 60000).toISOString().slice(0, 16)}
                className={`mt-1 block w-full max-w-sm rounded-md border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.endTime ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime}</p>}
            </div>
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
              placeholder="Amount"
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
          </div>
          <div className="text-right">
            <Buttons
              disabled={loading}
              onClickhandler={(e) => { pickAvailableSpot(); handleSubmit(e) }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:bg-gray-400 text-sm"
            >
              {loading ? <span>Loading...</span> : "Book Now"}
            </Buttons>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookParking;
