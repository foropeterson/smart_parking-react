import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors.js";
import moment from "moment";

// Importing the columns for audit logs
import { auditLogscolumn } from "../../utils/tableColumn.js";

const AuditLogsDetails = () => {
  // Access the id from the URL
  const { id } = useParams();
  const [auditLogs, setAuditLogs] = useState(null); // Ensure auditLogs is initialized as null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the single audit log based on id
  const fetchSingleAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching data for ID:", id); // Log the ID being used in the request

      const { data } = await api.get(`/admin/audit/logs/1`);

      console.log("API Response:", data); // Log the response to inspect the structure

      if (data && data.body) {
        setAuditLogs(data.body);
        console.log("setAuditLogs", setAuditLogs);
        // Ensure we're setting data.body properly
      } else {
        setAuditLogs(null); // If no body, set to null
      }
    } catch (err) {
      setError(err?.response?.data?.responseMessage || "An error occurred");
      console.error("Error fetching audit logs:", err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSingleAuditLogs();
    }
  }, [id, fetchSingleAuditLogs]);

  // Map the structure to the DataGrid row format
  const rows = auditLogs
    ? [
        {
          id: auditLogs.id,
          entityName: auditLogs.entityName,
          entityId: auditLogs.entityId ?? "N/A", // If entityId is null, show "N/A"
          action: auditLogs.action,
          username: auditLogs.username,
          timestamp: moment(auditLogs.changeTimestamp).format(
            "MMMM DD, YYYY, hh:mm A"
          ),
          details: auditLogs.details,
        },
      ]
    : []; // If no data, return an empty array

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="p-4">
      <div className="py-6">
        {auditLogs && (
          <h1 className="text-center sm:text-2xl text-lg font-bold text-slate-800">
            Audit Log for ID - {id}
          </h1>
        )}
      </div>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-72">
          <Blocks
            height="70"
            width="70"
            color="#4fa94d"
            ariaLabel="blocks-loading"
            wrapperClass="blocks-wrapper"
            visible={true}
          />
          <span>Please wait...</span>
        </div>
      ) : (
        <>
          {auditLogs === null ? (
            <Errors message="Invalid ID or no data available." />
          ) : (
            <div className="overflow-x-auto w-full">
              <DataGrid
                className="w-fit mx-auto px-0"
                rows={rows}
                columns={auditLogscolumn}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 6,
                    },
                  },
                }}
                disableRowSelectionOnClick
                pageSizeOptions={[6]}
                disableColumnResize
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuditLogsDetails;
