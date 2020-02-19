CREATE TABLE sponsor_info (
    sponsorId   INTEGER AUTOINCREMENT,
    company     TEXT PRIMARY KEY NOT NULL,
    division    TEXT,
    type        TEXT,
    fname       TEXT,
    lname       TEXT,
    email       TEXT,
    phone       TEXT,
    association TEXT,
    notes       TEXT
);