import React, { useEffect, useState } from "react";
import parkingImage from "../img/parking.jpg";
import api from "../../services/api";

const AdminBoard = () => {
  const [stats, setStats] = useState({
    parkUsers: 0,
    revenue: 0,
    parkingSpots: 0,
    bookings: 0,
  });
  const [username, setUsername] = useState(""); // State for storing the username
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, revenueRes, spotsRes, bookingsRes] = await Promise.all([
          api.get("/admin/users/count"),
          api.get("/admin/parking/revenue"),
          api.get("/admin/parking/count"),
          api.get("/admin/bookings/count"),
        ]);

        setStats({
          parkUsers: usersRes.data,
          revenue: revenueRes.data,
          parkingSpots: spotsRes.data,
          bookings: bookingsRes.data,
        });
      } catch (error) {
        console.error("Error fetching stats: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsername = async () => {
      try {
        const response = await api.get("/auth/username");
        setUsername(response.data); // Assuming the response data is the username
      } catch (error) {
        console.error("Error fetching username: ", error);
      }
    };

    fetchStats();
    fetchUsername();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-semibold text-center md:text-left">
            Welcome, <small>{username}</small>
          </h1>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="flex-grow md:flex-grow-0 px-4 py-2 border border-gray-300 rounded-md"
            />
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white shadow rounded-md">
            <h2 className="text-lg font-medium text-gray-600">Park Users</h2>
            <p className="text-2xl font-bold">
              {loading ? "Loading..." : stats.parkUsers}
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-md">
            <h2 className="text-lg font-medium text-gray-600">Parking Revenue</h2>
            <p className="text-2xl font-bold">
              {loading ? "Loading..." : formatCurrency(stats.revenue)}
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-md">
            <h2 className="text-lg font-medium text-gray-600">Parking Spots</h2>
            <p className="text-2xl font-bold">
              {loading ? "Loading..." : stats.parkingSpots}
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-md">
            <h2 className="text-lg font-medium text-gray-600">Paid Bookings</h2>
            <p className="text-2xl font-bold">
              {loading ? "Loading..." : stats.bookings}
            </p>
          </div>
        </section>

        {/* Charts and Map */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 p-4 bg-white shadow rounded-md">
            <h2 className="text-lg font-medium mb-4">Parking Areas</h2>
            <div className="h-64">
              <img
                src={parkingImage}
                alt="Parking Areas"
                className="h-full w-full object-cover rounded-md"
              />
            </div>
          </div>
          <div className="p-4 bg-white shadow rounded-md">
            <h2 className="text-lg font-medium mb-4">
              Control Unauthorized Parking
            </h2>
            <div className="h-64 bg-blue-50 flex flex-col justify-center items-center text-center rounded-md p-4">
              <p className="text-gray-600 mt-2">
                Use advanced GPS and real-time monitoring to locate and act
                against unauthorized vehicles on the parking. Leverage AI to
                identify suspicious patterns and notify security personnel
                instantly.
              </p>
              <p className="mt-4 text-blue-500 font-medium cursor-pointer">
                Learn More &rarr;
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminBoard;
