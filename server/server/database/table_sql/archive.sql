CREATE TABLE archive (
    archive_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER,
    --delete this line during pull Request priority        INTEGER, -- how high a project should be displayed on clientside
    csv             TEXT,
    name            TEXT UNIQUE NOT NULL,
    dept            TEXT,
    start_date      TEXT,
    end_date        TEXT,
    featured        INTEGER DEFAULT 0,
    outstanding     INTEGER DEFAULT 0,
    creative        INTEGER DEFAULT 0,
    title           TEXT, 
    team_name       TEXT,      
    members         TEXT, 
    sponsor         TEXT, 
    coach           TEXT, 
    poster_thumb    TEXT,   -- path to poster thumbnail
    poster_full     TEXT,   -- path to full resolution poster image 
    synopsis        TEXT,
    keywords        TEXT,
    video           TEXT,   -- path to project video (if any)
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);