CREATE TABLE project_coaches (
    project_id      TEXT,
    coach_id        TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (coach_id) REFERENCES users(system_id),
    UNIQUE(project_id, coach_id)
);
