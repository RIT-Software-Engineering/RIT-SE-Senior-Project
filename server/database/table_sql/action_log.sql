CREATE TABLE action_log (
    FOREIGN KEY (action_id) REFERENCES actions(action_id),
    FOREIGN KEY (system_id) REFERENCES users(system_id),
    FOREIGN KEY (project) REFERENCES projects(project_id),
    form_data   BLOB,
    files       BLOB    
);