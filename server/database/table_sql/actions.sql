CREATE TABLE actions (
    action_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (semester) REFERENCES semester_group(semester_id),
    action_name     TEXT,
    is_null         INTEGER,
    short_desc      TEXT,
    long_desc       TEXT,
    action_target   TEXT,
    properties      TEXT
);