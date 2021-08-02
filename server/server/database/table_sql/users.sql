CREATE TABLE users (
    system_id   TEXT PRIMARY KEY NOT NULL UNIQUE,
    fname       TEXT,
    lname       TEXT,
    email       TEXT,
    type        TEXT,
    semester_group  INTEGER,
    project         TEXT,
    active          TEXT,   -- Empty string if active, Datetime of when deactivated if unactive
    FOREIGN KEY (semester_group) REFERENCES semester_group(semester_id),
    FOREIGN KEY (project) REFERENCES projects(project_id)
);
