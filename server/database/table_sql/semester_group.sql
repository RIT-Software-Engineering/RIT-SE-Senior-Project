CREATE TABLE semester_group (
    semester_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT UNIQUE NOT NULL,
    dept        TEXT,
    start_date  TEXT,
    end_date    TEXT
);