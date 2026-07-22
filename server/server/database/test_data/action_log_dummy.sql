INSERT INTO
    action_log (
        action_template,
        system_id,
        mock_id,
        project,
        form_data,
        files,
        submission_datetime
    )
VALUES
    -- Team Name Submission 
    (
        15,
        'zh7558',
        'del1234',
        '4_buzzboost',
        '{"team_name":"BuzzBoost", "email":"test"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-01-25'
        )
    ),
    (
        15,
        'saa384',
        NULL,
        '5_profitpulse',
        '{"team_name":"ProfitPulse", "email":"test"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-01-27'
        )
    ),
    (
        15,
        'aeg836',
        NULL,
        '7_carecraze',
        '{"team_name":"CareCraze", "email":"test"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-01-29'
        )
    ),
    (
        15,
        'pks286',
        NULL,
        '8_dataforge',
        '{"team_name":"DataForge", "email":"test"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-01-30'
        )
    ),
    (
        15,
        'rf9472',
        NULL,
        '9_ecoedge',
        '{"team_name":"EcoEdge", "email":"test"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-01-31'
        )
    ),
    -- Project Proposal
    (
        16,
        'zh7558',
        NULL,
        '4_buzzboost',
        '{"proposal" :"BuzzBoost marketing strategy proposal"}',
        'proposal_zh7558.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-02-15'
        )
    ),
    (
        16,
        'lh7488',
        NULL,
        '4_buzzboost',
        '{"proposal":"BuzzBoost marketing strategy proposal"}',
        'proposal_lh7488.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-02-16'
        )
    ),
    (
        16,
        'gs9947',
        NULL,
        '4_buzzboost',
        '{"proposal":"BuzzBoost marketing strategy proposal"}',
        'proposal_gs9947.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-02-17'
        )
    ),
    (
        16,
        'cr8473',
        NULL,
        '4_buzzboost',
        '{"proposal":"BuzzBoost marketing strategy proposal"}',
        'proposal_cr8473.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-02-18'
        )
    ),
    -- project timeline
    (
        17,
        'zh7558',
        NULL,
        '4_buzzboost',
        '{"timeline":"Q1: Market research, Q2: Strategy development, Q3: Implementation, Q4: Review"}',
        'timeline_zh7558.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-03-08'
        )
    ),
    (
        17,
        'lh7488',
        NULL,
        '4_buzzboost',
        '{"timeline":"Q1: Market research, Q2: Strategy development, Q3: Implementation, Q4: Review"}',
        'timeline_lh7488.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-03-09'
        )
    ),
    (
        17,
        'gs9947',
        NULL,
        '4_buzzboost',
        '{"timeline":"Q1: Market research, Q2: Strategy development, Q3: Implementation, Q4: Review"}',
        'timeline_gs9947.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-03-10'
        )
    ),
    (
        17,
        'cr8473',
        NULL,
        '4_buzzboost',
        '{"timeline":"Q1: Market research, Q2: Strategy development, Q3: Implementation, Q4: Review"}',
        'timeline_cr8473.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-03-11'
        )
    ),
    -- report submission
    (
        18,
        'zh7558',
        NULL,
        '4_buzzboost',
        '{"report":"BuzzBoost final report"}',
        'report_zh7558.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-04-12'
        )
    ),
    (
        18,
        'lh7488',
        NULL,
        '4_buzzboost',
        '{"report":"BuzzBoost final report"}',
        'report_lh7488.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-04-13'
        )
    ),
    (
        18,
        'gs9947',
        'del1234',
        '4_buzzboost',
        '{"report":"BuzzBoost final report"}',
        'report_gs9947.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-04-14'
        )
    ),
    (
        18,
        'cr8473',
        NULL,
        '4_buzzboost',
        '{"report":"BuzzBoost final report"}',
        'report_cr8473.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-04-15'
        )
    ),
    -- Team Member Roles
    (
        22,
        'rf9472',
        NULL,
        '9_ecoedge',
        '{"roles":"Ryu: Project Lead, Ember: Designer, Chun: Developer, Sparkle: Analyst"}',
        'roles_rf9472.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-08-05'
        )
    ),
    (
        22,
        'ef9474',
        'joh1234',
        '9_ecoedge',
        '{"roles":"Ryu: Project Lead, Ember: Designer, Chun: Developer, Sparkle: Analyst"}',
        'roles_ef9474.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-08-06'
        )
    ),
    (
        22,
        'zh7558',
        NULL,
        '4_buzzboost',
        '{"roles":"Zelda: Project Lead, Link: Designer, Glimmer: Developer, Comet: Analyst"}',
        'roles_zh7558.pdf',
        DATE(
            strftime('%Y', DATE('now')) || '-08-07'
        )
    ),
    -- Midterm Peer Evaluation Form
    (
        29,
        'zh7558',
        NULL,
        '4_buzzboost',
        '{
            "CoachFeedback": {
                "Provide Specific Comments About Any Members Or Situations": "Link was an absolute standout, always leading with enthusiasm and creativity. The team worked well overall, but Link’s energy carried us.",
                "Identify Disputes Or Problems That Happened And How They Were Handled": "There was some miscommunication about task deadlines between Glimmer and Comet, but we resolved it by clarifying roles in a group meeting."
            },
            "Students": {
                "Link Hero": {
                "Feedback": {
                    "Cooperation And Attitude": "Link is a dream to work with—always positive, collaborative, and inspiring. He’s basically perfect!",
                    "Quantity Of Work": "Link consistently went above and beyond, delivering more than expected on every task.",
                    "Initiative": "Link took the lead on multiple tasks without being asked, always pushing the team forward."
                },
                "Ratings": {
                    "Cooperation And Attitude": 5,
                    "Quantity Of Work": 5,
                    "Initiative": 5,
                    "Dependability": 5,
                    "Group Maintenance": 5
                }
                },
                "Glimmer Star": {
                "Feedback": {
                    "Cooperation And Attitude": "Glimmer was generally cooperative but sometimes seemed distracted during meetings.",
                    "Quantity Of Work": "Glimmer completed their tasks, but the output was average and could’ve been more thorough.",
                    "Initiative": "Glimmer followed instructions well but didn’t take much initiative on their own."
                },
                "Ratings": {
                    "Cooperation And Attitude": 3,
                    "Quantity Of Work": 3,
                    "Initiative": 3,
                    "Dependability": 4,
                    "Group Maintenance": 3
                }
                },
                "Comet Rush": {
                "Feedback": {
                    "Cooperation And Attitude": "Comet was okay to work with but had moments of frustration that affected team morale.",
                    "Quantity Of Work": "Comet’s work was sufficient but often submitted just before deadlines.",
                    "Initiative": "Comet needed prompting to take on additional responsibilities."
                },
                "Ratings": {
                    "Cooperation And Attitude": 3,
                    "Quantity Of Work": 3,
                    "Initiative": 4,
                    "Dependability": 3,
                    "Group Maintenance": 3
                }
                }
            },
            "Submitter": "Zelda Hyrule"
            }',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-08-01'
        )
    ),
    (
        29,
        'lh7488',
        NULL,
        '4_buzzboost',
        '{"CoachFeedback":{"Provide Specific Comments About Any Members Or Situations":"Princess Zelda was phenomenal, always keeping the team motivated and on track. The group worked hard, but her leadership made a huge difference.","Identify Disputes Or Problems That Happened And How They Were Handled.":"There was some confusion over who was handling the final presentation slides. We sorted it out by assigning clear roles in our last meeting."},"Students":{"Glimmer Star":{"Feedback":{"Cooperation And Attitude":"Glimmer was cooperative and contributed to discussions, though sometimes seemed less engaged.","Quantity Of Work":"Glimmer did their share, but the work was solid rather than outstanding.","Initiative":"Glimmer followed through on assigned tasks but didn’t take on extra responsibilities."},"Ratings":{"Cooperation And Attitude":3,"Quantity Of Work":4,"Initiative":3,"Dependability":2,"Group Maintenance":2}},"Zelda Hyrule":{"Feedback":{"Cooperation And Attitude":"Princess Zelda is incredible—always positive, supportive, and a true team player. She made this project fun!","Quantity Of Work":"Princess Zelda is incredible—always positive, supportive, and a true team player. She made this project fun!","Initiative":"Princess Zelda took charge when needed and always had great ideas to push us forward."},"Ratings":{"Cooperation And Attitude":5,"Quantity Of Work":5,"Initiative":5,"Dependability":5,"Group Maintenance":5}},"Comet Rush":{"Feedback":{"Cooperation And Attitude":"Comet worked okay with the team but got frustrated at times, which slowed us down.","Quantity Of Work":"Comet completed their tasks, but some submissions felt rushed.","Initiative":"Comet needed reminders to stay on track and didn’t volunteer for extra work."},"Ratings":{"Cooperation And Attitude":3,"Quantity Of Work":3,"Initiative":4,"Dependability":2,"Group Maintenance":2}}},"Submitter":"Link Hero"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-08-12'
        )
    ),
    (
        29,
        'gs9947',
        NULL,
        '4_buzzboost',
        '{ 
            "CoachFeedback": {
                "Provide Specific Comments About Any Members Or Situations": "The team worked well together overall. Zelda and Link were very proactive, which helped keep us organized.",
                "Identify Disputes Or Problems That Happened And How They Were Handled": "There was a mix-up about task assignments early on, but we clarified everything in a group chat and got back on track."
                },
                "Students": {
                "Zelda Hyrule": {
                    "Feedback": {
                    "Cooperation And Attitude": "Zelda was friendly and worked well with everyone, always keeping the mood light.",
                    "Quantity Of Work": "Zelda contributed a lot, especially to the planning and final deliverables.",
                    "Initiative": "Zelda was quick to suggest ideas and take on tasks when needed."
                    },
                    "Ratings": {
                    "Cooperation And Attitude": 4,
                    "Quantity Of Work": 4,
                    "Initiative": 4,
                    "Dependability": 4,
                    "Group Maintenance": 3
                    }
                },
                "Link Hero": {
                    "Feedback": {
                    "Cooperation And Attitude": "Link was enthusiastic and easy to work with, though sometimes overly focused on his own ideas.",
                    "Quantity Of Work": "Link put in a lot of effort, especially on the creative aspects of the project.",
                    "Initiative": "Link often took the lead, which was helpful but could feel intense at times."
                    },
                    "Ratings": {
                    "Cooperation And Attitude": 4,
                    "Quantity Of Work": 4,
                    "Initiative": 4,
                    "Dependability": 3,
                    "Group Maintenance": 3
                    }
                },
                "Comet Rush": {
                    "Feedback": {
                    "Cooperation And Attitude": "Comet was okay but seemed stressed, which affected team vibe at times.",
                    "Quantity Of Work": "Comet got their work done, but it was often just meeting the minimum requirements.",
                    "Initiative": "Comet didn’t step up much beyond what was assigned."
                    },
                    "Ratings": {
                    "Cooperation And Attitude": 3,
                    "Quantity Of Work": 3,
                    "Initiative": 2,
                    "Dependability": 3,
                    "Group Maintenance": 3
                    }
                }
                },
                "Submitter": "Glimmer Star"
            }',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-08-02'
        )
    ),
    (
        29,
        'cr8473',
        NULL,
        '4_buzzboost',
        '{
            "CoachFeedback": {
            "Provide Specific Comments About Any Members Or Situations": "Zelda and Link took charge a lot, which was helpful but sometimes felt like they dominated the project. Overall, we got the job done.",
            "Identify Disputes Or Problems That Happened And How They Were Handled": "There was some tension over deadlines because tasks weren’t clearly assigned at first. We had a meeting to sort it out, which helped."
            },
            "Students": {
            "Zelda Hyrule": {
                "Feedback": {
                "Cooperation And Attitude": "Zelda was upbeat and cooperative, though she focused a lot on Link’s ideas.",
                "Quantity Of Work": "Zelda did a solid amount of work, especially on organizing the project.",
                "Initiative": "Zelda was proactive in planning and keeping us on schedule."
                },
                "Ratings": {
                "Cooperation And Attitude": 4,
                "Quantity Of Work": 4,
                "Initiative": 4,
                "Dependability": 3,
                "Group Maintenance": 3
                }
            },
            "Link Hero": {
                "Feedback": {
                "Cooperation And Attitude": "Link was enthusiastic and worked hard, but he could be a bit overbearing at times.",
                "Quantity Of Work": "Link contributed a lot, especially to the presentation and visuals.",
                "Initiative": "Link was always ready to take on tasks, sometimes before others could."
                },
                "Ratings": {
                "Cooperation And Attitude": 4,
                "Quantity Of Work": 4,
                "Initiative": 4,
                "Dependability": 3,
                "Group Maintenance": 3
                }
            },
            "Glimmer Star": {
                "Feedback": {
                "Cooperation And Attitude": "Glimmer was fine to work with but didn’t always speak up in meetings.",
                "Quantity Of Work": "Glimmer’s work was decent but not particularly standout.",
                "Initiative": "Glimmer mostly stuck to assigned tasks without taking extra steps."
                },
                "Ratings": {
                "Cooperation And Attitude": 3,
                "Quantity Of Work": 3,
                "Initiative": 3,
                "Dependability": 3,
                "Group Maintenance": 2
                }
            }
            },
            "Submitter": "Comet Rush"
            }',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-07-23'
        )
    ),
    (
        29,
        'del1234',
        NULL,
        '4_buzzboost',
        '{"Submitter":"COACH","Students":{"Link Hero":{"Feedback":"Some feedback here","UsedAI":true,"AverageRatings":{"Cooperation And Attitude":"4.333333333333333","Quantity Of Work":"4.333333333333333","Initiative":"4.333333333333333","Dependability":"3.666666666666667","Group Maintenance":"3.3333333333333335"},"SelfRating":{}},"Glimmer Star":{"Feedback":"Some Feedback here","UsedAI":false,"AverageRatings":{"Cooperation And Attitude":"3","Quantity Of Work":"3.333333333333333","Initiative":"3","Dependability":"2.6666666666666665","Group Maintenance":"2.333333333333333"},"SelfRating":{}},"Zelda Hyrule":{"Feedback":"Some Feedback here","UsedAI":false,"AverageRatings":{"Cooperation And Attitude":"4.333333333333333","Quantity Of Work":"4.333333333333333","Initiative":"4.333333333333333","Dependability":"4","Group Maintenance":"3.666666666666667"},"SelfRating":{}},"Comet Rush":{"Feedback":"Some Feedback here","UsedAI":false,"AverageRatings":{"Cooperation And Attitude":"3","Quantity Of Work":"3","Initiative":"2.9999999999999996","Dependability":"2","Group Maintenance":"2.333333333333333"},"SelfRating":{}}}}',
        NULL,
        DATE(
            strftime('%Y', DATE('now')) || '-07-25'
        )
    ),
    -- Past projects: 1_groweasy, 2_smartspark, 3_techtitan, 5_profitpulse
    -- 1_groweasy
    (
        1,
        'miku99',
        NULL,
        '1_groweasy',
        '{"team_name":"GrowEasy", "email":"groweasy1@example.com"}',
        NULL,
        strftime('%Y', DATE('now', '-1 year')) || '-01-15'
    ),
    (
        2,
        'miku99',
        NULL,
        '1_groweasy',
        '{"proposal":"GrowEasy project proposal"}',
        'proposal_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-02-01'
    ),
    (
        3,
        'cs1290',
        NULL,
        '1_groweasy',
        '{"timeline":"GrowEasy project timeline"}',
        'timeline_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-02-15'
    ),
    (
        4,
        'bt1293',
        NULL,
        '1_groweasy',
        '{"report":"GrowEasy interim report"}',
        'report_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-03-01'
    ),
    (
        5,
        'til345',
        NULL,
        '1_groweasy',
        '{"survey":"GrowEasy market research"}',
        'survey_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-03-15'
    ),
    (
        6,
        'miku99',
        NULL,
        '1_groweasy',
        '{"canvas":"GrowEasy business model canvas"}',
        'canvas_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-04-01'
    ),
    (
        7,
        'jod1234',
        NULL,
        '1_groweasy',
        '{"feedback":"GrowEasy prototype feedback"}',
        'feedback_groweasy_coach.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-04-15'
    ),
    (
        8,
        'cs1290',
        NULL,
        '1_groweasy',
        '{"roles":"GrowEasy team roles"}',
        'roles_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-05-01'
    ),
    (
        9,
        'bt1293',
        NULL,
        '1_groweasy',
        '{"analysis":"GrowEasy competitor analysis"}',
        'analysis_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-05-15'
    ),
    (
        10,
        'til345',
        NULL,
        '1_groweasy',
        '{"risks":"GrowEasy risk assessment"}',
        'risks_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-06-01'
    ),
    (
        11,
        'miku99',
        NULL,
        '1_groweasy',
        '{"marketing":"GrowEasy marketing plan"}',
        'marketing_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-06-15'
    ),
    (
        12,
        'cs1290',
        NULL,
        '1_groweasy',
        '{"financials":"GrowEasy financial projections"}',
        'financials_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-07-01'
    ),
    (
        13,
        'miku99',
        NULL,
        '1_groweasy',
        '{"presentation":"GrowEasy final presentation"}',
        'presentation_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-07-15'
    ),
    (
        13,
        'cs1290',
        'jod1234',
        '1_groweasy',
        '{"presentation":"GrowEasy final presentation"}',
        'presentation_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-07-16'
    ),
    (
        13,
        'bt1293',
        NULL,
        '1_groweasy',
        '{"presentation":"GrowEasy final presentation"}',
        'presentation_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-07-17'
    ),
    (
        13,
        'til345',
        NULL,
        '1_groweasy',
        '{"presentation":"GrowEasy final presentation"}',
        'presentation_groweasy_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-07-18'
    ),
    (
        14,
        'bt1293',
        NULL,
        '1_groweasy',
        '{"peer_evaluation":"GrowEasy peer evaluation"}',
        NULL,
        strftime('%Y', DATE('now', '-1 year')) || '-07-19'
    ),
    (
        14,
        'miku99',
        'jod1234',
        '1_groweasy',
        '{"peer_evaluation":"GrowEasy peer evaluation"}',
        NULL,
        strftime('%Y', DATE('now', '-1 year')) || '-07-20'
    ),
    (
        14,
        'cs1290',
        NULL,
        '1_groweasy',
        '{"peer_evaluation":"GrowEasy peer evaluation"}',
        NULL,
        strftime('%Y', DATE('now', '-1 year')) || '-07-21'
    ),
    (
        14,
        'til345',
        NULL,
        '1_groweasy',
        '{"peer_evaluation":"GrowEasy peer evaluation"}',
        NULL,
        strftime('%Y', DATE('now', '-1 year')) || '-07-22'
    ),
    (
        14,
        'jod1234',
        NULL,
        '1_groweasy',
        '{"peer_evaluation":"GrowEasy peer evaluation"}',
        NULL,
        strftime('%Y', DATE('now', '-1 year')) || '-07-23'
    ),
    -- 2_smartspark
    (
        1,
        'pb1233', -- was 'pd1223'
        NULL,
        '2_smartspark',
        '{"team_name":"SmartSpark", "email":"smartspark1@example.com"}',
        NULL,
        strftime('%Y', DATE('now', '-1 year')) || '-01-20'
    ),
    (
        2,
        'pb1233', -- was 'pd1223'
        NULL,
        '2_smartspark',
        '{"proposal":"SmartSpark project proposal"}',
        'proposal_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-01-21'
    ),
    (
        3,
        'sos339', -- was 'sos229'
        NULL,
        '2_smartspark',
        '{"timeline":"SmartSpark project timeline"}',
        'timeline_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-02-05'
    ),
    (
        4,
        'ls2198', -- was 'lz2198'
        NULL,
        '2_smartspark',
        '{"report":"SmartSpark interim report"}',
        'report_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-02-20'
    ),
    (
        5,
        'zfa894',
        NULL,
        '2_smartspark',
        '{"survey":"SmartSpark market research"}',
        'survey_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-02-21'
    ),
    (
        6,
        'pb1233',
        NULL,
        '2_smartspark',
        '{"canvas":"SmartSpark business model canvas"}',
        'canvas_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-02-22'
    ),
    (
        7,
        'jod1234',
        NULL,
        '2_smartspark',
        '{"feedback":"SmartSpark prototype feedback"}',
        'feedback_smartspark_coach.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-03-04'
    ),
    (
        8,
        'sos339',
        NULL,
        '2_smartspark',
        '{"roles":"SmartSpark team roles"}',
        'roles_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-03-05'
    ),
    (
        9,
        'ls2198',
        NULL,
        '2_smartspark',
        '{"analysis":"SmartSpark competitor analysis"}',
        'analysis_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-03-06'
    ),
    (
        10,
        'zfa894',
        NULL,
        '2_smartspark',
        '{"risks":"SmartSpark risk assessment"}',
        'risks_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-03-20'
    ),
    (
        11,
        'pb1233',
        NULL,
        '2_smartspark',
        '{"marketing":"SmartSpark marketing plan"}',
        'marketing_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-03-21'
    ),
    (
        12,
        'sos339',
        NULL,
        '2_smartspark',
        '{"financials":"SmartSpark financial projections"}',
        'financials_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-04-17'
    ),
    (
        13,
        'ls2198',
        NULL,
        '2_smartspark',
        '{"presentation":"SmartSpark final presentation"}',
        'presentation_smartspark_user1.pdf',
        strftime('%Y', DATE('now', '-1 year')) || '-04-18'
    ),
    (
        14,
        'zfa894',
        'jod1234',
        '2_smartspark',
        '{"peer_evaluation":"SmartSpark peer evaluation"}',
        NULL,
        strftime('%Y', DATE('now', '-1 year')) || '-05-19'
    ),
    (
        14,
        'pb1233',
        'jod1234',
        '2_smartspark',
        '{"peer_evaluation":"SmartSpark peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-05-21'
        )
    ),
    (
        14,
        'sos339', 
        NULL,
        '2_smartspark',
        '{"peer_evaluation":"SmartSpark peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-05-22'
        )
    ),
    (
        14,
        'ls2198', 
        NULL,
        '2_smartspark',
        '{"peer_evaluation":"SmartSpark peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-05-23'
        )
    ),
    (
        14,
        'jod1234',
        NULL,
        '2_smartspark',
        '{"peer_evaluation":"SmartSpark peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-05-24'
        )
    ),
    -- 3_techtitan
    (
        1,
        'mj3281',
        'del1234',
        '3_techtitan',
        '{"team_name":"TechTitan", "email":"techtitan1@example.com"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-01'
        )
    ),
    (
        2,
        'mj3281',
        NULL,
        '3_techtitan',
        '{"proposal":"TechTitan project proposal"}',
        'proposal_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-02'
        )
    ),
    (
        3,
        'ng1312',
        NULL,
        '3_techtitan',
        '{"timeline":"TechTitan project timeline"}',
        'timeline_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-03'
        )
    ),
    (
        4,
        'ss7238',
        NULL,
        '3_techtitan',
        '{"report":"TechTitan interim report"}',
        'report_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-04'
        )
    ),
    (
        5,
        'sf7493',
        NULL,
        '3_techtitan',
        '{"survey":"TechTitan market research"}',
        'survey_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-05'
        )
    ),
    (
        6,
        'mj3281',
        'del1234',
        '3_techtitan',
        '{"canvas":"TechTitan business model canvas"}',
        'canvas_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-06'
        )
    ),
    (
        7,
        'del1234',
        NULL,
        '3_techtitan',
        '{"feedback":"TechTitan prototype feedback"}',
        'feedback_techtitan_coach.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-07'
        )
    ),
    (
        8,
        'ng1312',
        NULL,
        '3_techtitan',
        '{"roles":"TechTitan team roles"}',
        'roles_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-08'
        )
    ),
    (
        9,
        'ss7238',
        NULL,
        '3_techtitan',
        '{"analysis":"TechTitan competitor analysis"}',
        'analysis_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-09'
        )
    ),
    (
        10,
        'sf7493',
        NULL,
        '3_techtitan',
        '{"risks":"TechTitan risk assessment"}',
        'risks_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-10'
        )
    ),
    (
        11,
        'mj3281',
        NULL,
        '3_techtitan',
        '{"marketing":"TechTitan marketing plan"}',
        'marketing_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-11'
        )
    ),
    (
        12,
        'ng1312',
        NULL,
        '3_techtitan',
        '{"financials":"TechTitan financial projections"}',
        'financials_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-12'
        )
    ),
    (
        13,
        'ss7238',
        NULL,
        '3_techtitan',
        '{"presentation":"TechTitan final presentation"}',
        'presentation_techtitan_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-13'
        )
    ),
    (
        14,
        'sf7493',
        NULL,
        '3_techtitan',
        '{"peer_evaluation":"TechTitan peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-14'
        )
    ),
    (
        14,
        'mj3281',
        NULL,
        '3_techtitan',
        '{"peer_evaluation":"TechTitan peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-15'
        )
    ),
    (
        14,
        'ng1312',
        NULL,
        '3_techtitan',
        '{"peer_evaluation":"TechTitan peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-16'
        )
    ),
    (
        14,
        'ss7238',
        NULL,
        '3_techtitan',
        '{"peer_evaluation":"TechTitan peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-17'
        )
    ),
    (
        14,
        'del1234',
        NULL,
        '3_techtitan',
        '{"peer_evaluation":"TechTitan peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-06-18'
        )
    ),
    -- 5_profitpulse
    (
        1,
        'saa384',
        'lam4821',
        '5_profitpulse',
        '{"team_name":"ProfitPulse", "email":"profitpulse1@example.com"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-01'
        )
    ),
    (
        2,
        'saa384',
        NULL,
        '5_profitpulse',
        '{"proposal":"ProfitPulse project proposal"}',
        'proposal_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-02'
        )
    ),
    (
        3,
        'sv3824',
        NULL,
        '5_profitpulse',
        '{"timeline":"ProfitPulse project timeline"}',
        'timeline_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-03'
        )
    ),
    (
        4,
        'yd8537',
        NULL,
        '5_profitpulse',
        '{"report":"ProfitPulse interim report"}',
        'report_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-04'
        )
    ),
    (
        5,
        'rr2397',
        NULL,
        '5_profitpulse',
        '{"survey":"ProfitPulse market research"}',
        'survey_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-05'
        )
    ),
    (
        6,
        'saa384',
        NULL,
        '5_profitpulse',
        '{"canvas":"ProfitPulse business model canvas"}',
        'canvas_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-06'
        )
    ),
    (
        7,
        'lam4821',
        NULL,
        '5_profitpulse',
        '{"feedback":"ProfitPulse prototype feedback"}',
        'feedback_profitpulse_coach.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-07'
        )
    ),
    (
        8,
        'sv3824',
        'lam4821',
        '5_profitpulse',
        '{"roles":"ProfitPulse team roles"}',
        'roles_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-08'
        )
    ),
    (
        9,
        'yd8537',
        NULL,
        '5_profitpulse',
        '{"analysis":"ProfitPulse competitor analysis"}',
        'analysis_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-09'
        )
    ),
    (
        10,
        'rr2397',
        NULL,
        '5_profitpulse',
        '{"risks":"ProfitPulse risk assessment"}',
        'risks_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-10'
        )
    ),
    (
        11,
        'saa384',
        NULL,
        '5_profitpulse',
        '{"marketing":"ProfitPulse marketing plan"}',
        'marketing_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-11'
        )
    ),
    (
        12,
        'sv3824',
        NULL,
        '5_profitpulse',
        '{"financials":"ProfitPulse financial projections"}',
        'financials_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-12'
        )
    ),
    (
        13,
        'yd8537',
        NULL,
        '5_profitpulse',
        '{"presentation":"ProfitPulse final presentation"}',
        'presentation_profitpulse_user1.pdf',
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-13'
        )
    ),
    (
        14,
        'rr2397',
        NULL,
        '5_profitpulse',
        '{"peer_evaluation":"ProfitPulse peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-14'
        )
    ),
    (
        14,
        'saa384',
        NULL,
        '5_profitpulse',
        '{"peer_evaluation":"ProfitPulse peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-15'
        )
    ),
    (
        14,
        'sv3824',
        NULL,
        '5_profitpulse',
        '{"peer_evaluation":"ProfitPulse peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-16'
        )
    ),
    (
        14,
        'yd8537',
        NULL,
        '5_profitpulse',
        '{"peer_evaluation":"ProfitPulse peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-17'
        )
    ),
    (
        14,
        'lam4821',
        NULL,
        '5_profitpulse',
        '{"peer_evaluation":"ProfitPulse peer evaluation"}',
        NULL,
        DATE(
            strftime('%Y', DATE('now', '-1 year')) || '-07-18'
        )
    );