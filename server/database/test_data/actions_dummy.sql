INSERT INTO actions (semester, action_name, 
is_null, short_desc, action_target, start_date, due_date, page_html)
VALUES

    (
        1, "Report Submission", 0, "Turn in your <b>interim</b> report",
         "team", 
        "2020-1-13","2020-1-30",
        "<question type="fileupload" properties=”sizelimit=200mb; extentions=doc,docx,pdf; multiple=true”>
            <qtext>Upload your tax forms here.</qtext>
        </question>"

    
    ),
    (
        1, "Team Name Submission", 0, "Come up <u>with</u> team name", 
        "team",
        "2020-1-13","2020-1-30",
        "<h1> Page Text </h1>
        <form>
            
        </form>
        "
    ),
    (),
    ;