CREATE TABLE archive (
    archive_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER,
    --delete during pull Request priority        INTEGER, -- how high a project should be displayed on clientside
    csv             TEXT,
    name        TEXT UNIQUE NOT NULL,
    dept        TEXT,
    start_date  TEXT,
    end_date    TEXT,
    title           TEXT, 
    team_name       TEXT,      
    members         TEXT, 
    sponsor         TEXT, 
    coach           TEXT, 
    poster_thumb    TEXT,   -- path to poster thumbnail
    poster_full     TEXT,   -- path to full resolution poster image 
    synopsis        TEXT,
    video           TEXT,   -- path to project video (if any)
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);