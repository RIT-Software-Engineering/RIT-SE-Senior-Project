CREATE TABLE action_log (
    action_log_id       INTEGER PRIMARY KEY AUTOINCREMENT, -- internal id for this row
    submission_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    action_template INTEGER NOT NULL,                      -- the id of the template action this is formatted on
    system_id       TEXT NOT NULL,                         -- system ID of of user who submitted action
    mock_id         TEXT,                                  -- system ID of of user who submitted action on behalf of system_id
    project         INTEGER NOT NULL,               
    form_data       TEXT,
    files           TEXT,
    FOREIGN KEY (action_template) REFERENCES actions(action_id),
    FOREIGN KEY (system_id) REFERENCES users(system_id),
    FOREIGN KEY (project) REFERENCES projects(project_id)    
);
