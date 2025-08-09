# Projects

[TEST CASES](readme.md)

## Covers

- [Status](#status)
- [Sponsoring](#sponsoring)
- [Editing](#editing)
- [Featuring](#featuring)
- [Member Assignment](#member-assignment)

## Status

1. Projects can have various statuses in this portal and each status introduces both literal and metaphorical constraints
   ![Project Statuses 1](images/projectstatuses1.png)

   There is no automatic state change of projects (i.e. if all actions of a project are completed, the project will not automatically go from in progress to completed) they must be manually set to completed by administrators. To edit a project's status, sign in as an admin, navigate to the “Admin” tab, open the “Project Editor” accordion and press the edit button on a project.
   ![Project Statuses New 1](images/projectstatusesnew1.png)
   At the very bottom of the editing a project modal there should be a status dropdown field displaying the current project’s status
   ![Project Statuses New 2](images/projectstatusesnew2.png)
   Pressing submit will save the change and a success popup should appear. The project should now be in the new status and the status should be visible in the project’s quick overview panel.
   ![Project Statuses New 3](images/projectstatusesnew3.png)

2. After a project has been [submitted by a sponsor](#sponsoring), it will automatically appear in the projects section as a submitted project. Submitted projects are considered under-review projects and their information and details can be edited by administrators
   ![Project Statuses 2](images/projectstatuses2.png)
   If any user is assigned to a project during this stage they will not be able to see the project in their “Dashboard” tab but should be able to see information about it in the “Projects” tab

3. A “needs revision” project is functionally the same as “submitted” project however its name more likely indicates a longer period until a status change and will most likely undergo severe changes.
   ![Project Statuses 3](images/projectstatuses3.png)

4. A “future project” is again similar in functionality to the previous but it indicates that the project’s details are more solidified and that the project will most likely be a candidate for an upcoming semester. For [view only students](users.md#view-only-students) these future projects will appear in their projects tab.
   ![Project Statuses 4](images/projectstatuses4.png)

5. A “candidate” project should physically appear green and again details should still be visible and editable but the project is not operational so the project should yet to appear in the dashboard of assigned members.
   ![Project Statuses 5](images/projectstatuses5.png)

6. An “in progress” project is a live and on going project which finally displays on the “Dashboard” tab of its assigned members. Members can now [complete actions](actions.md#completing) within the project and [log time](logging.md#time-logs) within the project. “In progress” Projects should also appear yellow in project views.
   ![Project Statuses 6](images/projectstatuses6.png)

7. “Completed” projects represent finished projects and like the statuses before “in progress”, remove the project from the “Dashboard” of members since implies that all actions are completed (they do not have to be for the status to be changed to completed)
   ![Project Statuses 7](images/projectstatuses7.png)

8. A “archive” project is the final form of a project and indicates that the final rendition of a webpage and respective images/videos have been uploaded alongside the project. Like other statuses this is more of tracking state and doesn’t entirely restrict/lockdown the project which are handled independently with archive locking TODO LINK.
   ![Project Statuses 8](images/projectstatuses8.png)

## Sponsoring

1. Sponsoring projects is the main way for projects to be created in this system and is vital for the project lifecycle of this system. Projects can be sponsored by anyone with a well thought out idea and because of such the submission section is accessible on the main signed out homepage via the “Sponsor a Project” button in the top right.
   ![Sponsoring Projects 1](images/sponsoringprojects1.png)

2. Here you will be greeted by a preliminary Q&A section which answers and outlines the basic requirements and common problems. _Note_: because of local development the proposal instructions pdf might be unavailable but should be visible in both the live sandbox and live live server instances.
   ![Sponsoring Projects 2](images/sponsoringprojects2.png)

3. Pressing on the “Submit a Project Proposal" button will navigate to the project proposal form.
   ![Project Proposal Form 1](images/projectproposalform1.png)

4. If a required field or button is left empty/unchecked the form should prevent submission and navigate to said required field.
   ![Project Proposal Form 2](images/projectproposalform2.png)
   ![Project Proposal Form 3](images/projectproposalform3.png)
   ![Project Proposal Form 4](images/projectproposalform4.png)

5. The longer required fields like Project Background Information and Project Description will be placed into a pdf and here we can test pasting in complexly structured text like the ones seen in these test cases.
   ![Project Proposal Form 5](images/projectproposalform5.png)

6. After all of the required fields are filled pressing the submit button should display a success popup as seen below.
   ![Project Proposal Form 6](images/projectproposalform6.png)

7. Now if we sign into the portal as an [admin](authentication.md#validating-admin-sign-in) we should be able to see the project under the projects tab in the all projects section.
   ![Sponsoring Projects 3](images/sponsoringprojects3.png)

8. Pressing on the download button will open up a pdf of the proposal which should align with the inputs we had just recently created.
   ![Sponsoring Projects 4](images/sponsoringprojects4.png)
   ![Sponsoring Projects 5](images/sponsoringprojects5.png)

9. Once this is confirmed we can now [edit the project](#editing), [feature it](#featuring), and [assign members to it](#member-assignment).

## Editing

1. Projects can be modified by signed-in [admins](authentication#validating-admin-sign-in) under the “Admin" tab’s Project Editor dropdown.
   ![Editing Projects 1](images/editingprojects1.png)

2. Each project should have an edit button that brings up a project editing modal similar to below. Project attributes like display_name, title, coaches, organization, primary contact’s name/email/phone, and other descriptive text fields can be added and edited. Below is an exaple of adding a display name, changing the project title, and adding a coach.
   ![Editing Projects 2](images/editingprojects2.png)

3. Once edits are made and submitted, a successful pop-up should appear to verify that the project information has been updated.
   ![Editing Projects 3](images/editingprojects3.png)

4. Additionally, because we changed the several aspects we should immediately be able to see the newly updated project information in both the quick overview panel and the details view.
   ![Editing Projects 4](images/editingprojects4.png)
   ![Editing Projects 5](images/editingprojects5.png)

## Featuring

1. Featuring a project is a functionality in the portal that allows for public access to projects to highlight student achievements. To see examples of this in the portal navigate to the home page or the page that is first seen when the application starts up. Note: you will have to sign out to see this page if you were already signed in.
   ![Featured Projects 1](images/featuredprojects1.png)
   ![Featured Projects 2](images/featuredprojects2.png)

2. There is an additional page that displays all featured projects under the Projects tab as well if more examples are desired.
   ![Featured Projects 3](images/featuredprojects3.png)

3. To create these public facing feature websites we must sign in as either an active [student](authentication.md#validating-student-sign-in) who is in a project, a [coach](authentication.md#validating-coach-sign-in) who is coaching a project, and or as an [admin](authentication.md#validating-admin-sign-in) who can see all projects. First let us sign in as a student with a project and navigate to the projects tab.
   ![Featured Projects 4](images/featuredprojects4.png)

4. Here we can select our assigned project and press the “+” button to bring up the create website modal.
   ![Featured Projects 5](images/featuredprojects5.png)

5. As a student accessing this modal we can add Keywords, a Poster, an archive image, a descriptive Synopsis and a video. The Team Name is only editable by admins in an attempt to prevent misuse and active and locked switches are only toggleable for coaches and admins. For now as the student we can simply fill out the required fields of synopsis and project keywords
   ![Featured Projects 6](images/featuredprojects6.png)

6. Pressing Submit will create the featured website and we can quickly view it within the same Projects tab by pressing the bullhorn right next to the eye button. Additionally with the new website the “+” button should change to an edit button.
   ![Featured Projects 7](images/featuredprojects7.png)
   ![Featured Projects 8](images/featuredprojects8.png)

7. For coaches the process is very similar however as mentioned earlier, they also have access to the inactive and locked toggle check buttons
   ![Featured Projects 9](images/featuredprojects9.png)

8. [Signed in as a coach](authentication.md#validating-coach-sign-in) you may have noticed the extended projects page with the all projects view. In this view we should only be allowed to edit the projects that the coach is in
   ![Featured Projects 10](images/featuredprojects10.png)

9. When [signing in as an admin](authentication.md#validating-admin-sign-in) all projects should have the add/edit button and we should have access to all of the fields in the create website form.  
   ![Featured Projects 11](images/featuredprojects11.png)
   ![Featured Projects 12](images/featuredprojects12.png)

10. To view any of the newly created or existing websites we can press the bullhorn button on the respective project.
    ![Featured Projects 13](images/featuredprojects13.png)
    ![Featured Projects 14](images/featuredprojects14.png)

11. If a website is yet to exist an informational window should be displayed outlining steps and procedures one can take to make or request for a project website.
    ![Featured Projects 15](images/featuredprojects15.png)

12. Below is an example of a website feature with videos and images attached.
    ![Featured Projects 16](images/featuredprojects16.png)

13. This view should align with the public facing one which is visible to everyone from the homepage after pressing on the “Projects” page in the top right.
    ![Featured Projects 17](images/featuredprojects17.png)
    ![Featured Projects 18](images/featuredprojects18.png)
    ![Featured Projects 19](images/featuredprojects19.png)

14. Admins have additional functionality in the [archive editor](admin.md#archive-editor).

## Member Assignment

1. Members of projects, like students and coaches, are assigned by [administrators](authentication.md#validating-admin-sign-in) of the portal. To assign a student to a specific project, utilize the [user editor](users.md#editing-users) in the “Admin” tab, and press the edit button on a specific student in the unassigned students section.
   ![Member Assignment 1](images/memberassignment1.png)

2. In the user editing modal we can select a semester and project in the “Semester/Project” dropdown.
   ![Member Assignment 2](images/memberassignment2.png)

3. Pressing submit will add that student to the desired project and changes should immediately be apparent in the “Admin” tab ui. Note if there was only one student in the unassigned students section and they were assigned the section should disappear.
   ![Member Assignment 3](images/memberassignment3.png)

4. If we sign in as that student their dashboard and portal should correctly show their now assigned project.
   ![Member Assignment 4](images/memberassignment4.png)

5. The same process is followed for reassigning students from one project to another with the only notable difference being that assigned students are located in users->their semester->their project.

6. Coaches can be assigned to many projects at once and because of this their project assignment is located in the project editor modal itself
   ![Member Assignment 5](images/memberassignment5.png)

7. Projects are not limited to just one coach as well and in the project editor modal we can assign as many (or as little) coaches as we desire.
   ![Member Assignment 6](images/memberassignment6.png)

8. Pressing submit will save the changes made and we can verify the changes by [mocking in](admin.md#mocking-users) as any of the newly assigned coaches and viewing their assigned projects in the “Projects” tab.
   ![Member Assignment 7](images/memberassignment7.png)

9. To assign a coach from a project simply press the “x” button next to a coaches name in the project edit modal.
   ![Member Assignment 8](images/memberassignment8.png)

10. Again, submit the changes made and verify that the coach can no longer see the project in their dashboard by either signing in or mocking in as the unassigned coach.
