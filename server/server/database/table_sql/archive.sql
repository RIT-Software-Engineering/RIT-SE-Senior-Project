CREATE TABLE archive (
    archive_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER,
    priority        INTEGER DEFAULT 0, -- how high a project should be displayed on client side
    csv             TEXT,
    name            TEXT UNIQUE NOT NULL,
    dept            TEXT,
    start_date      TEXT,
    end_date        TEXT,
    featured        INTEGER DEFAULT 0, -- 1 = featured in HomePage
    outstanding     INTEGER DEFAULT 0, -- adds "outstanding" trophy on project
    creative        INTEGER DEFAULT 0, -- adds "creative" trophy on project
    title           TEXT, 
    team_name       TEXT,      
    members         TEXT, 
    sponsor         TEXT, 
    coach           TEXT, 
    poster_thumb    TEXT,   -- path to poster thumbnail
    poster_full     TEXT,   -- path to full resolution poster image 
    synopsis        TEXT,
    keywords        TEXT,
    url_slug        TEXT,   -- unique project url
    video           TEXT,   -- path to project video (if any)
    inactive        TEXT DEFAULT '' NOT NULL,   -- Empty string if active, Datetime of when deactivated if inactive
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);