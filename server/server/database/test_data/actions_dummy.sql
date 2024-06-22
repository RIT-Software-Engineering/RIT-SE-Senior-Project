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
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="name">Name</label>
            <input name="name" type="text"/>

            <label for="email">Email</label>
            <input name="email" type="text"/>
       </form>
        ',
        '.png,.pdf,.jpg'
    ),
    (
        3,
        'Peer Evaluation Form',
        '',
        'Evaluate your team members',
        'peer_evaluation',
        '2024-05-13',
        '2024-09-30',
        '<h1>Peer Evaluation</h1>
          <form style="text-align: left;" class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <h2>Instructions</h2>
            <p>
              Rate every member of the team, including yourself, in each category on a scale of 1 to 5.
              <br />
              <br />
              <b>Cooperation and Attitude: </b>being motivated and interested in working on the project. Working harmoniously with others to meet group responsibilities.
              <br />
              <br />
              <b>Quantity of Work:</b> Comparing the actual work output of the team member to the project. Quality of Work: Demonstrating accuracy, completeness, and neatness of work.
              <br />
              <br />
              <b>Initiative:</b> Planning work and going ahead with a task without being told every detail. Willingness to add own ideas to the project.
              <br />
              <br />
              <b>Dependability:</b> Being relied upon and trusted to handle work assignments. Work is completed on time.
              <br />
              <br />
              <b>Group Maintenance:</b> Contributing to the effective functioning of the team, i.e., utilizing interpersonal skills to manage conflicts, giving and taking directions, and using appropriate management skills to meet project tasks.

              <br />
              <h2>Question Matrix Showcase</h2>
              <div>
              <QuestionTable questions=''["Cooperation and Attitude", "Quantity of Work", "Initiative"]''  students=''exampleStudents''/>
              </div>

              <br />
              <h2>Question Mood Ratings Showcase</h2>
              <div>
              <QuestionMoodRating
                  question="Dependability"
                  students=''exampleStudents''
                  levels=''["Not Dependable", "Somewhat Dependable", "Dependable", "Very Dependable", "Extremely Dependable"]''
                  required=''true''
              />
              </div>
              <br />
              <div>
              <QuestionMoodRating question="Group Maintenance" students=''exampleStudents'' />
              </div>

              <br />
              <br />
              <div>
              <QuestionFeedback title="Feedback" questions=''["Provide specific comments about any members or situations", "Identify disputes or problems that happened and how they were handled.", "Yap yap yap"]'' ordered students=''exampleStudents''/>
              </div>

              <div>
              <QuestionPeerFeedback questions=''["Cooperation and Attitude", "Quantity of Work", "Initiative"]'' students=''exampleStudents''  />
              </div>
            </p>
          </form>
    ',
        ''
    ),
    (
        3, 
        'Report Submission', 
        '', 
        'Turn in your interim report',
        'team', 
        '2019-09-13',
        '2019-09-30',
        '<h1>Take the individual test form</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="name">Name</label>
            <input name="name" type="text"/>

            <label for="email">Email</label>
            <input name="email" type="text"/>
            
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
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <div class="required field">
                <label for="name">Name</label>
                <input required name="name" type="text"/>
            </div>

            <div class="required field">
                <label for="email">Email</label>
                <input required name="email" type="text"/>
            </div>
            
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
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="name">Name</label>
            <input name="name" type="text"/>

            <div class="required field">
                <label for="email">Email</label>
                <input required name="email" type="text"/>
            </div>
            
        </form>
        ',
        ''
    ),
    (
        4, 
        'Report Submission', 
        '', 
        'Turn in your interim report',
        'team', 
        '2020-01-13',
        '2020-01-30',
        '<h1> Submit your interim report </h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="report">Report File</label>
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
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="name">Name</label>
            <input name="name" type="text"/>

            <label for="email">Email</label>
            <input name="email" type="text"/>
            
        </form>
        ',
        ''
    )
;
