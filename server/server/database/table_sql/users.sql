CREATE TABLE users (
    system_id   TEXT PRIMARY KEY NOT NULL UNIQUE,
    fname       TEXT,
    lname       TEXT,
    email       TEXT,
    type        TEXT,
    semester_group  INTEGER,
    project         INTEGER,
    active          BOOL,
    FOREIGN KEY (semester_group) REFERENCES semester_group(semester_id),
    FOREIGN KEY (project) REFERENCEs project(project_id)
);