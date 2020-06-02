INSERT INTO 
actions (
    semester, 
    action_title, 
    is_null, 
    short_desc, 
    action_target, 
    start_date, 
    due_date, 
    page_html
    )

VALUES
    (
        1,
        "Individual Test Form 1",
        0,
        "This is the first test form for individuals",
        "individual",
        "2019-8-27",
        "2019-9-7",
        "
        <h1>Take the individual test form</h1>
        <form>
            <label>Test question 1</label>
            <input name=""question1"" type=""text""/>
            <input type=""submit""/>
        </form>
        "
    ),
    (
        1, 
        "Report Submission", 
        0, 
        "Turn in your <b>interim</b> report",
         "team", 
        "2019-9-13",
        "2019-9-30",
        "<h1> Submit your interim report </h1>
        <form>
            <input type=""text""/>
        </form>
        "

    
    ),
    (
        1, "Team Name Submission", 0, "Come up <u>with</u> team name", 
        "team",
        "2019-10-13",
        "2019-10-30",
        "<h1> Submit a team name </h1>
        <form>
            <input type=""text""/>
        </form>
        "
    ),
    (
        2,
        "Individual Test Form 1",
        0,
        "This is the first test form for individuals",
        "individual",
        "2020-8-7",
        "2020-8-10",
        "
        <h1>Take the individual test form</h1>
        <form>
            <label>Test question 1</label>
            <input name=""question1"" type=""text""/>
            <input type=""submit""/>
        </form>
        "
    ),
    (
        2, 
        "Report Submission", 
        0, 
        "Turn in your <b>interim</b> report",
         "team", 
        "2020-1-13",
        "2020-1-30",
        "<h1> Submit your interim report </h1>
        <form>
            <input type=""text""/>
        </form>
        "

    
    ),
    (
        2, "Team Name Submission", 0, "Come up <u>with</u> team name", 
        "team",
        "2020-1-13",
        "2020-1-30",
        "<h1> Submit a team name </h1>
        <form>
            <input type=""text""/>
        </form>
        "
    )
    ;