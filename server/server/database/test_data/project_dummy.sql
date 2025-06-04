INSERT INTO projects (project_id, status, title, organization, primary_contact, contact_email, contact_phone,
    attachments, background_info, project_description, project_scope, project_challenges, constraints_assumptions,
    sponsor_provided_resources, project_search_keywords, sponsor_deliverables, proprietary_info, sponsor_avail_checked,
    sponsor_alternate_time, project_agreements_checked, assignment_of_rights, team_name,
    sponsor, poster, video, website, synopsis, semester)
VALUES    
    ('1', 'in progress', 'GrowEasy: Sustainable Business Blitz', 'EcoCorp', 'Jane Doe', 'jane.doe@ecocorp.com', '555-0101', 'proposal.pdf',
     'EcoCorp focuses on sustainability', 'Develop a green marketing strategy', 'Create campaign for eco-products', 'Market saturation', 'Budget under $10k',
     'Marketing materials', 'sustainability, marketing, eco-friendly', 'Campaign plan, report', 'None', 1, '2024-08-30 10:00:00', 1, 'standard', 'Green Innovators',
     1, 'poster1.jpg', 'video1.mp4', 'greenwave.com', 'Eco-friendly campaign plan', 12),

    ('2', 'submitted', 'TechTitan: Innovate to Celebrate', 'TechTrend Inc.', 'John Smith', 'john.smith@techtrend.com', '555-0102', 'techplan.pdf',
     'TechTrend leads in tech solutions', 'Build an app for customer engagement', 'App prototype development', 'Tight timeline', 'Team size limited to 5',
     'Development tools', 'app development, tech, engagement', 'App prototype, user guide', 'Confidential API data', 1, '2024-01-18 14:00:00', 1, 'shared', 'Tech Titans',
     2, 'poster2.jpg', 'video2.mp4', 'techtrend.app', 'Customer engagement app', 11),    ('3', 'candidate', 'CareCraze: Wellness Wonders', 'HealthNow', 'Mary Johnson', 'mary.johnson@healthnow.org', '555-0103', 'healthprop.pdf',
     'HealthNow promotes wellness', 'Design a wellness program', 'Program for employee health', 'Scalability issues', 'Must be low-cost',
     'Training materials', 'wellness, health, program', 'Program outline, metrics', 'None', 0, '2023-09-01 09:00:00', 0, 'none', 'Health Heroes',
     3, 'poster3.jpg', 'video3.mp4', 'healthboost.org', 'Employee wellness program', 10),

    ('4', 'in progress', 'DataForge: Smart Analytics Platform', 'DataFlow Solutions', 'Alex Chen', 'alex.chen@dataflow.com', '555-0104', 'analytics_proposal.pdf',
     'DataFlow Solutions specializes in business intelligence', 'Build an AI-powered analytics dashboard', 'Create predictive analytics tools for small businesses', 'Data privacy compliance', 'Cloud infrastructure costs under $15k',
     'AWS credits, sample datasets', 'analytics, AI, dashboard, business intelligence', 'Dashboard prototype, user documentation', 'Client data models', 1, '2025-01-15 13:00:00', 1, 'standard', 'Data Innovators',
     4, 'poster4.jpg', 'video4.mp4', 'dataforge.platform', 'AI-powered business analytics dashboard', 5)

--     (
--         'projectid','submitted', 'title', 'organization', 'primary-contact', 'contact-email', 'contact-phone', NULL,
--         'Some background info', 'A projct description', 'A narrow scope', 'Some challenges', 'some constraints', NULL,
--         'key, word, stuff', 'a list of deliverables', 'proprietary info here', 'on', NULL, 'on', 'full-rights', NULL,
--         NULL, NULL, NULL, NULL, NULL, NULL
--     ),
;
