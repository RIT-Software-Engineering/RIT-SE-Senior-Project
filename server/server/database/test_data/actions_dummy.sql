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
    -- Actions
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
        '<div><h2>Week 1 Artifacts, Tasks, and Deliverables</h2>

        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data"" data-dashlane-classification="identity">
        <ul>
        <li>Hold project kick-off meeting with the project sponsor this week or next week.  Your coach should schedule this.</li>
        <li>Get enough detail concerning the project to write the project synopsis.  This will be due in a future action.</li>
        <li>Complete a social event for the team.  This should be off-campus if possible.</li><br>
            <div class="required field">
                <label for="Social_Event">Social Event Time, Date, and Place</label>
                <input required="" name="Social_Event" type="text">
            </div>
        <li>Decide on a team name.  Please refrain from inappropriate names - clever is OK, puns are OK, but what would a future employer think if they came across your name in the archived project on the site (a very real possibility)?</li><br>
            <div class="required field">
                <label for="Team_Name">Team Name</label>
                <input required="" name="Team_Name" type="text"></div>
        </ul></form></div>',
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
        <p>
            Your team is required to submit a detailed project proposal outlining your projects objectives, scope, deliverables, and timeline. The proposal should include:
            <ul>
                <li>Project title and team members</li>
                <li>Background and motivation</li>
                <li>Project goals and objectives</li>
                <li>Proposed solution and technologies</li>
                <li>Expected challenges and risks</li>
                <li>Milestones and timeline</li>
            </ul>
            Please ensure your document is clear and well-organized. Only PDF or DOCX files are accepted.
        </p>',
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
        <p>
            Develop a comprehensive timeline for your project, including all major milestones, deadlines, and deliverables. Your timeline should:
            <ul>
                <li>Identify key phases of the project</li>
                <li>Assign responsibilities to team members</li>
                <li>Include estimated dates for each milestone</li>
                <li>Highlight dependencies and critical paths</li>
            </ul>
            You may use a Gantt chart or spreadsheet format. Submit your timeline as a PDF or XLSX file.
        </p>',
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
        <p>
            The interim report should summarize your progress so far, including:
            <ul>
                <li>Work completed to date</li>
                <li>Challenges encountered and how they were addressed</li>
                <li>Any changes to the original plan</li>
                <li>Next steps and updated timeline</li>
            </ul>
            Please include relevant images or charts if applicable. Accepted formats: PNG, PDF, JPG.
        </p>',
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
        <p>
            Conduct a survey or interviews to gather insights about your target market. Your submission should include:
            <ul>
                <li>Survey questions and methodology</li>
                <li>Summary of responses and key findings</li>
                <li>Analysis of how results will influence your project</li>
            </ul>
            Upload your results as a PDF or CSV file.
        </p>',
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
        <p>
            Complete a business model canvas for your project. Be sure to address all nine building blocks:
            <ul>
                <li>Key Partners</li>
                <li>Key Activities</li>
                <li>Key Resources</li>
                <li>Value Propositions</li>
                <li>Customer Relationships</li>
                <li>Channels</li>
                <li>Customer Segments</li>
                <li>Cost Structure</li>
                <li>Revenue Streams</li>
            </ul>
            Submit your canvas as a PDF or DOCX file.
        </p>',
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
        <p>
            Gather feedback from users, stakeholders, or your coach on your current prototype. Your submission should include:
            <ul>
                <li>Summary of feedback received</li>
                <li>Key suggestions or issues identified</li>
                <li>Planned improvements based on feedback</li>
            </ul>
            Upload your feedback summary as a PDF or DOCX file.
        </p>',
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
        <p>
            Assign roles and responsibilities to each team member. Your document should include:
            <ul>
                <li>List of all team members</li>
                <li>Assigned roles (e.g., project manager, developer, designer, tester, etc.)</li>
                <li>Brief description of each members responsibilities</li>
            </ul>
            Submit as a PDF or DOCX file.
        </p>',
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
        <p>
            Research and analyze at least three competitors or similar solutions. Your analysis should include:
            <ul>
                <li>Overview of each competitor</li>
                <li>Comparison of features, strengths, and weaknesses</li>
                <li>Opportunities for differentiation</li>
            </ul>
            Submit your findings as a PDF or XLSX file.
        </p>',
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
        <p>
            Identify potential risks that could impact your project. For each risk, provide:
            <ul>
                <li>Description of the risk</li>
                <li>Likelihood and potential impact</li>
                <li>Mitigation strategies</li>
            </ul>
            Submit your risk assessment as a PDF or DOCX file.
        </p>',
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
        <p>
            Create a marketing plan for your project. Your plan should include:
            <ul>
                <li>Target audience and market segments</li>
                <li>Key marketing messages</li>
                <li>Channels and tactics for reaching your audience</li>
                <li>Metrics for measuring success</li>
            </ul>
            Submit your plan as a PDF or DOCX file.
        </p>',
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
        <p>
            Prepare financial projections for your project. Include:
            <ul>
                <li>Estimated costs and revenues</li>
                <li>Assumptions used in your projections</li>
                <li>Break-even analysis (if applicable)</li>
                <li>Any charts or tables to support your estimates</li>
            </ul>
            Submit as a PDF or XLSX file.
        </p>',
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
        <div>
            Please prepare a final presentation summarizing your project. Your presentation should include:
            <ul>
                <li>Project overview and objectives</li>
                <li>Key findings and results</li>
                <li>Challenges faced and how they were overcome</li>
                <li>Future work or next steps</li>
                </ul>
                <p>
                The presentation should be in PDF or PPTX format and not exceed 20 slides.
                </p>
                </div>',
        '.pdf,.pptx'
    ),
    (
        1,
        'Final Peer Evaluation',
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
                <QuestionFeedback title="Feedback" questions=''["Provide specific comments about any members or situations","Identify disputes or problems that happened and how they were handled."]'' ordered=''true'' required=''false'' includeStudents=''false'' selfFeedback=''false'' />
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
    -- semsster 2
    (
        2,
        'Team Name Submission',
        '',
        'Come up with team name',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-01-20'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-02-01'
        ),
        '<div><h2>Week 1 Artifacts, Tasks, and Deliverables</h2>

        <form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data">
        <ul>
        <li>Hold project kick-off meeting with the project sponsor this week or next week.  Your coach should schedule this.</li>
        <li>Get enough detail concerning the project to write the project synopsis.  This will be due in a future action.</li>
        <li>Complete a social event for the team.  This should be off-campus if possible.</li><br>
            <div class="required field">
                <label for="Social_Event">Social Event Time, Date, and Place</label>
                <input required="" name="Social_Event" type="text">
            </div>
        <li>Decide on a team name.  Please refrain from inappropriate names - clever is OK, puns are OK, but what would a future employer think if they came across your name in the archived project on the site (a very real possibility)?</li><br>
            <div class="required field">
                <label for="Team_Name">Team Name</label>
                <input required="" name="Team_Name" type="text"></span></div>
        </ul></form></div>',
        ''
    ),
    (
        2,
        'Project Proposal',
        '',
        'Submit your project proposal',
        'individual',
        DATE(
            strftime('%Y', DATE('now')) || '-02-10'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-02-20'
        ),
        '<h1>Submit Project Proposal</h1>
        <p>
            Your team is required to submit a detailed project proposal outlining your projects objectives, scope, deliverables, and timeline. The proposal should include:
            <ul>
                <li>Project title and team members</li>
                <li>Background and motivation</li>
                <li>Project goals and objectives</li>
                <li>Proposed solution and technologies</li>
                <li>Expected challenges and risks</li>
                <li>Milestones and timeline</li>
            </ul>
            Please ensure your document is clear and well-organized. Only PDF or DOCX files are accepted.
        </p>',
        '.pdf,.docx'
    ),
    (
        2,
        'Project Timeline',
        '',
        'Create and submit a project timeline with milestones',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-03-01'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-03-15'
        ),
        '<h1>Submit Project Timeline</h1>
        <p>
            Develop a comprehensive timeline for your project, including all major milestones, deadlines, and deliverables. Your timeline should:
            <ul>
                <li>Identify key phases of the project</li>
                <li>Assign responsibilities to team members</li>
                <li>Include estimated dates for each milestone</li>
                <li>Highlight dependencies and critical paths</li>
            </ul>
            You may use a Gantt chart or spreadsheet format. Submit your timeline as a PDF or XLSX file.
        </p>',
        '.pdf,.xlsx'
    ),
    (
        2,
        'Report Submission',
        '',
        'Turn in your interim report',
        'individual',
        DATE(
            strftime('%Y', DATE('now')) || '-04-05'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-04-20'
        ),
        '<h1>Submit your interim report</h1>
        <p>
            The interim report should summarize your progress so far, including:
            <ul>
                <li>Work completed to date</li>
                <li>Challenges encountered and how they were addressed</li>
                <li>Any changes to the original plan</li>
                <li>Next steps and updated timeline</li>
            </ul>
            Please include relevant images or charts if applicable. Accepted formats: PNG, PDF, JPG.
        </p>',
        '.png,.pdf,.jpg'
    ),
    (
        2,
        'Market Research Survey',
        '',
        'Conduct a survey to identify target market needs',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-05-01'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-05-15'
        ),
        '<h1>Submit Market Research Survey Results</h1>
        <p>
            Conduct a survey or interviews to gather insights about your target market. Your submission should include:
            <ul>
                <li>Survey questions and methodology</li>
                <li>Summary of responses and key findings</li>
                <li>Analysis of how results will influence your project</li>
            </ul>
            Upload your results as a PDF or CSV file.
        </p>',
        '.pdf,.csv'
    ),
    (
        2,
        'Business Model Canvas',
        '',
        'Develop and submit your business model canvas',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-06-01'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-07-10'
        ),
        '<h1>Submit Business Model Canvas</h1>
        <p>
            Complete a business model canvas for your project. Be sure to address all nine building blocks:
            <ul>
                <li>Key Partners</li>
                <li>Key Activities</li>
                <li>Key Resources</li>
                <li>Value Propositions</li>
                <li>Customer Relationships</li>
                <li>Channels</li>
                <li>Customer Segments</li>
                <li>Cost Structure</li>
                <li>Revenue Streams</li>
            </ul>
            Submit your canvas as a PDF or DOCX file.
        </p>',
        '.pdf,.docx'
    ),
    (
        2,
        'Prototype Feedback',
        '',
        'Collect feedback on your application prototype',
        'coach',
        DATE(
            strftime('%Y', DATE('now')) || '-06-10'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-07-15'
        ),
        '<h1>Submit Prototype Feedback</h1>
        <p>
            Gather feedback from users, stakeholders, or your coach on your current prototype. Your submission should include:
            <ul>
                <li>Summary of feedback received</li>
                <li>Key suggestions or issues identified</li>
                <li>Planned improvements based on feedback</li>
            </ul>
            Upload your feedback summary as a PDF or DOCX file.
        </p>',
        '.pdf,.docx'
    ),
    (
        2,
        'Team Member Roles',
        '',
        'Assign and submit team member roles and responsibilities',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-07-23'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-08-15'
        ),
        '<h1>Submit Team Roles</h1>
        <p>
            Assign roles and responsibilities to each team member. Your document should include:
            <ul>
                <li>List of all team members</li>
                <li>Assigned roles (e.g., project manager, developer, designer, tester, etc.)</li>
                <li>Brief description of each members responsibilities</li>
            </ul>
            Submit as a PDF or DOCX file.
        </p>',
        '.pdf,.docx'
    ),
    (
        2,
        'Competitor Analysis',
        '',
        'Analyze competitors and submit findings',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-08-05'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-09-15'
        ),
        '<h1>Submit Competitor Analysis</h1>
        <p>
            Research and analyze at least three competitors or similar solutions. Your analysis should include:
            <ul>
                <li>Overview of each competitor</li>
                <li>Comparison of features, strengths, and weaknesses</li>
                <li>Opportunities for differentiation</li>
            </ul>
            Submit your findings as a PDF or XLSX file.
        </p>',
        '.pdf,.xlsx'
    ),
    (
        2,
        'Risk Assessment',
        '',
        'Identify and submit potential project risks',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-09-20'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-10-05'
        ),
        '<h1>Submit Risk Assessment</h1>
        <p>
            Identify potential risks that could impact your project. For each risk, provide:
            <ul>
                <li>Description of the risk</li>
                <li>Likelihood and potential impact</li>
                <li>Mitigation strategies</li>
            </ul>
            Submit your risk assessment as a PDF or DOCX file.
        </p>',
        '.pdf,.docx'
    ),
    (
        2,
        'Marketing Plan',
        '',
        'Develop and submit a marketing strategy',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-10-10'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-10-25'
        ),
        '<h1>Submit Marketing Plan</h1>
        <p>
            Create a marketing plan for your project. Your plan should include:
            <ul>
                <li>Target audience and market segments</li>
                <li>Key marketing messages</li>
                <li>Channels and tactics for reaching your audience</li>
                <li>Metrics for measuring success</li>
            </ul>
            Submit your plan as a PDF or DOCX file.
        </p>',
        '.pdf,.docx'
    ),
    (
        2,
        'Financial Projections',
        '',
        'Submit projected financials for the project',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-11-01'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-11-15'
        ),
        '<h1>Submit Financial Projections</h1>
        <p>
            Prepare financial projections for your project. Include:
            <ul>
                <li>Estimated costs and revenues</li>
                <li>Assumptions used in your projections</li>
                <li>Break-even analysis (if applicable)</li>
                <li>Any charts or tables to support your estimates</li>
            </ul>
            Submit as a PDF or XLSX file.
        </p>',
        '.pdf,.xlsx'
    ),
    (
        2,
        'Final Presentation',
        '',
        'Prepare and submit the final project presentation',
        'team',
        DATE(
            strftime('%Y', DATE('now')) || '-11-20'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-12-01'
        ),
        '<h1>Submit Final Presentation</h1>',
        '.pdf,.pptx'
    ),
    (
        2,
        'Final Peer Evaluation',
        '',
        'Evaluate your team members',
        'peer_evaluation',
        DATE(
            strftime('%Y', DATE('now')) || '-12-02'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-12-04'
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
                <QuestionFeedback title="Feedback" questions=''["Provide specific comments about any members or situations","Identify disputes or problems that happened and how they were handled."]'' ordered=''true'' required=''false'' includeStudents=''false'' selfFeedback=''false'' />
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
        'Midterm Peer Evaluation',
        '',
        'Evaluate your team members',
        'peer_evaluation',
        DATE(
            strftime('%Y', DATE('now')) || '-06-28'
        ),
        DATE(
            strftime('%Y', DATE('now')) || '-07-22'
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
                <QuestionFeedback title="Feedback" questions=''["Provide specific comments about any members or situations","Identify disputes or problems that happened and how they were handled."]'' ordered=''true'' required=''false'' includeStudents=''false'' selfFeedback=''false'' />
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
    -- student announcements
    (
        2,
        'Welcome to the Senior Project Course',
        '',
        'Welcome',
        'student_announcement',
        DATE(strftime('%Y', DATE('now')) || '-01-02'),
        DATE(strftime('%Y', DATE('now')) || '-02-20'),
        '<h1>Welcome to the Senior Project Course</h1>
            <p>Welcome to the Senior Project Course! This course is designed to help you develop
             your skills in project management, teamwork, and problem-solving. Throughout the course, you will work on a team project that will allow you to apply what you have learned in previous courses.</p>
            <p>We are excited to have you in this course and look forward to seeing the great work you will accomplish. If you have any questions or concerns, please do not hesitate to reach out to your instructor.</p>
        </div>',
        ''
    ),
    (
        2,
        'Holiday Break',
        '',
        'Enjoy your holiday break!',
        'student_announcement',
        DATE('now', '-1 day'),
        DATE('now', '+12 days'),
        '<h1>Holiday Break</h1>
            <p>A holiday break is coming up soon! The break will start a week from now.</p>
            <p>We hope you enjoy your holiday break!</p>
            <p>Remember, you are not expected to work on your project during this time. Use this opportunity to relax, and spend time with family and friends.</p>
        </div>',
        ''
    ),

    -- coach announcements
    (
        2,
        'Welcome Coaches!',
        '',
        'Getting started with the Senior Project Application',
        'coach_announcement',
        DATE(strftime('%Y', DATE('now')) || '-01-02'),
        DATE(strftime('%Y', DATE('now')) || '-02-20'),
        '
            <h1>Welcome Coaches!</h1>
            <p>Welcome to the Senior Project Application! This application is designed to help you manage your team projects and track your progress throughout the course.</p>
            <p>As a coach, you will be able to create and manage teams, assign actions, and track the progress of your team members. You will also be able to communicate with your team members and provide feedback on their work.</p>
            <p>We are excited to have you on board and look forward to seeing the great work you will accomplish with your teams. If you have any questions or concerns, please do not hesitate to reach out to the development team.</p>
        ',
        ''
    ),

    (
        2,
        'Term Review',
        '',
        'Prepare for the term review!',
        'coach_announcement',
        DATE('now', '-4 days'),
        DATE('now', '+4 days'),
        '<h1>Term Review</h1>
            <p>The term review is coming up soon. The review will start a week from now.</p>
        </div>',
        ''
    );