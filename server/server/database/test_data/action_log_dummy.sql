INSERT INTO
    action_log (
        action_template, system_id, mock_id, project, form_data, files
    )
VALUES
    -- Team Name Submission 
    (15, 'zh7558', NULL, '4_buzzboost', '{"team_name":"BuzzBoost", "email":"test"}', NULL),
    (15, 'saa384', NULL, '5_profitpulse', '{"team_name":"ProfitPulse", "email":"test"}', NULL),
    (15, 'aeg836', NULL, '7_carecraze', '{"team_name":"CareCraze", "email":"test"}', NULL),
    (15, 'pks286', NULL, '8_dataforge', '{"team_name":"DataForge", "email":"test"}', NULL),
    (15, 'rf9472', NULL, '9_ecoedge', '{"team_name":"EcoEdge", "email":"test"}', NULL),

    -- Project Proposal
    (16,  'zh7558', NULL, '4_buzzboost', '{"proposal" :"BuzzBoost marketing strategy proposal"}', 'proposal_zh7558.pdf'),
    (16, 'lh7488', NULL, '4_buzzboost', '{"proposal":"BuzzBoost marketing strategy proposal"}', 'proposal_lh7488.pdf'),
    (16, 'gs9947', NULL, '4_buzzboost', '{"proposal":"BuzzBoost marketing strategy proposal"}', 'proposal_gs9947.pdf'),
    (16, 'cr8473', NULL, '4_buzzboost', '{"proposal":"BuzzBoost marketing strategy proposal"}', 'proposal_cr8473.pdf'),

    -- project timeline
    (17, 'zh7558', NULL, '4_buzzboost', '{"timeline":"Q1: Market research, Q2: Strategy development, Q3: Implementation, Q4: Review"}', 'timeline_zh7558.pdf'),
    (17, 'lh7488', NULL, '4_buzzboost', '{"timeline":"Q1: Market research, Q2: Strategy development, Q3: Implementation, Q4: Review"}', 'timeline_lh7488.pdf'),
    (17, 'gs9947', NULL, '4_buzzboost', '{"timeline":"Q1: Market research, Q2: Strategy development, Q3: Implementation, Q4: Review"}', 'timeline_gs9947.pdf'),
    (17, 'cr8473', NULL, '4_buzzboost', '{"timeline":"Q1: Market research, Q2: Strategy development, Q3: Implementation, Q4: Review"}', 'timeline_cr8473.pdf'),

    -- report submission
    (18, 'zh7558', NULL, '4_buzzboost', '{"report":"BuzzBoost final report"}', 'report_zh7558.pdf'),
    (18, 'lh7488', NULL, '4_buzzboost', '{"report":"BuzzBoost final report"}', 'report_lh7488.pdf'),
    (18, 'gs9947', NULL, '4_buzzboost', '{"report":"BuzzBoost final report"}', 'report_gs9947.pdf'),
    (18, 'cr8473', NULL, '4_buzzboost', '{"report":"BuzzBoost final report"}', 'report_cr8473.pdf'),
   
    -- Prototype Feedback
    (21, 'del1234', NULL, '4_buzzboost', '{"feedback":"Prototype shows promise, needs UI improvements"}', 'feedback_del1234.pdf'),
   
    -- Team Member Roles
    (22, 'rf9472', NULL, '9_ecoedge', '{"roles":"Ryu: Project Lead, Ember: Designer, Chun: Developer, Sparkle: Analyst"}', 'roles_rf9472.pdf'),
    (22, 'ef9474', NULL, '9_ecoedge', '{"roles":"Ryu: Project Lead, Ember: Designer, Chun: Developer, Sparkle: Analyst"}', 'roles_ef9474.pdf'),

    -- for buzzboost
    (22, 'zh7558', NULL, '4_buzzboost', '{"roles":"Zelda: Project Lead, Link: Designer, Glimmer: Developer, Comet: Analyst"}', 'roles_zh7558.pdf'),

        -- Peer Evaluation Form
    (28, 'zh7558', NULL, '4_buzzboost', '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Zelda contributed innovative ideas","Identify Disputes Or Problems That Happened And How They Were Handled.":"Minor disagreement on timeline, resolved through discussion","Yap Yap Yap":"Team collaborated well"},"Students":{"Link Hero":{"Feedback":{"Cooperation And Attitude":"Very cooperative","Quantity Of Work":"Consistently high output","Initiative":"Proactive leader"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":4,"Group Maintenance":5}},"Glimmer Star":{"Feedback":{"Cooperation And Attitude":"Positive attitude","Quantity Of Work":"Met expectations","Initiative":"Could take more initiative"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":3,"Initiative":3,"Dependability":4,"Group Maintenance":4}},"Comet Rush":{"Feedback":{"Cooperation And Attitude":"Team player","Quantity Of Work":"Good effort","Initiative":"Needs prompting"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":4,"Initiative":3,"Dependability":3,"Group Maintenance":4}}},"Submitter":"Zelda Hyrule"}', ''),
    (28, 'lh7488', NULL, '4_buzzboost', '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Link led meetings effectively","Identify Disputes Or Problems That Happened And How They Were Handled.":"Scheduling conflicts resolved amicably","Yap Yap Yap":"Strong team dynamics"},"Students":{"Zelda Hyrule":{"Feedback":{"Cooperation And Attitude":"Highly collaborative","Quantity Of Work":"Exceptional work","Initiative":"Creative thinker"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":5,"Group Maintenance":5}},"Glimmer Star":{"Feedback":{"Cooperation And Attitude":"Supportive","Quantity Of Work":"Adequate","Initiative":"Room for growth"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":3,"Initiative":3,"Dependability":3,"Group Maintenance":4}},"Comet Rush":{"Feedback":{"Cooperation And Attitude":"Good team member","Quantity Of Work":"Consistent","Initiative":"Follows direction"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":4,"Initiative":3,"Dependability":3,"Group Maintenance":4}}},"Submitter":"Link Hero"}', ''),
    (28, 'gs9947', NULL, '4_buzzboost', '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Glimmer provided key visuals","Identify Disputes Or Problems That Happened And How They Were Handled.":"Resource allocation discussed and settled","Yap Yap Yap":"Team morale high"},"Students":{"Zelda Hyrule":{"Feedback":{"Cooperation And Attitude":"Inspiring","Quantity Of Work":"High quality","Initiative":"Drives progress"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5","Initiative":":5,"Dependability":5,"Group Maintenance":5}"},"Link Hero":{"Feedback":"Cooperation And Attitude":"Strong leader","Quantity Of Work":"Reliable output","Initiative":"Takes charge"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":4,"Group Maintenance":5}"},"Comet Rush":{"Feedback":"Cooperation And Attitude":"Friendly","Quantity Of Work":"Meets deadlines","Initiative":"Needs encouragement"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":4,"Initiative":3,"Dependability":3,"Group Maintenance":4}}},"Submitter":"Glimmer Star"}', ''),
    (28, 'cr8473', NULL, '4_buzzboost', '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Comet adapted quickly","Identify Disputes Or Problems That Happened And How They Were Handled.":"Task overlap resolved by reassigning","Yap Yap Yap":"Good progress"},"Students":{"Zelda Hyrule":{"Feedback":"Cooperation And Attitude":"Team-focused","Quantity Of Work":"Outstanding","Initiative":"Innovative"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":5,"Group Maintenance":5}"},"Link Hero":{"Feedback":"Cooperation And Attitude":"Motivates team","Quantity Of Work":"High volume","Initiative":"Proactive"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":4,"Group Maintenance":5}"},"Glimmer Star":{"Feedback":"Cooperation And Attitude":"Helpful","Quantity Of Work":"Satisfactory","Initiative":"Can improve"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":3,"Initiative":3,"Dependability":3,"Group Maintenance":4}}},"Submitter":"Comet Rush"}', '')
    ;