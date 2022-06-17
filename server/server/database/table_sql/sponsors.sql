CREATE TABLE sponsors (
    sponsor_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    fname       TEXT,
    lname       TEXT,
    company     TEXT,
    division    TEXT,
    email       TEXT,
    phone       TEXT,
    association TEXT,
    type        TEXT,
    notes       TEXT,
    inActive    INTEGER DEFAULT 0,
    doNotEmail  INTEGER DEFAULT 0
);