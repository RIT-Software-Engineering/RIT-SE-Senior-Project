INSERT INTO projects (status, title, organization, primary_contact, contact_email, contact_phone,
    attachments, background_info, project_description, project_scope, project_challenges, constraints_assumptions,
    sponsor_provided_resources, project_search_keywords, sponsor_deliverables, proprietary_info, sponsor_avail_checked,
    sponsor_alternate_time, project_agreements_checked, assignment_of_rights, team_name,
    sponsor, poster, video, website, synopsis)
    VALUES

    (
    "submitted", "Once upon a project", "Storytime", "Narratorman", "narratorman@storytime.com", "333 333 3333", NULL, 
    "Some background info", "A projct description", "A narrow scope", "Some challenges", "some constraints", NULL,
    "key, word, stuff", "a list of deliverables", "proprietary info here", "on", NULL, "on", "full-rights", NULL,
    NULL, NULL, NULL, NULL, NULL
    ),

    ("needs revision", "I need revision", "REvision inc", "Revisor", "revisor@ revision.com", "454 454 4545", NULL, 
    "Some background info", "A projct description", "A narrow scope", "Some challenges", "some constraints", NULL,
    "key, word, stuff", "a list of deliverables", "proprietary info here", "on", "Alternate time stuff", "on", "full-rights", NULL,
    NULL, NULL, NULL, NULL, NULL
    ),
    
    (
    "in progress", "In Progress Project", "Progress LLC", "Progressor", "progressor@progress.com", "555 555 5454", NULL, 
    "Some background info", "A projct description", "A narrow scope", "Some challenges", "some constraints", NULL,
    "key, word, stuff", "a list of deliverables", "proprietary info here", "on", NULL, "on", "full-rights", NULL,
    1, NULL, NULL, NULL, NULL
    ),

    (
    "completed", "Completed project", "Completion Solutions", "Completer person", "completer@completion.com", "565 565 5656", NULL,
    "Some background info", "A projct description", "A narrow scope", "Some challenges", "some constraints", NULL,
    "key, word, stuff", "a list of deliverables", "proprietary info here", "on", NULL, "on", "full-rights", NULL,
    2, NULL, NULL, NULL, NULL
    )
    ;