CREATE TABLE users (
    system_id   INTEGER,
    fname       TEXT,
    lname       TEXT,
    email       TEXT,
    type        TEXT,
    FOREIGN KEY (semester_group) REFERENCES semester_group(semester_id),
    FOREIGN KEY (project) REFERENCEs project(project_id)
);