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
        1,
        'Team Name Submission',
        '',
        'Come up with team name',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-01-20'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-02-01'
        ),
        '<h1>Take the individual test form</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="name">Name</label>
            <input name="name" type="text"/>
            <label for="email">Email</label>
            <input name="email" type="text"/>
        </form>',
        ''
    ),
    (
        1,
        'Project Proposal',
        '',
        'Submit your project proposal',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-02-10'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-02-20'
        ),
        '<h1>Submit Project Proposal</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="proposal">Proposal File</label>
            <input name="proposal" type="file" accept=".pdf,.docx"/>
        </form>',
        '.pdf,.docx'
    ),
    (
        1,
        'Project Timeline',
        '',
        'Create and submit a project timeline with milestones',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-03-01'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-03-15'
        ),
        '<h1>Submit Project Timeline</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="timeline">Timeline File</label>
        </form>',
        '.pdf,.xlsx'
    ),
    (
        1,
        'Report Submission',
        '',
        'Turn in your interim report',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-04-05'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-04-20'
        ),
        '<h1>Submit your interim report</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="report">Report File</label>
        </form>',
        '.png,.pdf,.jpg'
    ),
    (
        1,
        'Market Research Survey',
        '',
        'Conduct a survey to identify target market needs',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-05-01'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-05-15'
        ),
        '<h1>Submit Market Research Survey Results</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="survey">Survey Results File</label>
        </form>',
        '.pdf,.csv'
    ),
    (
        1,
        'Business Model Canvas',
        '',
        'Develop and submit your business model canvas',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-06-01'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-06-30'
        ),
        '<h1>Submit Business Model Canvas</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="canvas">Business Model Canvas File</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        1,
        'Prototype Feedback',
        '',
        'Collect feedback on your application prototype',
        'coach',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-06-10'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-07-15'
        ),
        '<h1>Submit Prototype Feedback</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="feedback">Feedback Summary</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        1,
        'Team Member Roles',
        '',
        'Assign and submit team member roles and responsibilities',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-08-01'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-08-15'
        ),
        '<h1>Submit Team Roles</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="roles">Team Roles Document</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        1,
        'Competitor Analysis',
        '',
        'Analyze competitors and submit findings',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-09-01'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-09-15'
        ),
        '<h1>Submit Competitor Analysis</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="analysis">Competitor Analysis File</label>
        </form>',
        '.pdf,.xlsx'
    ),
    (
        1,
        'Risk Assessment',
        '',
        'Identify and submit potential project risks',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-09-20'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-10-05'
        ),
        '<h1>Submit Risk Assessment</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="risks">Risk Assessment File</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        1,
        'Marketing Plan',
        '',
        'Develop and submit a marketing strategy',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-10-10'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-10-25'
        ),
        '<h1>Submit Marketing Plan</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="marketing">Marketing Plan File</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        1,
        'Financial Projections',
        '',
        'Submit projected financials for the project',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-11-01'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-11-15'
        ),
        '<h1>Submit Financial Projections</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="financials">Financial Projections File</label>
        </form>',
        '.pdf,.xlsx'
    ),
    (
        1,
        'Final Presentation',
        '',
        'Prepare and submit the final project presentation',
        'team',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-11-20'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-12-01'
        ),
        '<h1>Submit Final Presentation</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="presentation">Presentation File</label>
        </form>',
        '.pdf,.pptx'
    ),
    (
        1,
        'Peer Evaluation Form',
        '',
        'Evaluate your team members',
        'peer_evaluation',
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-12-02'
        ),
        DATE(
            strftime('%Y', DATE('now', '-1 years')) || '-12-04'
        ),
        '<h1>Peer Evaluation</h1>
        <form style="text-align: left;" class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <h2>Instructions</h2>
            <p>
              Rate every member of the team, including yourself, in each category on a scale of 1 to 5.
              <br /><br />
              <b>Cooperation and Attitude:</b> being motivated and interested in working on the project. Working harmoniously with others to meet group responsibilities.
              <br /><br />
              <b>Quantity of Work:</b> Comparing the actual work output of the team member to the project. Quality of Work: Demonstrating accuracy, completeness, and neatness of work.
              <br /><br />
              <b>Initiative:</b> Planning work and going ahead with a task without being told every detail. Willingness to add own ideas to the project.
              <br /><br />
              <b>Dependability:</b> Being relied upon and trusted to handle work assignments. Work is completed on time.
              <br /><br />
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
        </form>',
        ''
    ),
    (
        2,
        'Team Name Submission',
        '',
        'Come up with team name',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-01-20'),
        DATE(strftime('%Y', DATE('now')) || '-02-01'),
        '<h1>Take the individual test form</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="name">Name</label>
            <input name="name" type="text"/>
            <label for="email">Email</label>
            <input name="email" type="text"/>
        </form>',
        ''
    ),
    (
        2,
        'Project Proposal',
        '',
        'Submit your project proposal',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-02-10'),
        DATE(strftime('%Y', DATE('now')) || '-02-20'),
        '<h1>Submit Project Proposal</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="proposal">Proposal File</label>
            <input name="proposal" type="file" accept=".pdf,.docx"/>
        </form>',
        '.pdf,.docx'
    ),
    (
        2,
        'Project Timeline',
        '',
        'Create and submit a project timeline with milestones',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-03-01'),
        DATE(strftime('%Y', DATE('now')) || '-03-15'),
        '<h1>Submit Project Timeline</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="timeline">Timeline File</label>
        </form>',
        '.pdf,.xlsx'
    ),
    (
        2,
        'Report Submission',
        '',
        'Turn in your interim report',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-04-05'),
        DATE(strftime('%Y', DATE('now')) || '-04-20'),
        '<h1>Submit your interim report</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="report">Report File</label>
        </form>',
        '.png,.pdf,.jpg'
    ),
    (
        2,
        'Market Research Survey',
        '',
        'Conduct a survey to identify target market needs',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-05-01'),
        DATE(strftime('%Y', DATE('now')) || '-05-15'),
        '<h1>Submit Market Research Survey Results</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="survey">Survey Results File</label>
        </form>',
        '.pdf,.csv'
    ),
    (
        2,
        'Business Model Canvas',
        '',
        'Develop and submit your business model canvas',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-06-01'),
        DATE(strftime('%Y', DATE('now')) || '-06-30'),
        '<h1>Submit Business Model Canvas</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="canvas">Business Model Canvas File</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        2,
        'Prototype Feedback',
        '',
        'Collect feedback on your application prototype',
        'coach',
        DATE(strftime('%Y', DATE('now')) || '-06-10'),
        DATE(strftime('%Y', DATE('now')) || '-07-15'),
        '<h1>Submit Prototype Feedback</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="feedback">Feedback Summary</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        2,
        'Team Member Roles',
        '',
        'Assign and submit team member roles and responsibilities',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-08-01'),
        DATE(strftime('%Y', DATE('now')) || '-08-15'),
        '<h1>Submit Team Roles</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="roles">Team Roles Document</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        2,
        'Competitor Analysis',
        '',
        'Analyze competitors and submit findings',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-09-01'),
        DATE(strftime('%Y', DATE('now')) || '-09-15'),
        '<h1>Submit Competitor Analysis</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="analysis">Competitor Analysis File</label>
        </form>',
        '.pdf,.xlsx'
    ),
    (
        2,
        'Risk Assessment',
        '',
        'Identify and submit potential project risks',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-09-20'),
        DATE(strftime('%Y', DATE('now')) || '-10-05'),
        '<h1>Submit Risk Assessment</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="risks">Risk Assessment File</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        2,
        'Marketing Plan',
        '',
        'Develop and submit a marketing strategy',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-10-10'),
        DATE(strftime('%Y', DATE('now')) || '-10-25'),
        '<h1>Submit Marketing Plan</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="marketing">Marketing Plan File</label>
        </form>',
        '.pdf,.docx'
    ),
    (
        2,
        'Financial Projections',
        '',
        'Submit projected financials for the project',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-11-01'),
        DATE(strftime('%Y', DATE('now')) || '-11-15'),
        '<h1>Submit Financial Projections</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="financials">Financial Projections File</label>
        </form>',
        '.pdf,.xlsx'
    ),
    (
        2,
        'Final Presentation',
        '',
        'Prepare and submit the final project presentation',
        'team',
        DATE(strftime('%Y', DATE('now')) || '-11-20'),
        DATE(strftime('%Y', DATE('now')) || '-12-01'),
        '<h1>Submit Final Presentation</h1>
        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <label for="presentation">Presentation File</label>
        </form>',
        '.pdf,.pptx'
    ),
    (
        2,
        'Peer Evaluation Form',
        '',
        'Evaluate your team members',
        'peer_evaluation',
        DATE(strftime('%Y', DATE('now')) || '-12-02'),
        DATE(strftime('%Y', DATE('now')) || '-12-04'),
        '<h1>Peer Evaluation</h1>
        <form style="text-align: left;" class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
            <h2>Instructions</h2>
            <p>
              Rate every member of the team, including yourself, in each category on a scale of 1 to 5.
              <br /><br />
              <b>Cooperation and Attitude:</b> being motivated and interested in working on the project. Working harmoniously with others to meet group responsibilities.
              <br /><br />
              <b>Quantity of Work:</b> Comparing the actual work output of the team member to the project. Quality of Work: Demonstrating accuracy, completeness, and neatness of work.
              <br /><br />
              <b>Initiative:</b> Planning work and going ahead with a task without being told every detail. Willingness to add own ideas to the project.
              <br /><br />
              <b>Dependability:</b> Being relied upon and trusted to handle work assignments. Work is completed on time.
              <br /><br />
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
        </form>',
        ''
    );