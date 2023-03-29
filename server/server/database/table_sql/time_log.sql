CREATE TABLE time_log (
    time_log_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    semester        INTEGER NOT NULL,
    submission_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    system_id       TEXT NOT NULL,
    project         INTEGER NOT NULL,
    mock_id         TEXT,
    work_date       TEXT,
    time_amount     INTEGER,
    work_comment    TEXT,
    FOREIGN KEY (system_id) REFERENCES users(system_id),
    FOREIGN KEY (project) REFERENCES projects(project_id)
);