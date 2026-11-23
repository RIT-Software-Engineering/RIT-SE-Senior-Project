INSERT INTO archive (project_id, name, title, team_name, members, sponsor, coach, poster_thumb, video, synopsis, keywords, url_slug, inactive, featured, start_date, end_date, creative, outstanding)
VALUES

    ('1_groweasy', 'GrowEasy Analytics Platform for Small Business Growth ', 'GrowEasy Analytics', 'GrowMasters', 'Miku Hatsune, Cloud Strife, Blaze Thunder, Tifa Lockhart', 'GrowEasy Inc.', 'John Doe', 'dummy/groweasy_thumb.png', '',
    'GrowEasy Analytics is a project aimed at developing an analytics platform for small businesses. The platform will focus on providing a user-friendly dashboard that allows
    businesses to analyze their market expansion strategies effectively. The project will address challenges such as data integration issues and the need for a limited budget and tight timeline.
    The team will work on creating a prototype of the dashboard, which will include features for market analysis and reporting. The platform will also ensure compliance with data privacy regulations
    and will be designed to handle confidential client data. The project will involve collaboration with GrowEasy Inc. to ensure that the final product meets their needs and expectations.',
    'analytics, business, growth, dashboard', 'groweasy-analytics', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    '',
    1,
    1
    ),

    ('2_smartspark', 'SmartSpark AI-Driven Marketing Campaign Tool', 'SmartSpark Marketing', 'SparkGenix', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'SmartSpark Marketing is an AI-driven marketing campaign tool designed to automate targeted ad campaigns for small businesses. The project will focus on developing a platform that utilizes AI
    to analyze social media trends and optimize ad placements. The team will work on training AI models to ensure accurate predictions and effective campaign management. Challenges include resource
    constraints and the need for a robust AI model. The final deliverables will include a campaign tool prototype and a case study demonstrating its effectiveness. The project will also involve
    collaboration with SparkVibe Agency to ensure that the platform meets industry standards and client expectations.',
    'marketing, AI, automation, social media', 'smartspark-marketing', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    '',
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
    '',
    0,
    0
    ),

    ('4_pulseflow', 'PulseFlow Automated Campaign Analytics', 'PulseFlow Analytics', 'Team 4', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'PulseFlow Analytics builds an automated reporting dashboard to track multi-channel digital marketing campaigns in real time. The project streamlines KPI aggregation across paid search and display networks, helping marketing managers optimize ad spend without manual spreadsheet work.',
    'marketing, AI, automation, social media', 'pulseflow-analytics', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    '',
    0,
    1
    ),

    ('5_echocraft', 'EchoCraft AI Copywriting Assistant', 'EchoCraft Studio', 'Team 5', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'EchoCraft Studio is an AI-driven copywriting tool tailored for agency content teams. It generates brand-consistent social posts, email subject lines, and ad variations while learning from historical engagement metrics to improve click-through performance.',
    'marketing, AI, automation, social media', 'echocraft-studio', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    '',
    0,
    0
    ),

    ('6_trendsync', 'TrendSync Social Listening Engine', 'TrendSync Media', 'Team 6', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'TrendSync Media monitors emerging social conversations and industry hashtags to alert brand strategists to viral opportunities early. The platform uses sentiment analysis to filter noise and highlight actionable audience feedback.',
    'marketing, AI, automation, social media', 'trendsync-media', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    '',
    0,
    0
    ),

    ('7_adspark', 'AdSpark Dynamic Creative Optimizer', 'AdSpark Engine', 'Team 7', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'AdSpark Engine automatically tests and rotates visual and text combinations for digital display ads. By analyzing conversion signals in real time, the system allocates budget toward top-performing creative assets across target demographics.',
    'marketing, AI, automation, social media', 'adspark-engine', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    '',
    1,
    1
    ),

    ('8_brandbridge', 'BrandBridge Influencer Discovery Hub', 'BrandBridge Connect', 'Team 8', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'BrandBridge Connect matches mid-sized consumer brands with niche content creators based on audience authenticity and engagement quality. The platform includes contract templates, deliverable tracking, and automated campaign ROI summaries.',
    'marketing, AI, automation, social media', 'brandbridge-connect', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    '',
    0,
    0
    ),

    ('9_socialgrid', 'SocialGrid Multi-Channel Scheduler', 'SocialGrid Planner', 'Team 9', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'SocialGrid Planner provides a unified editorial calendar for scheduling and previewing posts across major social networks. It features approval workflows for agency clients and recommends optimal posting windows based on follower activity.',
    'marketing, AI, automation, social media', 'socialgrid-planner', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('10_leadmagnet', 'LeadMagnet Conversational Funnel Bot', 'LeadMagnet AI', 'Team 10', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'LeadMagnet AI deploys customizable chat assistants on landing pages and social messaging channels to qualify inbound prospects. Captured lead profiles sync directly with agency CRM pipelines for immediate sales follow-up.',
    'marketing, AI, automation, social media', 'leadmagnet-ai', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('11_buzzmetrics', 'BuzzMetrics Competitor Benchmarking Suite', 'BuzzMetrics Pro', 'Team 11', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'BuzzMetrics Pro tracks competitor posting frequency, share of voice, and campaign launches across public social channels. Marketing teams use its monthly digest reports to spot content gaps and refine positioning strategies.',
    'marketing, AI, automation, social media', 'buzzmetrics-pro', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('12_clickvault', 'ClickVault Attribution & UTM Manager', 'ClickVault Tracker', 'Team 12', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'ClickVault Tracker standardizes campaign link tagging across large marketing teams to prevent broken analytics attribution. It enforces naming conventions, generates short links, and maps first-touch and last-touch conversion paths.',
    'marketing, AI, automation, social media', 'clickvault-tracker', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('13_voxpersona', 'VoxPersona Audience Segmentation Tool', 'VoxPersona Insights', 'Team 13', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'VoxPersona Insights clusters customer survey responses and social engagement data into actionable buyer personas. Strategists use these dynamic profiles to tailor messaging angles and media buying budgets.',
    'marketing, AI, automation, social media', 'voxpersona-insights', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('14_reelboost', 'ReelBoost Short-Form Video Repurposer', 'ReelBoost Studio', 'Team 14', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'ReelBoost Studio automatically extracts high-engagement clips from long-form webinars and podcasts, formatting them into vertical short-form videos with animated captions ready for social publishing.',
    'marketing, AI, automation, social media', 'reelboost-studio', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('15_mailweaver', 'MailWeaver Behavioral Drip Automator', 'MailWeaver Campaigns', 'Team 15', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'MailWeaver Campaigns triggers personalized email sequences based on user website interactions and social ad clicks. It includes built-in send-time optimization and automated list hygiene workflows.',
    'marketing, AI, automation, social media', 'mailweaver-campaigns', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('16_hashtaglab', 'HashtagLab Reach Prediction Engine', 'HashtagLab Analytics', 'Team 16', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'HashtagLab Analytics evaluates tag saturation and historical reach velocity to recommend balanced keyword sets for organic social posts. Users can group tags by campaign pillar and track organic discovery lift over time.',
    'marketing, AI, automation, social media', 'hashtaglab-analytics', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('17_pitchdeck', 'PitchDeck Agency Proposal Generator', 'PitchDeck Builder', 'Team 17', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'PitchDeck Builder helps account managers assemble customized client campaign proposals using modular case studies, channel forecasts, and pricing tiers, cutting pitch preparation time in half.',
    'marketing, AI, automation, social media', 'pitchdeck-builder', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('18_sentisense', 'SentiSense Brand Reputation Monitor', 'SentiSense Alerts', 'Team 18', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'SentiSense Alerts provides real-time crisis detection by flagging sudden spikes in negative brand mentions across social feeds and review boards, routing urgent tickets directly to community managers.',
    'marketing, AI, automation, social media', 'sentisense-alerts', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('19_funnelmap', 'FunnelMap Customer Journey Visualizer', 'FunnelMap Studio', 'Team 19', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'FunnelMap Studio visualizes drop-off points across social ad clicks, landing pages, and checkout flows. Marketers can simulate conversion rate improvements and prioritize A/B testing opportunities.',
    'marketing, AI, automation, social media', 'funnelmap-studio', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('20_captioncraft', 'CaptionCraft Multilingual Post Localizer', 'CaptionCraft Global', 'Team 20', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'CaptionCraft Global adapts social media campaigns across multiple languages while preserving idioms, cultural nuances, and brand tone guidelines for international product launches.',
    'marketing, AI, automation, social media', 'captioncraft-global', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('21_bidpilot', 'BidPilot Automated Paid Social Optimizer', 'BidPilot Ads', 'Team 21', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'BidPilot Ads adjusts daily campaign bids and audience lookalike thresholds based on target cost-per-acquisition rules, preventing budget waste during off-peak conversion hours.',
    'marketing, AI, automation, social media', 'bidpilot-ads', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('22_assetvault', 'AssetVault Digital Campaign Library', 'AssetVault DAM', 'Team 22', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'AssetVault DAM organizes approved brand logos, ad banners, and video templates with automated AI tagging and usage-rights expiration reminders for distributed marketing teams.',
    'marketing, AI, automation, social media', 'assetvault-dam', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('23_storyarc', 'StoryArc Interactive Poll & Quiz Maker', 'StoryArc Engage', 'Team 23', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'StoryArc Engage enables brands to embed interactive polls, quizzes, and product finders into social stories and microsites to boost audience dwell time and collect zero-party preference data.',
    'marketing, AI, automation, social media', 'storyarc-engage', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('24_seospark', 'SEOSpark Content Brief Generator', 'SEOSpark Writer', 'Team 24', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'SEOSpark Writer analyzes top-ranking search results to build structured article outlines, semantic keyword checklists, and internal linking suggestions for organic content teams.',
    'marketing, AI, automation, social media', 'seospark-writer', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('25_launchradar', 'LaunchRadar Product Rollout Tracker', 'LaunchRadar Ops', 'Team 25', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'LaunchRadar Ops coordinates cross-functional go-to-market checklists across PR, social media, and paid acquisition teams, ensuring synchronized asset delivery on launch day.',
    'marketing, AI, automation, social media', 'launchradar-ops', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('26_communityhub', 'CommunityHub Ambassador Rewards Portal', 'CommunityHub Loyalty', 'Team 26', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'CommunityHub Loyalty gamifies customer advocacy by awarding points and referral perks when brand fans share verified product reviews and user-generated content on social platforms.',
    'marketing, AI, automation, social media', 'communityhub-loyalty', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('27_pixelresize', 'PixelResize Multi-Format Ad Exporter', 'PixelResize Studio', 'Team 27', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'PixelResize Studio automatically adapts a single master banner design into dozens of standard social and display aspect ratios while keeping focal subjects and call-to-action buttons centered.',
    'marketing, AI, automation, social media', 'pixelresize-studio', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('28_eventwave', 'EventWave Webinar Promotion Automator', 'EventWave Campaigns', 'Team 28', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'EventWave Campaigns generates speaker promo graphics, countdown reminders, and post-event follow-up sequences to maximize registration-to-attendance rates for virtual marketing events.',
    'marketing, AI, automation, social media', 'eventwave-campaigns', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('29_cohortpulse', 'CohortPulse Retention & Churn Predictor', 'CohortPulse AI', 'Team 29', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'CohortPulse AI identifies subscription customers showing declining engagement signals and automatically triggers win-back offers across email and retargeting ad audiences.',
    'marketing, AI, automation, social media', 'cohortpulse-ai', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('30_voicebot', 'VoiceBot Audio Ad Script & Spot Maker', 'VoiceBot Audio', 'Team 30', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'VoiceBot Audio produces dynamic podcast and streaming audio ad spots using natural AI voice synthesis, complete with background music ducking and localized callouts.',
    'marketing, AI, automation, social media', 'voicebot-audio', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('31_linkbio', 'LinkBio Smart Landing Page Builder', 'LinkBio Connect', 'Team 31', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'LinkBio Connect creates fast-loading mobile micro-landing pages for social media profiles, featuring shoppable product cards, newsletter signups, and click-through heatmaps.',
    'marketing, AI, automation, social media', 'linkbio-connect', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('32_adguard', 'AdGuard Brand Safety & Placement Filter', 'AdGuard Shield', 'Team 32', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'AdGuard Shield continuously audits programmatic ad placements and excludes low-quality domains or off-brand content categories to protect brand equity and improve impression quality.',
    'marketing, AI, automation, social media', 'adguard-shield', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('33_reviewflow', 'ReviewFlow Automated Customer Testimonial Hub', 'ReviewFlow Social', 'Team 33', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'ReviewFlow Social collects verified five-star customer reviews after purchase milestones and converts standout quotes into branded social proof graphics for product pages.',
    'marketing, AI, automation, social media', 'reviewflow-social', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('34_budgetcast', 'BudgetCast Media Mix Forecasting Tool', 'BudgetCast Planner', 'Team 34', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'BudgetCast Planner models diminishing returns across paid social, search, and video channels so marketing directors can allocate quarterly budgets for maximum projected pipeline.',
    'marketing, AI, automation, social media', 'budgetcast-planner', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('35_inboxpulse', 'InboxPulse Automated Comment & DM Triage', 'InboxPulse Desk', 'Team 35', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'InboxPulse Desk centralizes direct messages and post comments across social accounts, using intent classification to auto-answer FAQs and route sales inquiries to human agents.',
    'marketing, AI, automation, social media', 'inboxpulse-desk', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),
    ('36_hooklab', 'HookLab Viral Video Opening Analyzer', 'HookLab AI', 'Team 36', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'HookLab AI evaluates the first three seconds of short-form social videos against historical retention curves, suggesting visual cuts and opening captions that reduce early viewer drop-off.',
    'marketing, AI, automation, social media', 'hooklab-ai', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('37_podclip', 'PodClip Automated Podcast Snippet Studio', 'PodClip Media', 'Team 37', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'PodClip Media transcribes long-form audio episodes and automatically generates branded audiograms, quote cards, and show-note summaries optimized for LinkedIn and X distribution.',
    'marketing, AI, automation, social media', 'podclip-media', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('38_cartnudge', 'CartNudge Social Retargeting Trigger', 'CartNudge Ads', 'Team 38', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'CartNudge Ads syncs e-commerce checkout abandonment events directly to paid social audiences within minutes, serving dynamic product carousels with time-sensitive discount codes.',
    'marketing, AI, automation, social media', 'cartnudge-ads', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('39_brandpulse', 'BrandPulse Visual Logo & Mention Scanner', 'BrandPulse Vision', 'Team 39', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'BrandPulse Vision uses computer vision to detect untagged brand logos and product placements in user-uploaded photos and videos across public social feeds.',
    'marketing, AI, automation, social media', 'brandpulse-vision', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('40_sponsoriq', 'SponsorIQ Creator Pricing & ROI Estimator', 'SponsorIQ Desk', 'Team 40', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'SponsorIQ Desk benchmarks creator sponsorship rates using verified engagement rates, audience demographics, and historical conversion multiples to guide agency contract negotiations.',
    'marketing, AI, automation, social media', 'sponsoriq-desk', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('41_threadforge', 'ThreadForge Long-Form to Thread Converter', 'ThreadForge Studio', 'Team 41', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'ThreadForge Studio breaks down whitepapers and technical blog posts into structured, multi-post social threads complete with summary charts and scheduled follow-up replies.',
    'marketing, AI, automation, social media', 'threadforge-studio', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('42_localbuzz', 'LocalBuzz Multi-Location Social Manager', 'LocalBuzz Grid', 'Team 42', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'LocalBuzz Grid empowers franchise brands to publish localized store promotions, holiday hours, and regional offers across hundreds of neighborhood social pages from one dashboard.',
    'marketing, AI, automation, social media', 'localbuzz-grid', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('43_adfatigue', 'AdFatigue Creative Refresh Alert System', 'AdFatigue Watch', 'Team 43', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'AdFatigue Watch monitors frequency caps and declining click-through velocity on active paid campaigns, alerting designers before rising cost-per-click erodes return on ad spend.',
    'marketing, AI, automation, social media', 'adfatigue-watch', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('44_giftdrop', 'GiftDrop Automated Seeding Campaign Tracker', 'GiftDrop Ops', 'Team 44', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'GiftDrop Ops automates product seeding workflows by tracking influencer shipping addresses, delivery confirmations, and subsequent organic unboxing posts in a unified pipeline.',
    'marketing, AI, automation, social media', 'giftdrop-ops', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('45_pollpulse', 'PollPulse Real-Time Audience Sentiment Tracker', 'PollPulse Live', 'Team 45', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'PollPulse Live aggregates live audience reactions and Q&A submissions during product livestreams, surfacing top viewer questions for hosts to answer on air.',
    'marketing, AI, automation, social media', 'pollpulse-live', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('46_carouselkit', 'CarouselKit Educational Slide Deck Generator', 'CarouselKit Design', 'Team 46', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'CarouselKit Design transforms bulleted industry insights into cohesive multi-slide LinkedIn and Instagram carousels using locked brand typography, color palettes, and layout grids.',
    'marketing, AI, automation, social media', 'carouselkit-design', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('47_lookalikeai', 'LookalikeAI High-Value Seed Audience Builder', 'LookalikeAI Data', 'Team 47', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'LookalikeAI Data filters CRM customer lists by lifetime value and repeat purchase frequency to export privacy-compliant seed audiences for higher-converting ad targeting.',
    'marketing, AI, automation, social media', 'lookalikeai-data', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('48_briefsync', 'BriefSync Creative Agency Intake Portal', 'BriefSync Workflow', 'Team 48', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'BriefSync Workflow standardizes campaign kickoffs with guided intake forms that automatically generate task boards, asset specs, and deliverable timelines for creative teams.',
    'marketing, AI, automation, social media', 'briefsync-workflow', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('49_pressping', 'PressPing Journalist & Media Outreach Matcher', 'PressPing PR', 'Team 49', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'PressPing PR pairs brand announcements with beat reporters and newsletter editors based on recent coverage topics, drafting tailored pitch angles with verified contact details.',
    'marketing, AI, automation, social media', 'pressping-pr', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('50_spamshield', 'SpamShield Automated Bot & Troll Moderator', 'SpamShield Guard', 'Team 50', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'SpamShield Guard automatically hides crypto spam, phishing links, and coordinated bot replies on high-spend paid social ads to keep comment sections clean and trustworthy.',
    'marketing, AI, automation, social media', 'spamshield-guard', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('51_trenddeck', 'TrendDeck Weekly Client Executive Summary', 'TrendDeck Reports', 'Team 51', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'TrendDeck Reports compiles cross-platform social growth, top-performing posts, and plain-English strategic takeaways into branded weekly slide decks for agency stakeholders.',
    'marketing, AI, automation, social media', 'trenddeck-reports', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('52_ugcrights', 'UGCRights Creator Content Licensing Tracker', 'UGCRights Vault', 'Team 52', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'UGCRights Vault automates permission requests for customer-generated videos and manages paid whitelisting expiration dates so brands avoid copyright compliance issues.',
    'marketing, AI, automation, social media', 'ugcrights-vault', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('53_dropcountdown', 'DropCountdown SMS & Social Waitlist Engine', 'DropCountdown Launch', 'Team 53', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'DropCountdown Launch captures pre-launch hype from social teasers into segmented SMS and DM VIP lists, triggering staggered early-access links when limited inventory drops.',
    'marketing, AI, automation, social media', 'dropcountdown-launch', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('54_tonecheck', 'ToneCheck Brand Voice Compliance Linter', 'ToneCheck AI', 'Team 54', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'ToneCheck AI scans draft social captions, ad headlines, and email newsletters against custom brand style guides to flag off-brand phrasing and banned industry jargon.',
    'marketing, AI, automation, social media', 'tonecheck-ai', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('55_heatgrid', 'HeatGrid Thumbnail & Banner Eye-Tracking AI', 'HeatGrid Vision', 'Team 55', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'HeatGrid Vision predicts viewer focal points on social video thumbnails and display banners before launch, helping designers position headlines and product shots for maximum visibility.',
    'marketing, AI, automation, social media', 'heatgrid-vision', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    0
    ),

    ('56_affiliatelink', 'AffiliateLink Creator Commission & Code Hub', 'AffiliateLink Pro', 'Team 56', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'AffiliateLink Pro generates unique promo codes and trackable referral links for micro-influencers, automating monthly payout calculations based on net attributed orders.',
    'marketing, AI, automation, social media', 'affiliatelink-pro', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('57_evergreenq', 'EvergreenQ Top-Post Recycling Scheduler', 'EvergreenQ Social', 'Team 57', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', '', '',
    'EvergreenQ Social identifies high-performing educational posts from past quarters and automatically refreshes their hooks and visuals to fill gaps in ongoing publishing queues.',
    'marketing, AI, automation, social media', 'evergreenq-social', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('58_dmquiz', 'DMQuiz Social Story Lead Qualifier', 'DMQuiz Funnel', 'Team 58', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'DMQuiz Funnel launches automated direct-message product recommendation quizzes when followers comment a keyword on social posts, delivering personalized checkout links in chat.',
    'marketing, AI, automation, social media', 'dmquiz-funnel', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    ),

    ('59_audiencemap', 'AudienceMap Cross-Platform Overlap Analyzer', 'AudienceMap Insights', 'Team 59', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'AudienceMap Insights measures follower overlap across Instagram, TikTok, and YouTube to help media planners avoid paying multiple times to reach the exact same demographic segment.',
    'marketing, AI, automation, social media', 'audiencemap-insights', '', 1,
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-2 year')) || '-12-31'),
    0,
    0
    ),

    ('60_pulsebrief', 'PulseBrief Daily Social Trend Digest Bot', 'PulseBrief AI', 'Team 60', 'Pixel Blaze, Sonic Speed, Luna Sparkle, Zack Fair', 'SparkVibe Agency', 'John Doe', 'dummy/smartspark_thumb.png', '',
    'PulseBrief AI delivers a morning Slack briefing summarizing overnight viral formats, trending audio tracks, and competitor campaign launches tailored to each agency client vertical.',
    'marketing, AI, automation, social media', 'pulsebrief-ai', '', 1,
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-01-01'),
    DATE(strftime('%Y', DATE('now', '-1 year')) || '-12-31'),
    0,
    1
    )
;