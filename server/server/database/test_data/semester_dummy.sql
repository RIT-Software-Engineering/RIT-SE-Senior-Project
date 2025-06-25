INSERT INTO semester_group (name, dept, start_date, end_date)
VALUES
    (
        "Previous Year",
        'SE',
        DATE(strftime('%Y', DATE('now', '-1 years')) || '-01-01'),
        DATE(strftime('%Y', DATE('now', '-1 years')) || '-12-31')
    ),
    (
        "Current Year",
        'SE',
        DATE(strftime('%Y', DATE('now')) || '-01-01'),
        DATE(strftime('%Y', DATE('now')) || '-12-31')
    ),
    (
        "Future Year",
        'SE',
        DATE(strftime('%Y', DATE('now', '+1 years')) || '-01-01'),
        DATE(strftime('%Y', DATE('now', '+1 years')) || '-12-31')
    )
;
