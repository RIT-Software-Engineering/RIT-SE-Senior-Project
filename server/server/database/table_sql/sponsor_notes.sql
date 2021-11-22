CREATE TABLE sponsor_notes (
    sponsor_note_id INTEGER PRIMARY KEY AUTOINCREMENT,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME DEFAULT NULL,
    note_content TEXT,
    sponsor INTEGER,
    author TEXT,
    previous_note INTEGER,
    FOREIGN KEY (sponsor) REFERENCES sponsors(sponsor_id),
    FOREIGN KEY (author) REFERENCES user(system_id),
    FOREIGN KEY (previous_note) REFERENCES sponsor_notes(sponsor_note_id)
);