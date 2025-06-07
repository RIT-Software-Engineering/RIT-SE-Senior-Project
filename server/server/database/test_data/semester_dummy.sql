INSERT INTO semester_group (name, dept, start_date, end_date)
VALUES
    (
        IFNULL(strftime('%Y', DATE('now', '-2 years')), '') || ' -' || IFNULL(strftime('%y', DATE('now', '-1 years')), '') || ' Fall / Spring',
        'SE',
        DATE(strftime('%Y', DATE('now', '-2 years')) || '-08-27'),
        DATE(strftime('%Y', DATE('now', '-1 years')) || '-05-08')
    ),
    (
        IFNULL(strftime('%Y', DATE('now', '-1 years')), '') || ' -' || IFNULL(strftime('%y', DATE('now', '-1 years')), '') || ' Spring / Summer',
        'SE',
        DATE(strftime('%Y', DATE('now', '-1 years')) || '-01-13'),
        DATE(strftime('%Y', DATE('now', '-1 years')) || '-08-07')
    ),
    (
        IFNULL(strftime('%Y', DATE('now', '-1 years')), '') || ' -' || IFNULL(strftime('%y', DATE('now', '-1 years')), '') || ' Fall',
        'SE',
        DATE(strftime('%Y', DATE('now', '-1 years')) || '-08-27'),
        DATE(strftime('%Y', DATE('now', '-1 years')) || '-12-21')
    ),
    (
        IFNULL(strftime('%Y', DATE('now')), '') || ' -' || IFNULL(strftime('%y', DATE('now')), '') || ' Spring / Summer',
        'SE',
        DATE(strftime('%Y', DATE('now')) || '-01-13'),
        DATE(strftime('%Y', DATE('now')) || '-08-07')
    ),
    (
        IFNULL(strftime('%Y', DATE('now')), '') || ' -' || IFNULL(strftime('%y', DATE('now', '+1 years')), '') || ' Fall / Spring',
        'SE',
        DATE(strftime('%Y', DATE('now')) || '-08-28'),
        DATE(strftime('%Y', DATE('now', '+1 years')) || '-05-10')
    )
;
