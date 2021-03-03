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
        "Individual Test Form 1",
        "0",
        "This is the first test form for individuals",
        "individual",
        "2019-8-27",
        "2019-9-7",
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
        "Report Submission", 
        "0", 
        "Turn in your <b>interim</b> report",
        "team", 
        "2019-9-13",
        "2019-9-30",
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
        3, "Team Name Submission", "0", 
        "Come up <u>with</u> team name", 
        "team",
        "2019-10-13",
        "2019-10-30",
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
        "Individual Test Form 1",
        "0",
        "This is the first test form for individuals",
        "individual",
        "2020-8-7",
        "2020-8-10",
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
        "Report Submission", 
        "0", 
        "Turn in your <b>interim</b> report",
        "team", 
        "2020-1-13",
        "2020-1-30",
        '<h1> Submit your interim report </h1>
        <form class=\"ui form\" action=\"/db/submitAction\" method=\"POST\" enctype=\"multipart/form-data\">
            <label for=\"report\">Report File</label>
            <input name=\"report\" type=\"file\"/>
        </form>
        ',
        '.png,.pdf,.jpg'
    ),
    (
        4, "Team Name Submission", "0", "Come up <u>with</u> team name", 
        "team",
        "2020-1-13",
        "2020-1-30",
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