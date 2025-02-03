import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../services/api";

const AvailableSpots = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 7
  });
  const [locationSearch, setLocationSearch] = useState('');
  const [filter, setFilter] = useState('All'); // Filter state
  const navigate = useNavigate();

  const fetchAvailableSpots = async (page = 1, size = 7, location = '') => {
    try {
      const queryLocation = location.trim();
      const response = await api.get(`/parking/spots/available?page=${page}&size=${size}&location=${queryLocation}`);
      if (response.data.responseCode === "200") {
        setSpots(response.data.body);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          pageSize: size
        });
      } else {
        setError('Error fetching available spots');
      }
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSpots(pagination.currentPage, pagination.pageSize, locationSearch);
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prevState) => ({
      ...prevState,
      currentPage: page
    }));
  };

  const handleLocationSearchChange = (event) => {
    setLocationSearch(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    if (event.target.value === 'All') {
      setLocationSearch('');
      fetchAvailableSpots(1, pagination.pageSize, '');
      setPagination((prevState) => ({
        ...prevState,
        currentPage: 1
      }));
    }
  };

  const handleBookNow = (spot) => {
    console.log('Spot Info:', spot); // Log the entire spot object to verify its contents
    if (spot.spotId) {
      const spotId = spot.spotId; // Directly use spotId
      navigate("/book-parking", {
        state: {
          spotId,
          vehicleType: spot.vehicleType
        }
      });
    } else {
      setError("Spot information is missing.");
    }
};

  const handleSearchClick = () => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: 1
    }));
    if (filter !== 'All') {
      if (locationSearch.trim()) {
        setError(null);
        fetchAvailableSpots(1, pagination.pageSize, locationSearch);
      } else {
        setError("Please enter a valid location to search.");
      }
    } else {
      fetchAvailableSpots(1, pagination.pageSize, '');
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Available Parking Spots</h2>
      
      {/* Filters */}
      <div className="mb-4 flex items-center">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        >
          <option value="All">All</option>
          <option value="Location">By Location</option>
        </select>
        <input
          type="text"
          value={locationSearch}
          onChange={handleLocationSearchChange}
          placeholder="Search by location"
          className="p-2 border rounded-md w-full max-w-xs ml-2"
          disabled={filter === 'All'}
        />
        <button
          onClick={handleSearchClick}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
      </div>
      
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Parking Spot Number</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Parking Spot Location</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Vehicle Type</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Status</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
                {spots.length > 0 ? (
                    spots.map((spot) => (
                    <tr key={spot.spotId} className="hover:bg-gray-100">
                        <td className="py-1 px-4 text-sm text-gray-700 border-b">{spot.spotId}</td>
                        <td className="py-1 px-4 text-sm text-gray-700 border-b">{spot.spotLocation}</td>
                        <td className="py-1 px-4 text-sm text-gray-700 border-b">{spot.vehicleType}</td>
                        <td className="py-1 px-4 text-sm text-gray-700 border-b">
                        <span
                            className={`${
                            spot.status === 'AVAILABLE'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            } py-0.5 px-2 rounded-full text-xs font-semibold`}
                        >
                            {spot.status}
                        </span>
                        </td>
                        <td className="py-1 px-4 text-sm text-gray-700 border-b">
                        {spot.status === 'AVAILABLE' ? (
                            <button
                            onClick={() => handleBookNow(spot)}
                            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                            Book Now
                            </button>
                        ) : (
                            <button
                            className="px-4 py-1 bg-gray-300 text-white rounded cursor-not-allowed"
                            disabled
                            >
                            Unavailable
                            </button>
                        )}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="5" className="py-2 px-4 text-center text-sm text-gray-600">
                        No available spots
                    </td>
                    </tr>
                )}
                </tbody>
          </table>

          <div className="mt-4 flex justify-center items-center space-x-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    Previous
                </button>
                <div className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                >
                    Next
                </button>
            </div>

        </>
      )}
    </div>
  );
};

export default AvailableSpots;
