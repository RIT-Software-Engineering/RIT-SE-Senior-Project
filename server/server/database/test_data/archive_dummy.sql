INSERT INTO archive (project_id, name, title, team_name, members, sponsor, coach, poster_thumb, synopsis, keywords, url_slug, inactive, featured, start_date, end_date, creative)
VALUES

    ('1_groweasy', 'GrowEasy Analytics Platform for Small Business Growth ', 'GrowEasy Analytics', 'GrowMasters', 'Miku Hatsune, Cloud Strife, Blaze Thunder, Tifa Lockhart', 'GrowEasy Inc.', 'John Doe', 'dummy/groweasy_thumb.png',
    'GrowEasy Analytics is a project aimed at developing an analytics platform for small businesses. The platform will focus on providing a user-friendly dashboard that allows
    businesses to analyze their market expansion strategies effectively. The project will address challenges such as data integration issues and the need for a limited budget and tight timeline.
    The team will work on creating a prototype of the dashboard, which will include features for market analysis and reporting. The platform will also ensure compliance with data privacy regulations
    and will be designed to handle confidential client data. The project will involve collaboration with GrowEasy Inc. to ensure that the final product meets their needs and expectations.',
    'analytics, business, growth, dashboard', 'groweasy-analytics', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    1
    ),

    ('2_smartspark', 'SmartSpark AI-Driven Marketing Campaign Tool', 'SmartSpark Marketing', 'SparkGenix', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png',
    'SmartSpark Marketing is an AI-driven marketing campaign tool designed to automate targeted ad campaigns for small businesses. The project will focus on developing a platform that utilizes AI
    to analyze social media trends and optimize ad placements. The team will work on training AI models to ensure accurate predictions and effective campaign management. Challenges include resource
    constraints and the need for a robust AI model. The final deliverables will include a campaign tool prototype and a case study demonstrating its effectiveness. The project will also involve
    collaboration with SparkVibe Agency to ensure that the platform meets industry standards and client expectations.',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0
    ),

    ('3_techtitan', 'TechTitan Scalable CRM System for Startups', 'TechTitan Solutions', 'TitanCoders', 'Mario Jumpman, Neon Glow, Solid Snake, Teto Kasane', 'Tech Titan Corp.', 'David Lee', 'dummy/techtitan_thumb.png',
    'TechTitan Solutions is focused on creating a scalable CRM system for tech startups. The project aims to develop a customizable platform that can adapt to the needs of small and medium-sized enterprises (SMEs).
    The team will address challenges related to scalability and user adoption, ensuring that the CRM system is cloud-based and easy to use. Key deliverables will include a prototype of the CRM system
    and a user guide to help businesses implement the solution effectively. The project will involve close collaboration with TechTitan Corp. to ensure that the final product aligns with their business goals and
    technical requirements.',
    'CRM, technology, scalability, startups', 'techtitan-solutions', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0
    ),

    ('4', 'Name 4', 'Title 4', 'Team 4', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '',
    'Description for Project 4',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0
    ),

    ('5', 'Name 5', 'Title 5', 'Team 5', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png',
    'Description for Project 5',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0
    ),

    ('6', 'Name 6', 'Title 6', 'Team 6', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png',
    'Description for Project 6',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0
    ),

    ('7', 'Name 7', 'Title 7', 'Team 7', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png',
    'Description for Project 7',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0
    ),

    ('8', 'Name 8', 'Title 8', 'Team 8', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png',
    'Description for Project 8',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0
    ),

    ('9', 'Name 9', 'Title 9', 'Team 9', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '',
    'Description for Project 9',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0
    ),

    ('10', 'Name 10', 'Title 10', 'Team 10', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png',
    'Description for Project 10',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0
    ),

    ('11', 'Name 11', 'Title 11', 'Team 11', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png',
    'Description for Project 11',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0
    )
;