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
        'Action 1',
        '',
        'This is the first test form for individuals',
        'individual',
        DATE(DATE('now'), '-2 YEARS'),
        DATE(DATE('now'), '-1.5 YEARS'),
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
        DATE(DATE('now'), '-2 YEARS'),
        DATE(DATE('now'), '-1.5 YEARS'),
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

              <h2>Question Matrix Showcase</h2>
                <div>
                <QuestionTable questions=''["Cooperation and Attitude","Quantity of Work","Initiative"]'' scale=''5'' required=''false'' icon=''default'' selfFeedback=''false'' includeStudents=''true''/>
                </div>
                <br/>
                <h2>Question Mood Ratings Showcase</h2>
                <div>
                <QuestionMoodRating question="Dependability" levels=''["Not Dependable","Somewhat Dependable","Dependable","Very Dependable","Extremely Dependable"]'' required=''true'' selfFeedback=''false'' includeStudents=''true''/>
                </div>
                <br/>
                <div>
                <QuestionMoodRating question="Group Maintenance" levels=''["Extremely Dissatisfied","Dissatisfied","Neutral","Satisfied","Extremely Satisfied"]'' required=''false'' selfFeedback=''false'' includeStudents=''true''/>
                </div>
                <br/>
                <div>
                <QuestionFeedback title="Feedback" questions=''["Provide specific comments about any members or situations","Identify disputes or problems that happened and how they were handled.","Yap yap yap"]'' ordered=''true'' required=''false'' includeStudents=''false'' selfFeedback=''false'' />
                </div>
                <br/>
                <div>
                <QuestionPeerFeedback title="Question Title" questions=''["Cooperation and Attitude","Quantity of Work","Initiative"]'' required=''true'' selfFeedback=''false'' includeStudents=''true''/>
                </div>
                <br/>

            </p>
          </form>
    ',
        ''
    ),
    (
        3, 
        'Action 2', 
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
        3, 'Action 3', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2019-09-22',
        '2019-10-31',
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
        3, 'Action 4', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2019-11-05',
        '2019-11-15',
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
        3, 'Action 5', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2019-11-09',
        '2019-11-20',
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
        3, 'Action 6', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2019-11-13',
        '2019-11-25',
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
        3, 'Action 7', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2019-11-25',
        '2019-12-17',
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
        3, 'Action 8', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2020-01-17',
        '2020-01-28',
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
        3, 'Action 9', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2020-01-25',
        '2020-02-16',
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
        3, 'Action 10', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2020-01-25',
        '2020-02-18',
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
        3, 'Action 11', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2020-02-16',
        '2020-03-06',
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
        3, 'Action 12', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2020-03-03',
        '2020-04-14',
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
        3, 'Action 13', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2020-03-16',
        '2020-04-18',
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
        3, 'Action 14', '', 
        'Come up <u>with</u> team name', 
        'team',
        '2020-04-04',
        '2020-04-20',
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
        3, 'Action 3', '', 
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
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+1 MONTHS'),
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
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+1 MONTHS'),
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
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+1 MONTHS'),
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
        4, 'Action 3', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+1 MONTHS'),
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
        4, 'Action 4', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+1 MONTHS'),
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
        4, 'Action 5', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+1 MONTHS'),
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
        4, 'Action 6', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+1.1 MONTHS'),
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
        4, 'Action 7', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+1 MONTHS'),
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
        4, 'Action 8', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+1 MONTHS'),
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
        4, 'Action 9', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '-0.5 MONTHS'),
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
        4, 'Action 10', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now')),
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
        4, 'Action 11', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now')),
        DATE(DATE('now')),
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
        4, 'Action 12', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '-1 MONTHS'),
        DATE(DATE('now'), '+3 MONTHS'),
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
        4, 'Action 13', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '+2 MONTHS'),
        DATE(DATE('now'), '+3 MONTHS'),
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
        4, 'Action 14', '', 
        'Come up <u>with</u> team name', 
        'team',
        DATE(DATE('now'), '+3 MONTHS'),
        DATE(DATE('now'), '+3 MONTHS'),
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
    )
;
