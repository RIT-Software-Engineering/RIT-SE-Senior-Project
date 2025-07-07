CREATE TABLE special_dates (
    date_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_on TEXT NOT NULL, -- Date in MM-DD format
    name TEXT NOT NULL, -- Name of the special date (e.g., "New Year's Day")
    duration INTEGER DEFAULT 1 -- Duration in days (default is 1 day)
);