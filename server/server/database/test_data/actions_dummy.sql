INSERT INTO 
actions (
    semester, 
    action_title, 
    date_deleted, 
    short_desc, 
    action_target, 
    start_date, 
    due_date, 
    page_html,
    file_types
    )

VALUES
    (
        3,
        'Individual Test Form 1',
        '',
        'This is the first test form for individuals',
        'individual',
        '2019-08-27',
        '2019-09-07',
        '<h1>Take the individual test form</h1>
        <form class=\"ui form\" action=\"/db/submitAction\" method=\"POST\" enctype=\"multipart/form-data\">
            <label for=\"name\">Name</label>
            <input name=\"name\" type=\"text\"/>

            <label for=\"email\">Email</label>
            <input name=\"email\" type=\"text\"/>
            
        </form>
        ',
        '.png,.pdf,.jpg'
    ),
    (
        3, 
        'Report Submission', 
        '', 
        'Turn in your <b>interim</b> report',
        'team', 
        '2019-09-13',
        '2019-09-30',
        '<h1>Take the individual test form</h1>
        <form class=\"ui form\" action=\"/db/submitAction\" method=\"POST\" enctype=\"multipart/form-data\">
            <label for=\"name\">Name</label>
            <input name=\"name\" type=\"text\"/>

            <label for=\"email\">Email</label>
            <input name=\"email\" type=\"text\"/>
            
        </form>
        ',
        ''
    ),
    (
        3, 'Team Name Submission', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2019-10-13',
        '2019-10-30',
        '<h1>Take the individual test form</h1>
        <form class=\"ui form\" action=\"/db/submitAction\" method=\"POST\" enctype=\"multipart/form-data\">
            <label for=\"name\">Name</label>
            <input name=\"name\" type=\"text\"/>

            <label for=\"email\">Email</label>
            <input name=\"email\" type=\"text\"/>
            
        </form>
        ',
        '.png,.pdf,.jpg'
    ),
    (
        4,
        'Individual Test Form 1',
        '',
        'This is the first test form for individuals',
        'individual',
        '2020-08-07',
        '2020-08-10',
        '<h1>Take the individual test form</h1>
        <form class=\"ui form\" action=\"/db/submitAction\" method=\"POST\" enctype=\"multipart/form-data\">
            <label for=\"name\">Name</label>
            <input name=\"name\" type=\"text\"/>

            <label for=\"email\">Email</label>
            <input name=\"email\" type=\"text\"/>
            
        </form>
        ',
        ''
    ),
    (
        4, 
        'Report Submission', 
        '', 
        'Turn in your <b>interim</b> report',
        'team', 
        '2020-01-13',
        '2020-01-30',
        '<h1> Submit your interim report </h1>
        <form class=\"ui form\" action=\"/db/submitAction\" method=\"POST\" enctype=\"multipart/form-data\">
            <label for=\"report\">Report File</label>
            <input name=\"report\" type=\"file\"/>
        </form>
        ',
        '.png,.pdf,.jpg'
    ),
    (
        4, 'Team Name Submission', '', 'Come up <u>with</u> team name', 
        'team',
        '2020-01-13',
        '2020-01-30',
        '<h1>Take the individual test form</h1>
        <form class=\"ui form\" action=\"/db/submitAction\" method=\"POST\" enctype=\"multipart/form-data\">
            <label for=\"name\">Name</label>
            <input name=\"name\" type=\"text\"/>

            <label for=\"email\">Email</label>
            <input name=\"email\" type=\"text\"/>
            
        </form>
        ',
        ''
    )
;
