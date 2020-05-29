DROP TABLE users;

CREATE TABLE users (
    system_id   INTEGER PRIMARY KEY,
    fname       TEXT,
    lname       TEXT,
    email       TEXT,
    type        TEXT,
    semester_group  INTEGER,
    project         INTEGER,
    FOREIGN KEY (semester_group) REFERENCES semester_group(semester_id),
    FOREIGN KEY (project) REFERENCEs project(project_id)
);