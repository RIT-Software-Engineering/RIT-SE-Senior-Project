CREATE TABLE error_log (
    error_log_id       INTEGER PRIMARY KEY AUTOINCREMENT, -- internal id for this row
    error_datetime     DATETIME DEFAULT CURRENT_TIMESTAMP,
    status_code        INTEGER, -- error code
    user_role          TEXT,    -- role of the user that caused the error (if any)
    url                TEXT,    -- URL that caused the error
    stack_trace        TEXT    -- stack trace (if any)
);
