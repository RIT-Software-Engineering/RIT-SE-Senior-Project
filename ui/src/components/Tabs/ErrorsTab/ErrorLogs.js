import React, { useState, useContext, useEffect } from "react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config, USERTYPES } from "../../util/functions/constants";
import { UserContext } from "../../util/functions/UserContext";

const LOGS_PER_PAGE = 20;

const ErrorLogs = () => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [errorLogCount, setErrorLogCount] = useState(LOGS_PER_PAGE);
  const [activePage, setActivePage] = useState(0);
  const userContext = useContext(UserContext);

  const getErrorLogs = () => {
    const apiUrl = `${config.url.API_GET_ALL_ERROR_LOGS}/?resultLimit=${LOGS_PER_PAGE}&offset=${activePage}`;
    SecureFetch(apiUrl)
      .then((response) => response.json())
      .then((error_logs) => {
        console.log(error_logs);
        setErrorLogs(error_logs);
        setErrorLogCount(error_logs.length);
        console.log(errorLogs);
      })
      .catch((error) => {
        alert("Failed to get error log data: " + error);
      });
  };

  useEffect(() => {
    getErrorLogs();
  }, [activePage]);

  return (
    <div>
      <h1>Error Logs</h1>
      <table>
        <thead>
          <tr>
            <th>Error ID</th>
            <th>Date/Time</th>
            <th>Status Code</th>
            <th>User Role</th>
            <th>URL</th>
            <th>Stack Trace</th>
          </tr>
        </thead>
        <tbody>
          {errorLogs && errorLogs.length > 0 ? (
            errorLogs.map((log) => (
              <tr key={log.error_log_id}>
                <td>{log.error_log_id}</td>
                <td>{log.error_datetime}</td>
                <td>{log.status_code}</td>
                <td>{log.user_role || "N/A"}</td>
                <td>{log.url}</td>
                <td>
                  <pre>{log.stack_trace || "N/A"}</pre>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No error logs available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => setActivePage((prev) => Math.max(prev - 1, 0))}
          disabled={activePage === 0}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setActivePage((prev) =>
              prev < Math.ceil(errorLogCount / LOGS_PER_PAGE) - 1
                ? prev + 1
                : prev,
            )
          }
          disabled={activePage >= Math.ceil(errorLogCount / LOGS_PER_PAGE) - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ErrorLogs;
