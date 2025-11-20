import React, { useState, useContext, useEffect } from "react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config, USERTYPES } from "../../util/functions/constants";
import { UserContext } from "../../util/functions/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";

const LOGS_PER_PAGE = 20;

const ErrorLogs = () => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows
  const [activePage, setActivePage] = useState(0);
  const userContext = useContext(UserContext);

  const getErrorLogs = () => {
    const apiUrl = `${config.url.API_GET_ALL_ERROR_LOGS}/?resultLimit=${LOGS_PER_PAGE}&offset=${activePage}`;
    SecureFetch(apiUrl)
      .then((response) => response.json())
      .then((error_logs) => {
        setErrorLogs(error_logs);
      })
      .catch((error) => {
        alert("Failed to get error log data: " + error);
      });
  };

  const deleteErrorLog = (errorId) => {
    if (window.confirm("Are you sure you want to delete this error log?")) {
      const apiUrl = `${config.url.API_DELETE_ERROR_LOG}/${errorId}`;
      SecureFetch(apiUrl, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setErrorLogs((prevLogs) =>
              prevLogs.filter((log) => log.error_log_id !== errorId),
            );
          }
        })
        .catch((error) => {
          alert(
            "An error occurred while deleting the error log: " + error.message,
          );
        });
    }
  };

  useEffect(() => {
    getErrorLogs();
  }, [activePage]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state for the row
    }));
  };

  const num_pages = Math.ceil(errorLogs.length / LOGS_PER_PAGE) - 1;

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Error Logs</h1>
      <Table celled striped selectable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Error ID</TableHeaderCell>
            <TableHeaderCell>Date/Time</TableHeaderCell>
            <TableHeaderCell>Status Code</TableHeaderCell>
            <TableHeaderCell>User Role</TableHeaderCell>
            <TableHeaderCell>URL</TableHeaderCell>
            <TableHeaderCell>Stack Trace</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errorLogs && errorLogs.length > 0 ? (
            errorLogs.map((log) => (
              <TableRow key={log.error_log_id}>
                <TableCell>{log.error_log_id}</TableCell>
                <TableCell>{log.error_datetime}</TableCell>
                <TableCell>{log.status_code}</TableCell>
                <TableCell>{log.user_role || "N/A"}</TableCell>
                <TableCell>{log.url}</TableCell>
                <TableCell>
                  <div>
                    {expandedRows[log.error_log_id] ? (
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                        }}
                      >
                        {log.stack_trace || "N/A"}
                      </pre>
                    ) : (
                      <span>
                        {log.stack_trace
                          ? log.stack_trace.split("\n")[0] // Show only the first line
                          : "N/A"}
                      </span>
                    )}
                    {log.stack_trace && (
                      <button
                        onClick={() => toggleRow(log.error_log_id)}
                        style={{
                          marginLeft: "10px",
                          background: "none",
                          border: "none",
                          color: "#2185d0",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {expandedRows[log.error_log_id]
                          ? "Show Less"
                          : "Show More"}
                      </button>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {(userContext.user.type === USERTYPES.ADMIN ||
                    userContext.user.type === USERTYPES.DEVELOPER) && (
                    <button
                      onClick={() => deleteErrorLog(log.error_log_id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#db2828",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: "center" }}>
                No error logs available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <button
          onClick={() => setActivePage((prev) => Math.max(prev - 1, 0))}
          disabled={activePage === 0}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#2185d0",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setActivePage((prev) => (prev < num_pages ? prev + 1 : prev))
          }
          disabled={
            activePage >= Math.ceil(errorLogs.length / LOGS_PER_PAGE) - 1
          }
          style={{
            padding: "10px 20px",
            backgroundColor: "#2185d0",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ErrorLogs;
