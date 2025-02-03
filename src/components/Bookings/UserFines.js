import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const UserFines = () => {
  const [fines, setFines] = useState([]);
  const [filteredFines, setFilteredFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 5,
  });

  const navigate = useNavigate();

  // Fetch user ID
  const fetchUserId = async () => {
    try {
      const response = await api.get("/auth/user");
      if (response.status === 200) {
        setUserId(response.data.id);
        console.log(fines)
      } else {
        setError("Failed to fetch user details");
      }
    } catch (err) {
      setError("Error fetching user details");
    }
  };

  // Format date-time
  // const formatDateTime = (datetime) => {
  //   const dateObj = new Date(datetime);
  //   const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
  //   const time = dateObj.toLocaleTimeString("en-US", options);
  //   const date = dateObj.toISOString().split("T")[0]; // yyyy-mm-dd format
  //   return `${date} ${time}`;
  // };

  // Fetch fines for user
  const fetchFines = async (page = 1, size = 5) => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await api.get(`/fines/${userId}`);
      if (response.data.responseCode === "200") {
        setFines(response.data.body);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(response.data.body.length / size),
          pageSize: size,
        });
      } else {
        setError(response.data.responseMessage || "Error fetching fines");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Apply pagination
  const paginateFines = (fines, page, size) => {
    const start = (page - 1) * size;
    return fines.slice(start, start + size);
  };

  // Fetch user ID on component mount
  useEffect(() => {
    fetchUserId();
  }, []);

  // Fetch fines when userId is available
  useEffect(() => {
    if (userId) {
      fetchFines(pagination.currentPage, pagination.pageSize);
    }
  }, [userId, pagination.currentPage]);

  // Update filtered fines when fines change
  useEffect(() => {
    setFilteredFines(paginateFines(fines, pagination.currentPage, pagination.pageSize));
  }, [fines, pagination.currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Pay fine button
  const handlePayFine = (bookingId, amount) => {
    navigate("/make-payment", {
      state: { bookingId, amount, name: `Fine Payment for ID ${bookingId}` },
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Fines</h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Fine ID</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Amount</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Fine Date</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Status</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Booking ID</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Last Updated</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFines.length > 0 ? (
                filteredFines.map((fine) => (
                  <tr key={fine.fineId} className="hover:bg-gray-100">
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{fine.fineId}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{fine.amount.toFixed(2)}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{(fine.issuedAt)}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{fine.status}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{fine.booking?.bookingId}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">{(fine.lastUpdated)}</td>
                    <td className="py-2 px-4 text-sm text-gray-700 border-b">
                      <button
                        onClick={() => handlePayFine(fine.booking?.bookingId, fine.amount)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-600">
                    No fines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
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

export default UserFines;
