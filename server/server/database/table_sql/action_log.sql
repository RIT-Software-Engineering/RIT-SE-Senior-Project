CREATE TABLE action_log (
    action_log_id       INTEGER PRIMARY KEY AUTOINCREMENT, -- internal id for this row
    action_template INTEGER NOT NULL,                  -- the id of the template action this is formatted on
    system_id       INTEGER NOT NULL,                  -- system ID of executor 
    project         INTEGER NOT NULL,               
    form_data       BLOB,
    files           BLOB,
    FOREIGN KEY (action_template) REFERENCES actions(action_id),
    FOREIGN KEY (system_id) REFERENCES users(system_id),
    FOREIGN KEY (project) REFERENCES projects(project_id)    
);