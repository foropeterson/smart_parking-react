import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../services/api";

const AllParkingSpots = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 7
  });
  const [filter, setFilter] = useState('All');
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSpot, setNewSpot] = useState({
    spotLocation: '',
    vehicleType: '',
    status: 'AVAILABLE'
  });
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const fetchAvailableSpots = async (page = 1, size = 7) => {
    try {
      const response = await api.get(`/parking/spots?page=${page}&size=${size}`);
      if (response.data.responseCode === "200") {
        setSpots(response.data.body);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          pageSize: size
        });
        setFilteredSpots(response.data.body);
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
    fetchAvailableSpots(pagination.currentPage, pagination.pageSize);
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prevState) => ({
      ...prevState,
      currentPage: page
    }));
  };

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === 'All') {
      setFilteredSpots(spots);
    } else {
      const filtered = spots.filter((spot) => spot.status === selectedFilter.toUpperCase());
      setFilteredSpots(filtered);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSpot((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== '') {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!newSpot.spotLocation.trim()) {
      errors.spotLocation = 'Location is required';
    }
    if (!newSpot.vehicleType.trim()) {
      errors.vehicleType = 'Vehicle type is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSpot = async () => {
    if (!validateForm()) return;

    try {
      const response = await api.post('/admin/parking/spots', newSpot);
      if (response.data.responseCode === "201") {
        fetchAvailableSpots(pagination.currentPage, pagination.pageSize);
        setShowModal(false);
        setNewSpot({ spotLocation: '', vehicleType: '', status: 'AVAILABLE' });
      } else {
        alert('Failed to add parking spot');
      }
    } catch (error) {
      alert('Error adding parking spot');
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Parking Spots</h2>

      {/* Filters and Add Parking Spot Button */}
      <div className="mb-4 flex items-center space-x-4">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        >
          <option value="All">All</option>
          <option value="BOOKED">Booked</option>
          <option value="AVAILABLE">Available</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add Parking Spot
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
              </tr>
            </thead>
            <tbody>
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => (
                  <tr key={spot.spotId} className="hover:bg-gray-100">
                    <td className="py-1 px-4 text-sm text-gray-700 border-b">{spot.spotId}</td>
                    <td className="py-1 px-4 text-sm text-gray-700 border-b">{spot.spotLocation}</td>
                    <td className="py-1 px-4 text-sm text-gray-700 border-b">{spot.vehicleType}</td>
                    <td className="py-1 px-4 text-sm text-gray-700 border-b">
                      <span
                        className={`${
                          spot.status === 'AVAILABLE'
                            ? 'bg-green-100 text-green-700'
                            : spot.status === 'BOOKED'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        } py-0.5 px-2 rounded-full text-xs font-semibold`}
                      >
                        {spot.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-2 px-4 text-center text-sm text-gray-600">
                    No parking spots found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
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

      {/* Modal for Adding Parking Spot */}
        {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Parking Spot</h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                type="text"
                name="spotLocation"
                value={newSpot.spotLocation}
                onChange={handleInputChange}
                className={`p-1 text-sm border rounded-md w-full ${formErrors.spotLocation ? 'border-red-500' : ''}`}
                />
                {formErrors.spotLocation && <p className="text-red-500 text-xs mt-1">{formErrors.spotLocation}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <input
                type="text"
                name="vehicleType"
                value={newSpot.vehicleType}
                onChange={handleInputChange}
                className={`p-1 text-sm border rounded-md w-full ${formErrors.vehicleType ? 'border-red-500' : ''}`}
                />
                {formErrors.vehicleType && <p className="text-red-500 text-xs mt-1">{formErrors.vehicleType}</p>}
            </div>
            <div className="flex justify-end space-x-4">
                <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
                >
                Cancel
                </button>
                <button
                onClick={handleAddSpot}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                Add
                </button>
            </div>
            </div>
        </div>
        )}

    </div>
  );
};

export default AllParkingSpots;
