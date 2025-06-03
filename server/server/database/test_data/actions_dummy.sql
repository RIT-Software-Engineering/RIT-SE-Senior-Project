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
        3, 'Initiate Project Brief', '', 
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
        '2024-05-06',
        '2024-05-20',
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
        '2024-05-13',
        '2024-05-27',
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
        '2024-05-20',
        '2024-06-03',
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
        4, 'Action 3', '', 'Come up <u>with</u> team name', 'team', '2024-06-03', '2024-06-17',
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
        4, 'Action 4', '', 'Come up <u>with</u> team name', 'team', '2024-06-10', '2024-06-24',
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
        4, 'Action 5', '', 'Come up <u>with</u> team name', 'team', '2024-06-17', '2024-07-01',
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
        4, 'Action 6', '', 'Come up <u>with</u> team name', 'team', '2024-06-24', '2024-07-08',
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
        4, 'Action 7', '', 'Come up <u>with</u> team name', 'team', '2024-07-01', '2024-07-15',
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
        4, 'Action 8', '', 'Come up <u>with</u> team name', 'team', '2024-07-08', '2024-07-22',
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
        4, 'Initiate Project Name', '', 'Come up <u>with</u> team name', 'team', '2024-07-15', '2024-07-29',
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
        4, 'Action 10', '', 'Come up <u>with</u> team name', 'team', '2024-07-22', '2024-07-22',
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
        4, 'Action 11', '', 'Come up <u>with</u> team name', 'team', '2024-07-29', '2024-07-29',
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
        4, 'Action 12', '', 'Come up <u>with</u> team name', 'team', '2024-07-29', '2024-10-29',
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
        4, 'Action 13', '', 'Come up <u>with</u> team name', 'team', '2024-08-29', '2024-10-29',
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
        4, 'Action 14', '', 'Come up <u>with</u> team name', 'team', '2024-09-29', '2024-09-29',
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
        5,
        'Initiate Project Brief',
        '',
        'Initiation & Planning: Initiate Project Brief',
        'general',
        -- starts one month before now
        DATE(DATE('now'), '-1 MONTH'),
        -- ends one day later
        DATE(DATE('now'), '-1 MONTH', '+1 DAYS'),
        '<h1>Initiate Project Brief</h1><p>Define project goals and scope.</p>',
        ''
    ),
    (
        5,
        'Conduct Stakeholder Alignment',
        '',
        'Initiation & Planning: Conduct Stakeholder Alignment',
        'general',
        -- starts the day after the previous due_date
        DATE(DATE('now'), '-1 MONTH', '+1 DAYS'),
        -- runs one more day
        DATE(DATE('now'), '-1 MONTH', '+2 DAYS'),
        '<h1>Conduct Stakeholder Alignment</h1><p>Meet with stakeholders to align objectives.</p>',
        ''
    ),
    (
        5,
        'Sign Confidentiality Agreement',
        '',
        'Initiation & Planning: Sign Confidentiality Agreement',
        'general',
        DATE(DATE('now'), '+2 DAYS'),
        DATE(DATE('now'), '+9 DAYS'),
        '<h1>Sign Confidentiality Agreement</h1>
        <p>Agree on confidentiality terms.</p>',
        ''
    ),
    (
        5,
        'Define Team Structure & Roles',
        '',
        'Initiation & Planning: Define Team Structure & Roles',
        'general',
        DATE(DATE('now'), '+3 DAYS'),
        DATE(DATE('now'), '+10 DAYS'),
        '<h1>Define Team Structure & Roles</h1>
        <p>Assign team roles and responsibilities.</p>',
        ''
    ),
    (
        5,
        'Kickoff Meeting Coordination',
        '',
        'Initiation & Planning: Kickoff Meeting Coordination',
        'general',
        DATE(DATE('now'), '+4 DAYS'),
        DATE(DATE('now'), '+11 DAYS'),
        '<h1>Kickoff Meeting Coordination</h1>
        <p>Schedule and prepare kickoff meeting.</p>',
        ''
    ),
    (
        5,
        'Set Up Project Workspace/Tools',
        '',
        'Initiation & Planning: Set Up Project Workspace/Tools',
        'general',
        DATE(DATE('now'), '+5 DAYS'),
        DATE(DATE('now'), '+12 DAYS'),
        '<h1>Set Up Project Workspace/Tools</h1>
        <p>Configure development environment.</p>',
        ''
    ),
    (
        5,
        'Establish Communication Protocols',
        '',
        'Initiation & Planning: Establish Communication Protocols',
        'general',
        DATE(DATE('now'), '+6 DAYS'),
        DATE(DATE('now'), '+13 DAYS'),
        '<h1>Establish Communication Protocols</h1>
        <p>Define channels and cadences.</p>',
        ''
    ),
    (
        5,
        'Develop Initial Project Roadmap',
        '',
        'Initiation & Planning: Develop Initial Project Roadmap',
        'general',
        DATE(DATE('now'), '+7 DAYS'),
        DATE(DATE('now'), '+14 DAYS'),
        '<h1>Develop Initial Project Roadmap</h1>
        <p>Create timeline of milestones.</p>',
        ''
    ),
    (
        5,
        'Approve Project Charter',
        '',
        'Initiation & Planning: Approve Project Charter',
        'general',
        DATE(DATE('now'), '+8 DAYS'),
        DATE(DATE('now'), '+15 DAYS'),
        '<h1>Approve Project Charter</h1>
        <p>Obtain formal approval for project charter.</p>',
        ''
    ),
    (
        5,
        'Finalize Toolchain & Workflow',
        '',
        'Execution & Development: Finalize Toolchain & Workflow',
        'general',
        DATE(DATE('now'), '+9 DAYS'),
        DATE(DATE('now'), '+16 DAYS'),
        '<h1>Finalize Toolchain & Workflow</h1>
        <p>Lock in tools and processes.</p>',
        ''
    ),
    (
        5,
        'Draft Functional Requirements',
        '',
        'Execution & Development: Draft Functional Requirements',
        'general',
        DATE(DATE('now'), '+10 DAYS'),
        DATE(DATE('now'), '+17 DAYS'),
        '<h1>Draft Functional Requirements</h1>
        <p>Document key functionalities.</p>',
        ''
    ),
    (
        5,
        'Create System Architecture Plan',
        '',
        'Execution & Development: Create System Architecture Plan',
        'general',
        DATE(DATE('now'), '+11 DAYS'),
        DATE(DATE('now'), '+18 DAYS'),
        '<h1>Create System Architecture Plan</h1>
        <p>Outline system components.</p>',
        ''
    ),
    (
        5,
        'Develop Methodology Guidelines',
        '',
        'Execution & Development: Develop Methodology Guidelines',
        'general',
        DATE(DATE('now'), '+12 DAYS'),
        DATE(DATE('now'), '+19 DAYS'),
        '<h1>Develop Methodology Guidelines</h1>
        <p>Define development standards.</p>',
        ''
    ),
    (
        5,
        'Establish Key Performance Metrics',
        '',
        'Execution & Development: Establish Key Performance Metrics',
        'general',
        DATE(DATE('now'), '+13 DAYS'),
        DATE(DATE('now'), '+20 DAYS'),
        '<h1>Establish Key Performance Metrics</h1>
        <p>Agree on success metrics.</p>',
        ''
    ),
    (
        5,
        'Build Domain/Data Models',
        '',
        'Execution & Development: Build Domain/Data Models',
        'general',
        DATE(DATE('now'), '+14 DAYS'),
        DATE(DATE('now'), '+21 DAYS'),
        '<h1>Build Domain/Data Models</h1>
        <p>Design data schemas.</p>',
        ''
    ),
    (
        5,
        'Implement Initial Features/Modules',
        '',
        'Execution & Development: Implement Initial Features/Modules',
        'general',
        DATE(DATE('now'), '+15 DAYS'),
        DATE(DATE('now'), '+22 DAYS'),
        '<h1>Implement Initial Features/Modules</h1>
        <p>Start development sprint.</p>',
        ''
    ),
    (
        5,
        'Conduct Weekly Progress Check-ins',
        '',
        'Execution & Development: Conduct Weekly Progress Check-ins',
        'general',
        DATE(DATE('now'), '+16 DAYS'),
        DATE(DATE('now'), '+23 DAYS'),
        '<h1>Conduct Weekly Progress Check-ins</h1>
        <p>Review weekly status.</p>',
        ''
    ),
    (
        5,
        'Submit Interim Progress Report',
        '',
        'Review & Evaluation: Submit Interim Progress Report',
        'general',
        DATE(DATE('now'), '+17 DAYS'),
        DATE(DATE('now'), '+24 DAYS'),
        '<h1>Submit Interim Progress Report</h1>
        <p>Provide interim status update.</p>',
        ''
    ),
    (
        5,
        'Schedule Midpoint Retrospective',
        '',
        'Review & Evaluation: Schedule Midpoint Retrospective',
        'general',
        DATE(DATE('now'), '+18 DAYS'),
        DATE(DATE('now'), '+25 DAYS'),
        '<h1>Schedule Midpoint Retrospective</h1>
        <p>Plan mid-project review.</p>',
        ''
    ),
    (
        5,
        'Conduct Sponsor Feedback Session',
        '',
        'Review & Evaluation: Conduct Sponsor Feedback Session',
        'general',
        DATE(DATE('now'), '+20 DAYS'),
        DATE(DATE('now'), '+27 DAYS'),
        '<h1>Conduct Sponsor Feedback Session</h1>
        <p>Gather sponsor input.</p>',
        ''
    ),
    (
        5,
        'Compile Lessons Learned Document',
        '',
        'Review & Evaluation: Compile Lessons Learned Document',
        'general',
        DATE(DATE('now'), '+21 DAYS'),
        DATE(DATE('now'), '+28 DAYS'),
        '<h1>Compile Lessons Learned Document</h1>
        <p>Document key learnings.</p>',
        ''
    ),
    (
        5,
        'Review Quality Assurance Findings',
        '',
        'Review & Evaluation: Review Quality Assurance Findings',
        'general',
        DATE(DATE('now'), '+22 DAYS'),
        DATE(DATE('now'), '+29 DAYS'),
        '<h1>Review Quality Assurance Findings</h1>
        <p>Analyze QA results.</p>',
        ''
    ),
    (
        5,
        'Prepare Technical Documentation',
        '',
        'Documentation & Reporting: Prepare Technical Documentation',
        'general',
        DATE(DATE('now'), '+24 DAYS'),
        DATE(DATE('now'), '+31 DAYS'),
        '<h1>Prepare Technical Documentation</h1>
        <p>Create API and system docs.</p>',
        ''
    ),
    (
        5,
        'Draft Business/Market Analysis',
        '',
        'Documentation & Reporting: Draft Business/Market Analysis',
        'general',
        DATE(DATE('now'), '+25 DAYS'),
        DATE(DATE('now'), '+32 DAYS'),
        '<h1>Draft Business/Market Analysis</h1>
        <p>Analyze market context.</p>',
        ''
    ),
    (
        5,
        'Submit Final Project Report',
        '',
        'Documentation & Reporting: Submit Final Project Report',
        'general',
        DATE(DATE('now'), '+27 DAYS'),
        DATE(DATE('now'), '+34 DAYS'),
        '<h1>Submit Final Project Report</h1>
        <p>Deliver final project report.</p>',
        ''
    ),
    (
        5,
        'Submit Grading/Evaluation Worksheets',
        '',
        'Closure & Feedback: Submit Grading/Evaluation Worksheets',
        'general',
        DATE(DATE('now'), '+39 DAYS'),
        DATE(DATE('now'), '+2 MONTH'),
        '<h1>Submit Grading/Evaluation Worksheets</h1>
        <p>Provide grading worksheets.</p>',
        ''
    ),
    (
        5,
        'Prepare Technical Documentation',
        '',
        'Documentation & Reporting: Prepare Technical Documentation',
        'general',
        DATE(DATE('now'), '+24 DAYS'),
        DATE(DATE('now'), '+31 DAYS'),
        '<h1>Prepare Technical Documentation</h1>
        <p>Create API and system docs.</p>',
        ''
    ),
    (
        5,
        'Draft Business/Market Analysis',
        '',
        'Documentation & Reporting: Draft Business/Market Analysis',
        'general',
        DATE(DATE('now'), '+25 DAYS'),
        DATE(DATE('now'), '+32 DAYS'),
        '<h1>Draft Business/Market Analysis</h1>
        <p>Analyze market context.</p>',
        ''
    ),
    (
        5,
        'Create Project Poster/One-Pager',
        '',
        'Documentation & Reporting: Create Project Poster/One-Pager',
        'general',
        DATE(DATE('now'), '+26 DAYS'),
        DATE(DATE('now'), '+33 DAYS'),
        '<h1>Create Project Poster/One-Pager</h1>
        <p>Design project summary poster.</p>',
        ''
    ),
    (
        5,
        'Submit Final Project Report',
        '',
        'Documentation & Reporting: Submit Final Project Report',
        'general',
        DATE(DATE('now'), '+27 DAYS'),
        DATE(DATE('now'), '+34 DAYS'),
        '<h1>Submit Final Project Report</h1>
        <p>Deliver final project report.</p>',
        ''
    ),
    (
        5,
        'Upload Final Presentation Materials',
        '',
        'Documentation & Reporting: Upload Final Presentation Materials',
        'general',
        DATE(DATE('now'), '+28 DAYS'),
        DATE(DATE('now'), '+35 DAYS'),
        '<h1>Upload Final Presentation Materials</h1>
        <p>Share slides and videos.</p>',
        ''
    ),
    (
        5,
        'Plan Stakeholder Demo Event',
        '',
        'Presentation & Outreach: Plan Stakeholder Demo Event',
        'general',
        DATE(DATE('now'), '+29 DAYS'),
        DATE(DATE('now'), '+36 DAYS'),
        '<h1>Plan Stakeholder Demo Event</h1>
        <p>Organize demo logistics.</p>',
        ''
    ),
    (
        5,
        'Record Project Overview Video',
        '',
        'Presentation & Outreach: Record Project Overview Video',
        'general',
        DATE(DATE('now'), '+30 DAYS'),
        DATE(DATE('now'), '+37 DAYS'),
        '<h1>Record Project Overview Video</h1>
        <p>Capture project walkthrough.</p>',
        ''
    ),
    (
        5,
        'Deliver Midterm Presentation',
        '',
        'Presentation & Outreach: Deliver Midterm Presentation',
        'general',
        DATE(DATE('now'), '+31 DAYS'),
        DATE(DATE('now'), '+38 DAYS'),
        '<h1>Deliver Midterm Presentation</h1>
        <p>Present interim results.</p>',
        ''
    ),
    (
        5,
        'Deliver Final Project Presentation',
        '',
        'Presentation & Outreach: Deliver Final Project Presentation',
        'general',
        DATE(DATE('now'), '+32 DAYS'),
        DATE(DATE('now'), '+39 DAYS'),
        '<h1>Deliver Final Project Presentation</h1>
        <p>Showcase final成果(chinese mix!)</p>',
        ''
    ),
    (
        5,
        'Submit for Awards/Recognition',
        '',
        'Presentation & Outreach: Submit for Awards/Recognition',
        'general',
        DATE(DATE('now'), '+33 DAYS'),
        DATE(DATE('now'), '+40 DAYS'),
        '<h1>Submit for Awards/Recognition</h1>
        <p>Nominate project for awards.</p>',
        ''
    ),
    (
        5,
        'Submit Final Peer Evaluations',
        '',
        'Closure & Feedback: Submit Final Peer Evaluations',
        'general',
        DATE(DATE('now'), '+34 DAYS'),
        DATE(DATE('now'), '+41 DAYS'),
        '<h1>Submit Final Peer Evaluations</h1>
        <p>Collect final peer feedback.</p>',
        ''
    ),
    (
        5,
        'Conduct Final Retrospective Meeting',
        '',
        'Closure & Feedback: Conduct Final Retrospective Meeting',
        'general',
        DATE(DATE('now'), '+35 DAYS'),
        DATE(DATE('now'), '+42 DAYS'),
        '<h1>Conduct Final Retrospective Meeting</h1>
        <p>Review project outcomes.</p>',
        ''
    ),
    (
        5,
        'Archive Project Assets',
        '',
        'Closure & Feedback: Archive Project Assets',
        'general',
        DATE(DATE('now'), '+36 DAYS'),
        DATE(DATE('now'), '+43 DAYS'),
        '<h1>Archive Project Assets</h1>
        <p>Store final assets.</p>',
        ''
    ),
    (
        5,
        'Complete Project Satisfaction Survey',
        '',
        'Closure & Feedback: Complete Project Satisfaction Survey',
        'general',
        DATE(DATE('now'), '+37 DAYS'),
        DATE(DATE('now'), '+44 DAYS'),
        '<h1>Complete Project Satisfaction Survey</h1>
        <p>Gather satisfaction feedback.</p>',
        ''
    ),
    (
        5,
        'Provide Sponsor Feedback Summary',
        '',
        'Closure & Feedback: Provide Sponsor Feedback Summary',
        'general',
        DATE(DATE('now'), '+38 DAYS'),
        DATE(DATE('now'), '+45 DAYS'),
        '<h1>Provide Sponsor Feedback Summary</h1>
        <p>Summarize sponsor feedback.</p>',
        ''
    ),
    (
        5,
        'Submit Grading/Evaluation Worksheets',
        '',
        'Closure & Feedback: Submit Grading/Evaluation Worksheets',
        'general',
        DATE(DATE('now'), '+39 DAYS'),
        DATE(DATE('now'), '+2 MONTH'),
        '<h1>Submit Grading/Evaluation Worksheets</h1>
        <p>Provide grading worksheets.</p>',
        ''
    );
