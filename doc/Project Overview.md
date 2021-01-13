# Senior Project Website Redux
## Independent Study Design Document
### Tom Amaral (<txa2269@rit.edu>)
### Spring 2020


## Contents
* [Overview](#overview)
* [Objective](#objective)
  * [Sponsor Focused Database](#sponsor-focused-database)
  * [Communication Tool](#communication-tool)
  * [Student Focused Area](#student-focused-area)
  * [Coach Focused Area](#coach-focused-area)
* [Toolchain](#toolchain)
* [Database Schema](#database-schema)

### [Overview](#overview)
The senior project website redesign involves creating a completely
standalone location for all resources relevant to the SE senior 
project assignment. This includes creating credentialed areas 
for students and coaches, and sponsor focused areas to elicit project
sponsors.

### [Objective](#objective)
To create a website with:

- A Sponsor focused database with:
    - All past senior projects
    - A prioritization matrix
    - An administration interface
    - Public facing UI (website)
- A communication tool
- Additional student focused area
- Additional coach focused area

#### [Sponsor Focused Database](#sponsor-focused-database)
The sponsor focused database functionality shall involve the storage of project metadata in a SQL style database, an admin interface to interact with this database, and a public facing UI to display the project data. Project metadata shall include the title, date, an image of the poster created, and a link to the student created video.

#### [Communication Tool](#communication-tool)
The communication tool objective involves researching and selecting a Customer Relationship Management tool and integrating it with the website. This is to aid in the communication to students and coaches and to manage the solicitation of sponsors for senior project.

#### [Student Focused Area](#student-focused-area)
The student area shall hold all the information for senior project relevant to the students currently enrolled. The student area shall be accessible via a login utilizing the SE department login.

#### [Coach Focused Area](#coach-focused-area)
The coaching area shall hold information and resources available to senior project coaches currently coaching senior project. This area shall be accessible via a login utilizing the SE department login.

### [Toolchain](#toolchain)
The website shall utilize a virtual linux server provided by the SE department. Back-end functionality will be supported through the use of Node.js. Database functionality shall be provided through the use of SQLite. Front-end UI shall utilize the Semantic-UI framework along with plain HTML, CSS, and Javascript. Images will be stored on the filesystem and will be managed in Node.js, with file references residing in the database.

### [Database Schema](#database-schema)

TABLE senior_projects (
* **id:** unique integer not null primary key,
* **priority:** integer not null,
* **title:** text not null,
* **members:** text not null,
* **sponsor:** text not null,
* **coach:** text not null,
* **synopsis:** text not null,
* **poster:** text not null,
* **website:** text not null

);
