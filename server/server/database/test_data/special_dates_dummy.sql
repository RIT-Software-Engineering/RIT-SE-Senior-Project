
INSERT INTO special_dates (date_on, name, duration) VALUES
    ('01-01', 'New Years Day', 1),
    ('06-19', 'Juneteenth', 1),
    ('07-04', 'Independence Day', 1),
    ('12-24', 'Christmas Eve', 1),
    ('12-25', 'Christmas Day', 1),
    ('12-26', 'St. Stephens Day', 1),
    ('12-31', 'New Years Eve', 1),
    (strftime('%m-%d', date('now', '+7 days')), 'Short break', 5);