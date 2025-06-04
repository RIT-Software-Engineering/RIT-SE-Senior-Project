INSERT INTO semester_group (name, dept, start_date, end_date)
VALUES
    ('2018-19 Fall / Spring', 'SE', '2018-08-27', '2019-05-08'),
    ('2019-19 Spring / Summer', 'SE', '2019-01-13', '2019-08-07'),
    ('2019-20 Fall / Spring', 'SE', '2024-05-27', '2024-08-08'),
    ('2024-24 Spring / Summer', 'SE', '2024-01-13', '2021-08-07'),
    ('2025-25 Spring / Summer', 'SE', DATE(DATE('now'), '-2 MONTHS'), DATE(DATE('now'), '+3.5 MONTHS')),
    ('2020-20 Fall', 'SE', '2020-08-27', '2020-12-21'),
    ('2020-20 Spring', 'SE', '2020-01-13', '2020-05-08'),    ('2021-21 Spring / Summer', 'SE', '2021-01-13', '2021-08-07'),
    ('2021-22 Fall / Spring', 'SE', '2021-01-13', '2022-05-08'),
    ('2023-24 Fall / Spring', 'SE', '2023-08-28', '2024-05-10'),
    ('2024 Spring / Summer', 'SE', '2024-01-15', '2024-08-09'),
    ('2024-25 Fall / Spring', 'SE', '2024-08-26', '2025-05-09')
;
