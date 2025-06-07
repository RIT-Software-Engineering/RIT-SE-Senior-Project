INSERT INTO users (system_id, fname, lname, email, type, semester_group, project, active, view_only, profile_info) 
VALUES
    ('glados', 'SUPER', 'ADMIN', 'adminB@rit.edu', 'admin', NULL, NULL, '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('cave', 'View Only', 'Admin', 'viewonly@admin.edu', 'admin', NULL, NULL, '', 'TRUE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('wheatley', 'View Only', 'Student', 'viewonly@Student.edu', 'student', NULL, NULL, '', 'TRUE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('ViewOnlyCoach', 'ViewOnly', 'coach', 'viewonly@Coach.edu', 'coach', NULL, NULL, '', 'TRUE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),

    ('jod1234', 'John', 'Doe', 'john.doe@mail.edu', 'coach', NULL, NULL, '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('del1234', 'David', 'Lee', 'david.lee@mail.edu', 'coach', NULL, NULL, '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('lam4821', 'Laura', 'Martin', 'laura.martin@mail.edu', 'coach', NULL, NULL, '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('joh1234', 'John', 'Smith', 'john.smith@mail.edu', 'coach', NULL, NULL, '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('rth4567', 'Rachel', 'Thompson', 'rachel.thompson@mail.edu', 'coach', NULL, NULL, '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),

    ('miku99', 'Miku', 'Hatsune', 'miku.hatsune@mail.edu', 'student', 1, '2025-06-06_GrowEasy1234567890', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('cs1290', 'Cloud', 'Strife', 'cloud.strife@mail.edu', 'student', 1, '2025-06-06_GrowEasy1234567890', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('bt1293', 'Blaze', 'Thunder', 'blaze.thunder@mail.edu', 'student', 1, '2025-06-06_GrowEasy1234567890', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('til345', 'Tifa', 'Lockhart', 'tifa.lockhart@mail.edu', 'student', 1, '2025-06-06_GrowEasy1234567890', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('pb1233', 'Pixel', 'Blaze', 'pixel.blaze@mail.edu', 'student', 1, '2025-06-06_SmartSpark777888999', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('sos339', 'Sonic', 'Speed', 'sonic.speed@mail.edu', 'student', 1, '2025-06-06_SmartSpark777888999', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('ls2198', 'Luna', 'Sparkle', 'luna.sparkle@mail.edu', 'student', 1, '2025-06-06_SmartSpark777888999', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('zfa894', 'Zack', 'Fair', 'zack.fair@mail.edu', 'student', 1, '2025-06-06_SmartSpark777888999', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('mj3281', 'Mario', 'Jumpman', 'mario.jumpman@mail.edu', 'student', 2, '2025-06-06_TechTitan987654321', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('ng1312', 'Neon', 'Glow', 'neon.glow@mail.edu', 'student', 2, '2025-06-06_TechTitan987654321', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('ss7238', 'Solid', 'Snake', 'solid.snake@mail.edu', 'student', 2, '2025-06-06_TechTitan987654321', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('sf7493', 'Teto', 'Kasane', 'teto.kasane@mail.edu', 'student', 2, '2025-06-06_TechTitan987654321', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('lh7488', 'Link', 'Hero', 'link.hero@mail.edu', 'student', 2, '2025-06-06_BuzzBoost2425262728', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('gs9947', 'Glimmer', 'Star', 'glimmer.star@mail.edu', 'student', 2, '2025-06-06_BuzzBoost2425262728', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('zh7558', 'Zelda', 'Hyrule', 'zelda.hyrule@mail.edu', 'student', 2, '2025-06-06_BuzzBoost2425262728', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('cr8473', 'Comet', 'Rush', 'comet.rush@mail.edu', 'student', 2, '2025-06-06_BuzzBoost2425262728', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('kp2872', 'Kirby', 'Puff', 'kirby.puff@mail.edu', 'student', 2, '2025-06-06_VitaVibe3435363738', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('viv910', 'Vivid', 'Volt', 'vivid.volt@mail.edu', 'student', 2, '2025-06-06_VitaVibe3435363738', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('pt7786', 'Peach', 'Toadstool', 'peach.toadstool@mail.edu', 'student', 2, '2025-06-06_VitaVibe3435363738', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('bno009', 'Blitz', 'Nova', 'blitz.nova@mail.edu', 'student', 2, '2025-06-06_VitaVibe3435363738', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('saa384', 'Samus', 'Aran', 'samus.aran@mail.edu', 'student', 3, '2025-06-06_ProfitPulse101112131', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('sv3824', 'Spark', 'Vibe', 'spark.vibe@mail.edu', 'student', 3, '2025-06-06_ProfitPulse101112131', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('yd8537', 'Yoshi', 'Dino', 'yoshi.dino@mail.edu', 'student', 3, '2025-06-06_ProfitPulse101112131', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('rr2397', 'Radiant', 'Ray', 'radiant.ray@mail.edu', 'student', 3, '2025-06-06_ProfitPulse101112131', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('lac743', 'Lara', 'Croft', 'lara.croft@mail.edu', 'student', 3, '2025-06-06_NextWave1920212223', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('ns2127', 'Nix', 'Storm', 'nix.storm@mail.edu', 'student', 3, '2025-06-06_NextWave1920212223', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('dk8008', 'Donkey', 'Kong', 'donkey.kong@mail.edu', 'student', 3, '2025-06-06_NextWave1920212223', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('fb7283', 'Flash', 'Bolt', 'flash.bolt@mail.edu', 'student', 3, '2025-06-06_NextWave1920212223', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('ks6237', 'Kratos', 'Spartan', 'kratos.spartan@mail.edu', 'student', 3, '2025-06-06_FlexFlow3940414243', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('ag6726', 'Aurora', 'Glow', 'aurora.glow@mail.edu', 'student', 3, '2025-06-06_FlexFlow3940414243', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('bk6334', 'Bowser', 'King', 'bowser.king@mail.edu', 'student', 3, '2025-06-06_FlexFlow3940414243', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('zef827', 'Zest', 'Flicker', 'zest.flicker@mail.edu', 'student', 3, '2025-06-06_FlexFlow3940414243', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('aeg836', 'Aerith', 'Gainsborough', 'aerith.gainsborough@mail.edu', 'student', 4, '2025-06-06_CareCraze111222333', 'TRUE', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('vw9474', 'Vapor', 'Wave', 'vapor.wave@mail.edu', 'student', 4, '2025-06-06_CareCraze111222333', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('sb9047', 'Sephiroth', 'Blade', 'sephiroth.blade@mail.edu', 'student', 4, '2025-06-06_CareCraze111222333', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('nb9374', 'Nova', 'Bright', 'nova.bright@mail.edu', 'student', 4, '2025-06-06_CareCraze111222333', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('pks286', 'Pikachu', 'Spark', 'pikachu.spark@mail.edu', 'student', 4, '2025-06-06_DataForge444555666', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('bs6764', 'Glint', 'Surge', 'glint.surge@mail.edu', 'student', 4, '2025-06-06_DataForge444555666', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('mps823', 'Mewtwo', 'Psi', 'mewtwo.psi@mail.edu', 'student', 4, '2025-06-06_DataForge444555666', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('sc8924', 'Shine', 'Crest', 'shine.crest@mail.edu', 'student', 4, '2025-06-06_DataForge444555666', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('rf9472', 'Ryu', 'Fighter', 'ryu.fighter@mail.edu', 'student', 4, '2025-06-06_EcoEdge1415161718', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('ef9474', 'Ember', 'Flame', 'ember.flame@mail.edu', 'student', 4, '2025-06-06_EcoEdge1415161718', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('cl9346', 'Chun', 'Li', 'chun.li@mail.edu', 'student', 4, '2025-06-06_EcoEdge1415161718', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('sv9373', 'Sparkle', 'Vibe', 'sparkle.vibe@mail.edu', 'student', 4, '2025-06-06_EcoEdge1415161718', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    
    ('sor8362', 'Sora', 'Keyblade', 'sora.keyblade@mail.edu', 'student', 4, '2025-06-06_TrendTide2930313233', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('fc9723', 'Teto', 'Comet', 'Teto.comet@mail.edu', 'student', 4, '2025-06-06_TrendTide2930313233', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}'),
    ('rid732', 'Riku', 'Dawn', 'riku.dawn@mail.edu', 'student', 4, '2025-06-06_TrendTide2930313233', '', 'FALSE', '{"additional_info":"", "dark_mode":true, "gantt_view":true}'),
    ('bs9047', 'Blaze', 'Star', 'blaze.star@mail.edu', 'student', 4, '2025-06-06_TrendTide2930313233', '', 'FALSE', '{"additional_info":"", "dark_mode":false, "gantt_view":true}')
;