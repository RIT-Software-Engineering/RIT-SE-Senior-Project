INSERT INTO sponsor_notes (creation_date, note_content, sponsor, author, mock_id, previous_note)
    VALUES
        (CURRENT_TIMESTAMP, 'Reached out to sponsor regarding upcoming event. Awaiting response.', 1, 'glados', NULL, NULL),
        (CURRENT_TIMESTAMP, 'Sponsor 1 confirmed participation in the spring fundraiser.', 1, 'glados', NULL, NULL),
        (CURRENT_TIMESTAMP, 'Updated note: Sponsor 1 requested additional event details.', 1, 'glados', NULL, 1),
        (CURRENT_TIMESTAMP, 'Further update: Sent event schedule to Sponsor 1.', 1, 'glados', NULL, 1),
        (CURRENT_TIMESTAMP, 'jod1234 met with Sponsor 1 to discuss partnership opportunities.', 1, 'jod1234', NULL, NULL),
        (CURRENT_TIMESTAMP, 'Sponsor 2 expressed interest in supporting the robotics team.', 2, 'jod1234', NULL, NULL),
        (CURRENT_TIMESTAMP, 'test from coach', 1, 'lam4821', NULL, NULL),
        (CURRENT_TIMESTAMP, 'test from admin mocking coach', 1, 'lam4821', 'glados', NULL),
        (CURRENT_TIMESTAMP, 'test', 1, 'glados', NULL, NULL)
        ;