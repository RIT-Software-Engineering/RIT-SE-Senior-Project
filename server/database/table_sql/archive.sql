CREATE TABLE archive (
    archive_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    priority        INTEGER, 
    title           TEXT, 
    team_name       TEXT,      
    members         TEXT, 
    sponsor         TEXT, 
    coach           TEXT, 
    poster_thumb    TEXT,
    poster_full     TEXT, 
    synopsis        TEXT,
    video           TEXT
);