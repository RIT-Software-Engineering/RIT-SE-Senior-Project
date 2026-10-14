INSERT INTO archive (project_id, name, title, team_name, members, sponsor, coach, poster_thumb, video, synopsis, keywords, url_slug, inactive, featured, start_date, end_date, creative, outstanding)
VALUES

    ('1_groweasy', 'GrowEasy Analytics Platform for Small Business Growth ', 'GrowEasy Analytics', 'GrowMasters', 'Miku Hatsune, Cloud Strife, Blaze Thunder, Tifa Lockhart', 'GrowEasy Inc.', 'John Doe', 'dummy/groweasy_thumb.png', 'dummy/sample_vid.mp4',
    'GrowEasy Analytics is a project aimed at developing an analytics platform for small businesses. The platform will focus on providing a user-friendly dashboard that allows
    businesses to analyze their market expansion strategies effectively. The project will address challenges such as data integration issues and the need for a limited budget and tight timeline.
    The team will work on creating a prototype of the dashboard, which will include features for market analysis and reporting. The platform will also ensure compliance with data privacy regulations
    and will be designed to handle confidential client data. The project will involve collaboration with GrowEasy Inc. to ensure that the final product meets their needs and expectations.',
    'analytics, business, growth, dashboard', 'groweasy-analytics', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    '',
    1,
    0
    ),

    ('2_smartspark', 'SmartSpark AI-Driven Marketing Campaign Tool', 'SmartSpark Marketing', 'SparkGenix', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'SmartSpark Marketing is an AI-driven marketing campaign tool designed to automate targeted ad campaigns for small businesses. The project will focus on developing a platform that utilizes AI
    to analyze social media trends and optimize ad placements. The team will work on training AI models to ensure accurate predictions and effective campaign management. Challenges include resource
    constraints and the need for a robust AI model. The final deliverables will include a campaign tool prototype and a case study demonstrating its effectiveness. The project will also involve
    collaboration with SparkVibe Agency to ensure that the platform meets industry standards and client expectations.',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('3_techtitan', 'TechTitan Scalable CRM System for Startups', 'TechTitan Solutions', 'TitanCoders', 'Mario Jumpman, Neon Glow, Solid Snake, Teto Kasane', 'Tech Titan Corp.', 'David Lee', 'dummy/techtitan_thumb.png', '',
    'TechTitan Solutions is focused on creating a scalable CRM system for tech startups. The project aims to develop a customizable platform that can adapt to the needs of small and medium-sized enterprises (SMEs).
    The team will address challenges related to scalability and user adoption, ensuring that the CRM system is cloud-based and easy to use. Key deliverables will include a prototype of the CRM system
    and a user guide to help businesses implement the solution effectively. The project will involve close collaboration with TechTitan Corp. to ensure that the final product aligns with their business goals and
    technical requirements.',
    'CRM, technology, scalability, startups', 'techtitan-solutions', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('4', 'Name 4', 'Title 4', 'Team 4', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'Description for Project 4',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('5', 'Name 5', 'Title 5', 'Team 5', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 5',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('6', 'Name 6', 'Title 6', 'Team 6', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 6',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('7', 'Name 7', 'Title 7', 'Team 7', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 7',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('8', 'Name 8', 'Title 8', 'Team 8', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 8',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('9', 'Name 9', 'Title 9', 'Team 9', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'Description for Project 9',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('10', 'Name 10', 'Title 10', 'Team 10', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 10',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('11', 'Name 11', 'Title 11', 'Team 11', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 11',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('12', 'Name 12', 'Title 12', 'Team 12', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'Description for Project 4',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('13', 'Name 13', 'Title 13', 'Team 13', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 5',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('14', 'Name 14', 'Title 14', 'Team 14', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 6',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('15', 'Name 15', 'Title 15', 'Team 15', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 7',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('16', 'Name 16', 'Title 16', 'Team 16', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 8',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('17', 'Name 17', 'Title 17', 'Team 17', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'Description for Project 9',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('18', 'Name 18', 'Title 18', 'Team 18', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 10',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('19', 'Name 19', 'Title 19', 'Team 19', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'Description for Project 9',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('20', 'Name 20', 'Title 20', 'Team 20', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 10',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('21', 'Name 21', 'Title 21', 'Team 21', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 11',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('22', 'Name 22', 'Title 22', 'Team 22', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'Description for Project 4',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('23', 'Name 23', 'Title 23', 'Team 23', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 5',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('24', 'Name 24', 'Title 24', 'Team 24', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 6',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('25', 'Name 25', 'Title 25', 'Team 25', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 7',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('26', 'Name 26', 'Title 26', 'Team 26', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 8',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('27', 'Name 27', 'Title 27', 'Team 27', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'Description for Project 9',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('28', 'Name 28', 'Title 28', 'Team 28', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'Description for Project 9',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('29', 'Name 29', 'Title 29', 'Team 29', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 10',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('30', 'Name 30', 'Title 30', 'Team 30', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 11',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('31', 'Name 31', 'Title 31', 'Team 31', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'Description for Project 4',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('32', 'Name 32', 'Title 32', 'Team 32', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 5',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('33', 'Name 33', 'Title 33', 'Team 33', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 6',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('34', 'Name 34', 'Title 34', 'Team 34', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 7',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('35', 'Name 35', 'Title 35', 'Team 35', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'Description for Project 8',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    )
;