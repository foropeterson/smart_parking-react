import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../../services/api';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 5,
  });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  // Format datetime
 const formatDateTime = (datetime) => {
   // Create a new Date object using the array of [year, month, day, hours, minutes]
   const dateObj = new Date(
     datetime[0],
     datetime[1] - 1,
     datetime[2],
     datetime[3],
     datetime[4]
   );

   // Check if the date object is valid
   if (isNaN(dateObj.getTime())) {
     return { time: "Invalid Date", date: "Invalid Date" };
   }

   const options = { hour: "2-digit", minute: "2-digit", hour12: true };
   const time = dateObj.toLocaleTimeString("en-US", options);
   const date = dateObj.toISOString().split("T")[0]; // yyyy-mm-dd format

   return { time, date };
 };

  // Process bookings data
  const processBookings = (data) => {
    return data.map((booking) => {
      const start = formatDateTime(booking.startTime);
      const end = formatDateTime(booking.endTime);
      return {
        ...booking,
        formattedStartTime: start.time,
        formattedEndTime: end.time,
        date: start.date,
      };
    });
  };

  // Fetch bookings
  const fetchBookings = async (page = 1, size = 5) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/bookings/all?page=${page}&size=${size}`
      );
      if (response.status === 200) {
        const processedData = processBookings(response.data.body);
        setBookings(processedData);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          pageSize: size,
        });
      } else {
        setError('Error fetching bookings');
      }
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings when pagination changes
  useEffect(() => {
    fetchBookings(pagination.currentPage, pagination.pageSize);
  }, [pagination.currentPage, pagination.pageSize]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setPaymentStatusFilter(event.target.value);
  };

  // Get color based on payment status
  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500 text-white'; // Green for PAID
      case 'PENDING':
        return 'bg-red-500 text-white'; // Red for PENDING
      default:
        return 'bg-gray-300 text-black'; // Default color for others
    }
  };

  // Filter bookings based on payment status filter
  const filteredBookings = bookings.filter((booking) => {
    if (paymentStatusFilter === 'ALL') return true;
    return booking.paymentStatus === paymentStatusFilter;
  });
  const handleViewClick = (bookingId) => {
    console.log(`View details for bookingId: ${bookingId}`);
    // You can use navigate or any routing logic to redirect to the booking details page
    navigate(`/bookings/${bookingId}`);
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Bookings</h2>
      
      {/* Payment Status Filter */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="paymentStatus" className="text-sm font-medium text-gray-600">Filter by Payment Status</label>
          <select
            id="paymentStatus"
            className="ml-2 p-2 border rounded"
            value={paymentStatusFilter}
            onChange={handleFilterChange}
          >
            <option value="ALL">All</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Date</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Booking ID</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Vehicle Number</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Start Time</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">End Time</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Spot Number</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Amount</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-gray-100">
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{booking.date}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{booking.bookingId}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{booking.vehicleRegistration}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{booking.formattedStartTime}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{booking.formattedEndTime}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{booking.parkingSpot.spotId}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{booking.amount}</td>
                    <td className={`py-2 px-4 text-sm font-medium ${getStatusColor(booking.paymentStatus)} border-b`}>
                      {booking.paymentStatus}
                    </td>
                    <td>
                      <button onClick={() => handleViewClick(booking.bookingId)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md">
                       View
                    </button>
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-600">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
