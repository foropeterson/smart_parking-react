import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 5,
  });
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  // Fetch user ID
  const fetchUserId = async () => {
    try {
      const response = await api.get('/auth/user');
      if (response.status === 200) {
        setUserId(response.data.id);
      } else {
        setError('Failed to fetch user details');
      }
    } catch (err) {
      setError('Error fetching user details');
    }
  };

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
  const handleViewClick = (bookingId) => {
    console.log(`View details for bookingId: ${bookingId}`);
    // You can use navigate or any routing logic to redirect to the booking details page
    navigate(`/bookings/${bookingId}`);
  };
  // Fetch bookings (without filtering)
  const fetchBookings = async (page = 1, size = 5) => {
    console.log(`Fetching bookings: Page=${page}, Size=${size}`);
    if (!userId) return;
    try {
      setLoading(true);
      const response = await api.get(`/bookings/my-bookings?userId=${userId}&page=${page}&size=${size}`
      );
      if (response.data.responseCode === '200') {
        const processedData = processBookings(response.data.body);
        setBookings(processedData);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          pageSize: size,
        });
      } else {
        setError(response.data.responseMessage || 'Error fetching bookings');
      }
    } catch (err) {
      console.log(err)
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Apply filter to bookings
  const filterBookings = (bookings, filter) => {
    if (filter === 'ALL') {
      return bookings;
    }
    return bookings.filter((booking) => booking.paymentStatus === filter);
  };

  // Fetch user ID once on component mount
  useEffect(() => {
    fetchUserId();
  }, []);

  // Fetch bookings when userId or pagination changes
  useEffect(() => {
    if (userId) {
      fetchBookings(pagination.currentPage, pagination.pageSize);
    }
  }, [userId, pagination.currentPage, pagination.pageSize]);

  // Update filtered bookings whenever bookings or filter changes
  useEffect(() => {
    const filtered = filterBookings(bookings, filter);
    setFilteredBookings(filtered);
  }, [bookings, filter]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1, // Reset to the first page when filter changes
    }));
  };
 // Updated View button in the renderActionButton function
 const renderActionButton = (bookingStatus,paymentStatus, bookingId, amount, vehicleRegistration) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleViewClick(bookingId)}
        className="px-4 py-2 bg-gray-500 text-white rounded-md"
      >
        View
      </button>
      {paymentStatus === 'PAID' && bookingStatus === 'ACTIVE' &&(
        <button
          onClick={() => handleExitParking(bookingId)}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Exit Parking
        </button>
      )}
      {paymentStatus === 'PENDING' && (
        <button 
          onClick={() => navigate('/make-payment', { state: { bookingId, amount, vehicleRegistration, name: `Parking fee for ${vehicleRegistration}` } })}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Pay Now
        </button>
      )}
    </div>
  );
};
const handleExitParking = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/exit/${bookingId}`);
    console.log("response",response)
    if (response.data.responseCode === 200) {
      alert(response.data.responseMessage);
      // You can also refresh the bookings or update the state to reflect the changes
      fetchBookings(pagination.currentPage, pagination.pageSize); // Fetch updated bookings
    } else {
      alert(response.data.responseMessage || 'Failed to exit parking. Please try again.');
    }
  } catch (error) {
    console.error('Error exiting parking:', error);
    alert('Error exiting parking. Please try again.');
  }
};
const handleBookNow = () => {
    navigate("/book-parking");
};
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Bookings</h2>
      <div className="mb-4 flex items-center gap-4">
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="ALL">All</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="INITIATED">Initiated</option>
          </select>

          {/* Book Now Button */}
          <button
            onClick={handleBookNow}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600"
          >
            {/* Booking Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-6h6v6m0 0v2a2 2 0 002 2h2a2 2 0 002-2v-2m-2-10V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m-8 10h14M3 7h2m4 0h10"
              />
            </svg>
            Book Now
          </button>
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
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Action</th>
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
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{booking.paymentStatus}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">
                    {renderActionButton(booking.bookingStatus,booking.paymentStatus, booking.bookingId,booking.amount,booking.vehicleRegistration)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-600">
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
export default MyBookings;
