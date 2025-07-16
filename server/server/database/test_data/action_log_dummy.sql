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
    -- Team Member Roles
    (22, 'rf9472', NULL, '9_ecoedge', '{"roles":"Ryu: Project Lead, Ember: Designer, Chun: Developer, Sparkle: Analyst"}', 'roles_rf9472.pdf'),
    (22, 'ef9474', NULL, '9_ecoedge', '{"roles":"Ryu: Project Lead, Ember: Designer, Chun: Developer, Sparkle: Analyst"}', 'roles_ef9474.pdf'),

    -- for buzzboost
    (22, 'zh7558', NULL, '4_buzzboost', '{"roles":"Zelda: Project Lead, Link: Designer, Glimmer: Developer, Comet: Analyst"}', 'roles_zh7558.pdf'),

        -- Peer Evaluation Form
    (29, 'zh7558', NULL, '4_buzzboost', '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Zelda contributed innovative ideas","Identify Disputes Or Problems That Happened And How They Were Handled.":"Minor disagreement on timeline, resolved through discussion","Yap Yap Yap":"Team collaborated well"},"Students":{"Link Hero":{"Feedback":{"Cooperation And Attitude":"Very cooperative","Quantity Of Work":"Consistently high output","Initiative":"Proactive leader"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":4,"Group Maintenance":5}},"Glimmer Star":{"Feedback":{"Cooperation And Attitude":"Positive attitude","Quantity Of Work":"Met expectations","Initiative":"Could take more initiative"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":3,"Initiative":3,"Dependability":4,"Group Maintenance":4}},"Comet Rush":{"Feedback":{"Cooperation And Attitude":"Team player","Quantity Of Work":"Good effort","Initiative":"Needs prompting"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":4,"Initiative":3,"Dependability":3,"Group Maintenance":4}}},"Submitter":"Zelda Hyrule"}', ''),
    (29, 'lh7488', NULL, '4_buzzboost', '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Link led meetings effectively","Identify Disputes Or Problems That Happened And How They Were Handled.":"Scheduling conflicts resolved amicably","Yap Yap Yap":"Strong team dynamics"},"Students":{"Zelda Hyrule":{"Feedback":{"Cooperation And Attitude":"Highly collaborative","Quantity Of Work":"Exceptional work","Initiative":"Creative thinker"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":5,"Group Maintenance":5}},"Glimmer Star":{"Feedback":{"Cooperation And Attitude":"Supportive","Quantity Of Work":"Adequate","Initiative":"Room for growth"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":3,"Initiative":3,"Dependability":3,"Group Maintenance":4}},"Comet Rush":{"Feedback":{"Cooperation And Attitude":"Good team member","Quantity Of Work":"Consistent","Initiative":"Follows direction"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":4,"Initiative":3,"Dependability":3,"Group Maintenance":4}}},"Submitter":"Link Hero"}', ''),
    (29, 'gs9947', NULL, '4_buzzboost', '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Glimmer provided key visuals","Identify Disputes Or Problems That Happened And How They Were Handled.":"Resource allocation discussed and settled","Yap Yap Yap":"Team morale high"},"Students":{"Zelda Hyrule":{"Feedback":{"Cooperation And Attitude":"Inspiring","Quantity Of Work":"High quality","Initiative":"Drives progress"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5","Initiative":":5,"Dependability":5,"Group Maintenance":5}"},"Link Hero":{"Feedback":"Cooperation And Attitude":"Strong leader","Quantity Of Work":"Reliable output","Initiative":"Takes charge"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":4,"Group Maintenance":5}"},"Comet Rush":{"Feedback":"Cooperation And Attitude":"Friendly","Quantity Of Work":"Meets deadlines","Initiative":"Needs encouragement"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":4,"Initiative":3,"Dependability":3,"Group Maintenance":4}}},"Submitter":"Glimmer Star"}', ''),
    (29, 'cr8473', NULL, '4_buzzboost', '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Comet adapted quickly","Identify Disputes Or Problems That Happened And How They Were Handled.":"Task overlap resolved by reassigning","Yap Yap Yap":"Good progress"},"Students":{"Zelda Hyrule":{"Feedback":"Cooperation And Attitude":"Team-focused","Quantity Of Work":"Outstanding","Initiative":"Innovative"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":5,"Group Maintenance":5}"},"Link Hero":{"Feedback":"Cooperation And Attitude":"Motivates team","Quantity Of Work":"High volume","Initiative":"Proactive"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":4,"Group Maintenance":5}"},"Glimmer Star":{"Feedback":"Cooperation And Attitude":"Helpful","Quantity Of Work":"Satisfactory","Initiative":"Can improve"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":3,"Initiative":3,"Dependability":3,"Group Maintenance":4}}},"Submitter":"Comet Rush"}', ''),
    (29, 'del1234', NULL, '4_buzzboost', '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Great teamwork and creativity","Identify Disputes Or Problems That Happened And How They Were Handled.":"Minor disagreements resolved through discussion","Yap Yap Yap":"Overall excellent performance"},"Students":{"Zelda Hyrule":{"Feedback":{"Cooperation And Attitude":"Very collaborative","Quantity Of Work":"High quality","Initiative":"Proactive"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":5,"Group Maintenance":5}},"Link Hero":{"Feedback":{"Cooperation And Attitude":"Strong leader","Quantity Of Work":"Consistent","Initiative":"Takes initiative"},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":4,"Group Maintenance":5}},"Glimmer Star":{"Feedback":{"Cooperation And Attitude":"Supportive","Quantity Of Work":"Adequate","Initiative":"Needs more initiative"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":3,"Initiative":3,"Dependability":3,"Group Maintenance":4}},"Comet Rush":{"Feedback":{"Cooperation And Attitude":"Good team player","Quantity Of Work":"Meets expectations","Initiative":"Follows direction"},"Ratings":{"Cooperation And Attitude":4,"Quantity Of Work":4,"Initiative":3,"Dependability":3,"Group Maintenance":4}}},"Submitter":"Coach Del"}}', ''),
   
    -- Past projects: 1_groweasy, 2_smartspark, 3_techtitan, 5_profitpulse
    -- 1_groweasy
    (1, 'miku99', NULL, '1_groweasy', '{"team_name":"GrowEasy", "email":"groweasy1@example.com"}', NULL),
    (2, 'miku99', NULL, '1_groweasy', '{"proposal":"GrowEasy project proposal"}', 'proposal_groweasy_user1.pdf'),
    (3, 'cs1290', NULL, '1_groweasy', '{"timeline":"GrowEasy project timeline"}', 'timeline_groweasy_user1.pdf'),
    (4, 'bt1293', NULL, '1_groweasy', '{"report":"GrowEasy interim report"}', 'report_groweasy_user1.pdf'),
    (5, 'til345', NULL, '1_groweasy', '{"survey":"GrowEasy market research"}', 'survey_groweasy_user1.pdf'),
    (6, 'miku99', NULL, '1_groweasy', '{"canvas":"GrowEasy business model canvas"}', 'canvas_groweasy_user1.pdf'),
    (7, 'jod1234', NULL, '1_groweasy', '{"feedback":"GrowEasy prototype feedback"}', 'feedback_groweasy_coach.pdf'),
    (8, 'cs1290', NULL, '1_groweasy', '{"roles":"GrowEasy team roles"}', 'roles_groweasy_user1.pdf'),
    (9, 'bt1293', NULL, '1_groweasy', '{"analysis":"GrowEasy competitor analysis"}', 'analysis_groweasy_user1.pdf'),
    (10, 'til345', NULL, '1_groweasy', '{"risks":"GrowEasy risk assessment"}', 'risks_groweasy_user1.pdf'),
    (11, 'miku99', NULL, '1_groweasy', '{"marketing":"GrowEasy marketing plan"}', 'marketing_groweasy_user1.pdf'),
    (12, 'cs1290', NULL, '1_groweasy', '{"financials":"GrowEasy financial projections"}', 'financials_groweasy_user1.pdf'),
    (13, 'miku99', NULL, '1_groweasy', '{"presentation":"GrowEasy final presentation"}', 'presentation_groweasy_user1.pdf'),
    (13, 'cs1290', NULL, '1_groweasy', '{"presentation":"GrowEasy final presentation"}', 'presentation_groweasy_user1.pdf'),
    (13, 'bt1293', NULL, '1_groweasy', '{"presentation":"GrowEasy final presentation"}', 'presentation_groweasy_user1.pdf'),
    (13, 'til345', NULL, '1_groweasy', '{"presentation":"GrowEasy final presentation"}', 'presentation_groweasy_user1.pdf'),
    (14, 'bt1293', NULL, '1_groweasy', '{"peer_evaluation":"GrowEasy peer evaluation"}', NULL),
    (14, 'miku99', NULL, '1_groweasy', '{"peer_evaluation":"GrowEasy peer evaluation"}', NULL),
    (14, 'cs1290', NULL, '1_groweasy', '{"peer_evaluation":"GrowEasy peer evaluation"}', NULL),
    (14, 'til345', NULL, '1_groweasy', '{"peer_evaluation":"GrowEasy peer evaluation"}', NULL),
    (14, 'jod1234', NULL, '1_groweasy', '{"peer_evaluation":"GrowEasy peer evaluation"}', NULL),

    -- 2_smartspark
    (1, 'pd1223', NULL, '2_smartspark', '{"team_name":"SmartSpark", "email":"smartspark1@example.com"}', NULL),
    (2, 'pd1223', NULL, '2_smartspark', '{"proposal":"SmartSpark project proposal"}', 'proposal_smartspark_user1.pdf'),
    (3, 'sos229', NULL, '2_smartspark', '{"timeline":"SmartSpark project timeline"}', 'timeline_smartspark_user1.pdf'),
    (4, 'lz2198', NULL, '2_smartspark', '{"report":"SmartSpark interim report"}', 'report_smartspark_user1.pdf'),
    (5, 'zfa894', NULL, '2_smartspark', '{"survey":"SmartSpark market research"}', 'survey_smartspark_user1.pdf'),
    (6, 'pd1223', NULL, '2_smartspark', '{"canvas":"SmartSpark business model canvas"}', 'canvas_smartspark_user1.pdf'),
    (7, 'jod1234', NULL, '2_smartspark', '{"feedback":"SmartSpark prototype feedback"}', 'feedback_smartspark_coach.pdf'),
    (8, 'sos229', NULL, '2_smartspark', '{"roles":"SmartSpark team roles"}', 'roles_smartspark_user1.pdf'),
    (9, 'lz2198', NULL, '2_smartspark', '{"analysis":"SmartSpark competitor analysis"}', 'analysis_smartspark_user1.pdf'),
    (10, 'zfa894', NULL, '2_smartspark', '{"risks":"SmartSpark risk assessment"}', 'risks_smartspark_user1.pdf'),
    (11, 'pd1223', NULL, '2_smartspark', '{"marketing":"SmartSpark marketing plan"}', 'marketing_smartspark_user1.pdf'),
    (12, 'sos229', NULL, '2_smartspark', '{"financials":"SmartSpark financial projections"}', 'financials_smartspark_user1.pdf'),
    (13, 'lz2198', NULL, '2_smartspark', '{"presentation":"SmartSpark final presentation"}', 'presentation_smartspark_user1.pdf'),
    (14, 'zfa894', NULL, '2_smartspark', '{"peer_evaluation":"SmartSpark peer evaluation"}', NULL),
    (14, 'pd1223', NULL, '2_smartspark', '{"peer_evaluation":"SmartSpark peer evaluation"}', NULL),
    (14, 'sos229', NULL, '2_smartspark', '{"peer_evaluation":"SmartSpark peer evaluation"}', NULL),
    (14, 'lz2198', NULL, '2_smartspark', '{"peer_evaluation":"SmartSpark peer evaluation"}', NULL),
    (14, 'jod1234', NULL, '2_smartspark', '{"peer_evaluation":"SmartSpark peer evaluation"}', NULL),

    -- 3_techtitan
    (1, 'mj2381', NULL, '3_techtitan', '{"team_name":"TechTitan", "email":"techtitan1@example.com"}', NULL),
    (2, 'mj2381', NULL, '3_techtitan', '{"proposal":"TechTitan project proposal"}', 'proposal_techtitan_user1.pdf'),
    (3, 'ng1312', NULL, '3_techtitan', '{"timeline":"TechTitan project timeline"}', 'timeline_techtitan_user1.pdf'),
    (4, 'ss7238', NULL, '3_techtitan', '{"report":"TechTitan interim report"}', 'report_techtitan_user1.pdf'),
    (5, 'sf7493', NULL, '3_techtitan', '{"survey":"TechTitan market research"}', 'survey_techtitan_user1.pdf'),
    (6, 'mj2381', NULL, '3_techtitan', '{"canvas":"TechTitan business model canvas"}', 'canvas_techtitan_user1.pdf'),
    (7, 'del1234', NULL, '3_techtitan', '{"feedback":"TechTitan prototype feedback"}', 'feedback_techtitan_coach.pdf'),
    (8, 'ng1312', NULL, '3_techtitan', '{"roles":"TechTitan team roles"}', 'roles_techtitan_user1.pdf'),
    (9, 'ss7238', NULL, '3_techtitan', '{"analysis":"TechTitan competitor analysis"}', 'analysis_techtitan_user1.pdf'),
    (10, 'sf7493', NULL, '3_techtitan', '{"risks":"TechTitan risk assessment"}', 'risks_techtitan_user1.pdf'),
    (11, 'mj2381', NULL, '3_techtitan', '{"marketing":"TechTitan marketing plan"}', 'marketing_techtitan_user1.pdf'),
    (12, 'ng1312', NULL, '3_techtitan', '{"financials":"TechTitan financial projections"}', 'financials_techtitan_user1.pdf'),
    (13, 'ss7238', NULL, '3_techtitan', '{"presentation":"TechTitan final presentation"}', 'presentation_techtitan_user1.pdf'),
    (14, 'sf7493', NULL, '3_techtitan', '{"peer_evaluation":"TechTitan peer evaluation"}', NULL),
    (14, 'mj2381', NULL, '3_techtitan', '{"peer_evaluation":"TechTitan peer evaluation"}', NULL),
    (14, 'ng1312', NULL, '3_techtitan', '{"peer_evaluation":"TechTitan peer evaluation"}', NULL),
    (14, 'ss7238', NULL, '3_techtitan', '{"peer_evaluation":"TechTitan peer evaluation"}', NULL),
    (14, 'del1234', NULL, '3_techtitan', '{"peer_evaluation":"TechTitan peer evaluation"}', NULL),

    -- 5_profitpulse
    (1, 'saa384', NULL, '5_profitpulse', '{"team_name":"ProfitPulse", "email":"profitpulse1@example.com"}', NULL),
    (2, 'saa384', NULL, '5_profitpulse', '{"proposal":"ProfitPulse project proposal"}', 'proposal_profitpulse_user1.pdf'),
    (3, 'sv3824', NULL, '5_profitpulse', '{"timeline":"ProfitPulse project timeline"}', 'timeline_profitpulse_user1.pdf'),
    (4, 'yd8537', NULL, '5_profitpulse', '{"report":"ProfitPulse interim report"}', 'report_profitpulse_user1.pdf'),
    (5, 'rr2397', NULL, '5_profitpulse', '{"survey":"ProfitPulse market research"}', 'survey_profitpulse_user1.pdf'),
    (6, 'saa384', NULL, '5_profitpulse', '{"canvas":"ProfitPulse business model canvas"}', 'canvas_profitpulse_user1.pdf'),
    (7, 'lam4821', NULL, '5_profitpulse', '{"feedback":"ProfitPulse prototype feedback"}', 'feedback_profitpulse_coach.pdf'),
    (8, 'sv3824', NULL, '5_profitpulse', '{"roles":"ProfitPulse team roles"}', 'roles_profitpulse_user1.pdf'),
    (9, 'yd8537', NULL, '5_profitpulse', '{"analysis":"ProfitPulse competitor analysis"}', 'analysis_profitpulse_user1.pdf'),
    (10, 'rr2397', NULL, '5_profitpulse', '{"risks":"ProfitPulse risk assessment"}', 'risks_profitpulse_user1.pdf'),
    (11, 'saa384', NULL, '5_profitpulse', '{"marketing":"ProfitPulse marketing plan"}', 'marketing_profitpulse_user1.pdf'),
    (12, 'sv3824', NULL, '5_profitpulse', '{"financials":"ProfitPulse financial projections"}', 'financials_profitpulse_user1.pdf'),
    (13, 'yd8537', NULL, '5_profitpulse', '{"presentation":"ProfitPulse final presentation"}', 'presentation_profitpulse_user1.pdf'),
    (14, 'rr2397', NULL, '5_profitpulse', '{"peer_evaluation":"ProfitPulse peer evaluation"}', NULL),
    (14, 'saa384', NULL, '5_profitpulse', '{"peer_evaluation":"ProfitPulse peer evaluation"}', NULL),
    (14, 'sv3824', NULL, '5_profitpulse', '{"peer_evaluation":"ProfitPulse peer evaluation"}', NULL),
    (14, 'yd8537', NULL, '5_profitpulse', '{"peer_evaluation":"ProfitPulse peer evaluation"}', NULL),
    (14, 'lam4821', NULL, '5_profitpulse', '{"peer_evaluation":"ProfitPulse peer evaluation"}', NULL)
    ;
