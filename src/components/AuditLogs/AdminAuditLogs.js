import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import api from "../../services/api";

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]); // State for audit logs
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [logsPerPage] = useState(5); // Number of logs per page
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const [fromDate, setFromDate] = useState(""); // Filter: From date
  const [toDate, setToDate] = useState(""); // Filter: To date
  const [filteredLogs, setFilteredLogs] = useState([]); // Logs after filtering

  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      try {
        const response = await api.get("/admin/audit/logs");
        setAuditLogs(response.data.body);
        setFilteredLogs(response.data.body); // Initialize with all logs
      } catch (err) {
        setError("Failed to fetch audit logs. Please try again later.");
        console.error("Error fetching audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  // Filter logs based on selected dates
  const handleFilter = () => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (fromDate && toDate) {
      const filtered = auditLogs.filter((log) => {
        const logDate = new Date(log.changeTimestamp);
        return logDate >= from && logDate <= to;
      });
      setFilteredLogs(filtered);
      setCurrentPage(1); // Reset to the first page after filtering
    }
  };

  // Reset filter to show all logs
  const handleShowAll = () => {
    setFilteredLogs(auditLogs);
    setFromDate("");
    setToDate("");
    setCurrentPage(1); // Reset to the first page
  };

  // Get current logs based on pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Audit Logs</h1>

      {/* Date Filter Section */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <div>
          <label className="block text-gray-700">From:</label>
          <input
            type="datetime-local"
            className="border border-gray-300 rounded px-3 py-1"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">To:</label>
          <input
            type="datetime-local"
            className="border border-gray-300 rounded px-3 py-1"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleFilter}
          >
            Filter
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={handleShowAll}
          >
            All
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Action</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Timestamp</th>
              <th className="px-4 py-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log) => (
              <tr
                key={log.id}
                className="text-center border-b hover:bg-gray-100"
              >
                <td className="px-4 py-2 border">{log.id}</td>
                <td className="px-4 py-2 border">{log.action}</td>
                <td className="px-4 py-2 border">{log.username}</td>
                <td className="px-4 py-2 border flex items-center justify-center gap-2">
                  <FaCalendarAlt className="text-gray-600" />
                  {log.changeTimestamp}
                </td>

                <td className="px-4 py-2 border">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center items-center mt-4">
        {/* Previous Button */}
        <button
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {/* Page Info */}
        <span className="mx-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Button */}
        <button
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
