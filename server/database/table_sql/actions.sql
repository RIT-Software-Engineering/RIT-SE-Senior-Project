DROP TABLE IF EXISTS actions;

CREATE TABLE actions (
    action_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    semester        INTEGER NOT NULL, 
    action_title    TEXT,   -- The title of the action
    is_null         INTEGER, -- 1 for true, used for calendar events, no-op events, etc
    short_desc      TEXT,
    start_date      TEXT,
    due_date        TEXT,
    page_html       TEXT,   -- HTML for the page of
    FOREIGN KEY (semester) REFERENCES semester_group(semester_id)
);