INSERT INTO sponsor_notes (creation_date, update_date, note_content, sponsor, author, previous_note)
    VALUES
        (CURRENT_TIMESTAMP, NULL, 'This is a note', 1, 'adminA', NULL),
        (CURRENT_TIMESTAMP, NULL, 'This is a second note for sponsor 1', 1, 'adminA', NULL),
        (CURRENT_TIMESTAMP, NULL, 'This is a third note for sponsor 1 by coachA', 1, 'coachA', NULL),
        (CURRENT_TIMESTAMP, NULL, 'This is a note for sponsor 2 by coachA', 2, 'coachA', NULL)