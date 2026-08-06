import React, { useState, useEffect } from "react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";
import { formatDateTime } from "../../util/functions/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Dropdown,
  Input,
  Button,
} from "semantic-ui-react";
import "../../../css/components/tabs/auditlogs.css";

const LOGS_PER_PAGE = 20;

const TYPE_OPTIONS = [
  { key: "all", value: "", text: "All" },
  { key: "create", value: "CREATE", text: "Create" },
  { key: "update", value: "UPDATE", text: "Update" },
  { key: "delete", value: "DELETE", text: "Delete" },
  { key: "deactivate", value: "DEACTIVATE", text: "Deactivate" },
  { key: "reactivate", value: "REACTIVATE", text: "Reactivate" },
];

const CATEGORY_OPTIONS = [
  { key: "all", value: "", text: "All" },
  { key: "semester", value: "semester", text: "Semester" },
  { key: "action", value: "action", text: "Action" },
  {
    key: "action_submission",
    value: "action_submission",
    text: "Action Submission",
  },
  { key: "project", value: "project", text: "Project" },
  { key: "archive", value: "archive", text: "Archive" },
  { key: "user", value: "user", text: "User" },
  { key: "sponsor", value: "sponsor", text: "Sponsor" },
  { key: "time_log", value: "time_log", text: "Time Log" },
  { key: "error_log", value: "error_log", text: "Error Log" },
];

const humanizeUnderscored = (value) => {
  if (!value) return "";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const getAuditLogs = () => {
    const params = new URLSearchParams({
      resultLimit: LOGS_PER_PAGE,
      offset: activePage,
    });
    if (type) params.append("action_type", type);
    if (category) params.append("entity_type", category);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (search) params.append("search", search);

    const apiUrl = `${config.url.API_GET_AUDIT_LOGS}/?${params.toString()}`;
    SecureFetch(apiUrl)
      .then((response) => response.json())
      .then((logs) => {
        setAuditLogs(logs);
      })
      .catch((error) => {
        console.error("Failed to get audit log data", error);
      });
  };

  useEffect(() => {
    getAuditLogs();
  }, [activePage, type, category, startDate, endDate, search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActivePage(0);
      setSearch(searchInput);
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleFilterChange = (setter) => (value) => {
    setActivePage(0);
    setter(value);
  };

  const clearFilters = () => {
    setActivePage(0);
    setType("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setSearch("");
    setSearchInput("");
  };

  const formatActor = (log) => {
    if (log.mock_id) return `${log.mock_id} (as ${log.system_id})`;
    return log.system_id || "N/A";
  };

  const hasNextPage = auditLogs.length === LOGS_PER_PAGE;

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Audit Logs</h1>

      <div className="audit-logs-filter-bar">
        <div className="audit-logs-filter-field">
          <label>Type</label>
          <Dropdown
            selection
            placeholder="All"
            options={TYPE_OPTIONS}
            value={type}
            onChange={(e, { value }) => handleFilterChange(setType)(value)}
          />
        </div>
        <div className="audit-logs-filter-field">
          <label>Category</label>
          <Dropdown
            selection
            placeholder="All"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e, { value }) => handleFilterChange(setCategory)(value)}
          />
        </div>
        <div className="audit-logs-filter-field">
          <label>Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => handleFilterChange(setStartDate)(e.target.value)}
          />
        </div>
        <div className="audit-logs-filter-field">
          <label>End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => handleFilterChange(setEndDate)(e.target.value)}
          />
        </div>
        <div className="audit-logs-filter-field audit-logs-filter-search">
          <label>Search</label>
          <Input
            icon="search"
            placeholder="Search by actor or keyword..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button className="audit-logs-clear-filters" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      <Table celled striped selectable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Timestamp</TableHeaderCell>
            <TableHeaderCell>Actor</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Message</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs && auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <TableRow key={log.audit_log_id}>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  {formatDateTime(log.audit_datetime)}
                </TableCell>
                <TableCell>{formatActor(log)}</TableCell>
                <TableCell>{humanizeUnderscored(log.action_type)}</TableCell>
                <TableCell>{humanizeUnderscored(log.entity_type)}</TableCell>
                <TableCell>{log.message}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} style={{ textAlign: "center" }}>
                No audit log entries found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="audit-logs-pagination">
        <Button
          onClick={() => setActivePage((prev) => Math.max(prev - 1, 0))}
          disabled={activePage === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setActivePage((prev) => (hasNextPage ? prev + 1 : prev))
          }
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AuditLogs;
