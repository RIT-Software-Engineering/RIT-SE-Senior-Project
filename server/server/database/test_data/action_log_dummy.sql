INSERT INTO action_log(
    action_template,
    system_id,
    project,
    form_data,
    files
)
VALUES 
    (3, 'def123', 3, '{""team_name"": ""The Null Pointers""}', null),
    (4, 'nop123', 4, '{""name"": ""Tom""}', null),
    (6, 'nop123', 4, '{""team_name"": ""Drop Table Admin""}', null),
    (1, 'def123', 3, '{""name"": ""Dude""}', null),
    (1, 'abc123', 3, '{""name"": ""John""}', null),
    (1, 'hij123', 3, '{""name"": ""Jack""}', null),
    (1, 'klm123', 3, '{""name"": ""Gal""}', null)
;
