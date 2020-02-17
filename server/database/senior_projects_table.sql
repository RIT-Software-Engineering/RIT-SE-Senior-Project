CREATE TABLE senior_projects (
    id          int primary key unique not null,
    priority    int not null,
    title       text not null,
    teamName    text not null,
    members     text not null,
    sponsor     text not null,
    coach       text not null,
    poster      text not null,
    video       text,
    website     text not null,
    synopsis    text not null
);