CREATE TABLE senior_projects (
    projectId   int autoincrement primary key unique not null,
    priority    int,
    title       text,
    teamName    text,
    members     text,
    sponsor     text,
    coach       text,
    poster      text,
    video       text,
    website     text,
    synopsis    text
);