CREATE TABLE audit_log (
    audit_log_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    audit_datetime  DATETIME DEFAULT CURRENT_TIMESTAMP,
    system_id       TEXT,
    mock_id         TEXT,
    action_type     TEXT NOT NULL,
    entity_type     TEXT NOT NULL,
    entity_id       TEXT,
    message         TEXT NOT NULL,
    details         TEXT,
    FOREIGN KEY (system_id) REFERENCES users(system_id)
);
