INSERT INTO
    audit_log (
        audit_datetime,
        system_id,
        mock_id,
        action_type,
        entity_type,
        entity_id,
        message,
        details_json
    )
VALUES
    (
        DATETIME(DATE('now', '-6 days'), '09:15:00'),
        'glados',
        NULL,
        'CREATED',
        'action',
        '45',
        'Admin Account (glados) created action 45 (Team Name Submission)',
        '{"semester":"2","action_title":"Team Name Submission","action_target":"team","start_date":"2026-01-20","due_date":"2026-02-01"}'
    ),
    (
        DATETIME(DATE('now', '-5 days'), '13:42:10'),
        'glados',
        NULL,
        'UPDATED',
        'action',
        '45',
        'Admin Account (glados) updated action 45 (Team Name Submission) — Due Date: "2026-02-01" → "2026-02-05"',
        '{"due_date":["2026-02-01","2026-02-05"]}'
    ),
    (
        DATETIME(DATE('now', '-4 days'), '17:10:44'),
        'glados',
        NULL,
        'DEACTIVATED',
        'action',
        '45',
        'Admin Account (glados) deactivated action 45 (Team Name Submission)',
        '{}'
    ),
    (
        DATETIME(DATE('now', '-3 days'), '08:05:22'),
        'glados',
        NULL,
        'REACTIVATED',
        'action',
        '45',
        'Admin Account (glados) reactivated action 45 (Team Name Submission)',
        '{}'
    ),
    (
        DATETIME(DATE('now', '-2 days'), '11:30:00'),
        'glados',
        NULL,
        'UPDATED',
        'project',
        '1_groweasy',
        'Admin Account (glados) updated project 1_groweasy (GrowEasy) — Contact Email: "rachel.thompson@mail.com" → "rachel.thompson@mail.edu"',
        '{"contact_email":["rachel.thompson@mail.com","rachel.thompson@mail.edu"]}'
    );
