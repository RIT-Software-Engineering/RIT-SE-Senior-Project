INSERT INTO sponsor_notes (creation_date, note_content, sponsor, author, mock_id, previous_note)
    VALUES
        (CURRENT_TIMESTAMP, 'Contacted sponsor regarding the upcoming project submission. Awaiting confirmation of the project requirements.', 1, 'glados', NULL, NULL),
        (CURRENT_TIMESTAMP, 'Sponsor confirmed the project submission and provided the initial project requirements', 1, 'glados', NULL, NULL),
        (CURRENT_TIMESTAMP, 'Updated note: Sponsor requested greater emphasis on accessibility and mobile support.', 1, 'glados', NULL, 1),
        (CURRENT_TIMESTAMP, 'Further update: Sponsor approved the revised scope after reviewing the proposed changes.', 1, 'glados', NULL, 1),
        (CURRENT_TIMESTAMP, 'Contacted sponsor regarding a new project submission and requested clarification on the technical requirements.', 1, 'jod1234', NULL, NULL),
        (CURRENT_TIMESTAMP, 'Sponsor provided additional project requirements and confirmed availability for a follow-up meeting.', 2, 'jod1234', NULL, NULL),
        (CURRENT_TIMESTAMP, 'Contacted sponsor to review the proposed project scope before submission.', 1, 'lam4821', NULL, NULL),
        (CURRENT_TIMESTAMP, 'Sponsor is happy with the team.', 1, 'lam4821', 'glados', NULL),
        (CURRENT_TIMESTAMP, 'Confirmed that sponsor feedback was recorded.', 1, 'glados', NULL, NULL)
        ;