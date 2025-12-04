# Actions

[TEST CASES](readme.md)

## Covers

- [Types & Colors](#types--colors)
- [Completing](#completing)
- [Individual Actions](#individual-actions)
- [Team Actions](#team-actions)
- [Coach Actions](#coach-actions)
- [Admin Actions](#admin-actions)
- [Late Submissions](#late-submissions)
- [Creating](#creating)
- [Editing](#editing)
- [Deactivating](#deactivating)

## Types & Colors

Actions represent deliverables within each project, which can be assigned and completed by coaches and students. The screenshot below is from the perspective of a coach sign-in, but the student sign-in will look very similar.
![Actions Look](images/actionslook.png)

1. In the Milestones, Gantt, and Calendar sections of the dashboard tab, actions can take on a variety of colors to represent their current state of completeness, which are primarily based on submissions and their times. Green is completed, yellow is in progress, red is overdue, purple is holidays/break periods, and gray is future actions (start dates have yet to happen).

2. Sign in as a student in a live semester to view some action color differences and take note of some action names for editing later.
   ![Action Colors](images/actioncolors.png)

3. For green actions with a strikethrough, actions have to be fully completed to be displayed as such. Complete an action and verify that this state changes correctly.
   ![Completed Team Action](images/completedteamaction.png)

4. Actions that are greyed out are actions that have not been completed and are actions whose start date exists in the future. If no action matches this description, [edit an action](#editing) to start and end at a later date, and it should change to gray accordingly for those who can view it. Alongside this, these grayed out actions cannot be submitted, and in place of a submission button is a submission blocking text and the date when one can submit.
   ![Future Action](images/futureaction.png)

5. Actions with a red background are actions that have not been completed and have due dates that have already been past. If no actions appear to be red, edit an action to start and end at dates in the past, and it should change to red accordingly for those who can view it.
   ![Overdue Action](images/overdueaction.png)

6. Break periods are purple and are only visible on the calendar view if one doesn’t exist, edit an action to a [break period](announcements.md#breaks).
   ![Break Period Action](images/breakperiodaction.png)

## Completing

### Individual Actions

For this example, we will again be using the mocked data from [resetting the database](authentication.md#resetting-data).

1. [Signed in as a student](authentication.md#validating-student-sign-in), proceed to an individual action submission modal using the “View Action” button. Remember, “Individual” actions are limited to Students, “Coach” actions are limited to Coaches, and “Team” actions can be submitted by any member of the group. For demonstration purposes, we will be using the mock data project “TrendTide Analytics” and its respective Students and coaches. Below is an example action we will initially complete as “Aerith Gainsborough".
   ![Individual Action 1](images/individualaction1.png)

2. We can see a that no previous submission exists on the action as seen on the preview card, so let us add another to verify functionality. Again, we have selected a simple action to complete for general demonstration purposes. Add a corresponding file to the field and press “Submit.”
   ![Individual Action 2](images/individualaction2.png)

3. Now, verify that the access visibility is correct for the completed actions when signed in as “Aerith Gainsborough". The following is what the expanded submission links should look like
   ![Individual Action 3](images/individualaction3.png)
   If we were to sign in as another student within the same project, they would not be able to see the submission, as it is only visible to the user who submitted it and their coaches.
   ![Individual Action 4](images/individualaction4.png)

4. Once Student visibility is confirmed, [sign in as a coach](authentication.md#validating-coach-sign-in) (for this specific scenario we will use "Laura Martin") and verify that the Coach for the projects can see all student submissions.
   ![Individual Action 5](images/individualaction5.png)

The “Logging” tab also displays the completed actions and follows the same visibility procedures as the dashboard tab. In addition to this, “Individual” actions must be completed by all members of the team in order to be considered done. Once completed, they will no longer be visible in the “Relevant Actions” group, and in the “Milestones” section, the action should now have a green border and display all of the submissions as seen below.
![Individual Action 6](images/individualaction6.png)

### Team Actions

Functionality is the same process for submission as an “Individual” action, with the primary difference of only requiring one submission to be completed and that every member of the team can see the submission. The following steps will demonstrate this functionality.

1. Verify this by completing a “Team” action with filled-out fields and uploaded resources where necessary.

2. The action should turn green as completed, and the submission should be removed from “Relevant Actions”.
   ![Team Action 1](images/teamaction1.png)
   Additionally, the submission details should be visible to all of the other team members unlike individual actions. Confirm this by clicking on the submission when signed in from a different account.
   ![Team Action 2](images/teamaction2.png)
   _Nova Bright_ Viewing the submission of _Aerith Gainsborough_ as a team member.

### Coach Actions

1. Coach actions behave very similarly to the student action types of [individual](#individual-actions) and [team](#team-actions) however as the name suggests they are only completable by coaches. Firstly, verify the visibility check by signing in as a [student](authentication.md#validating-student-sign-in) and finding a project with a coach action. In the relevant actions section space they the submission type for an action should be “Coach”
   ![Coach Action 1](images/coachaction1.png)

2. Once the view action button has been clicked, the action’s details and submission page should appear with the caveat being that the submission button is replaced with informational text that blocks student submissions of coach actions.
   ![Coach Action 2](images/coachaction2.png)

3. If we sign in as a [coach](authentication.md#validating-coach-sign-in), we can see that the submission is available. Fill out the respective action’s fields and press the submit button.
   ![Coach Action 3](images/coachaction3.png)

4. Once submitted the action should appear complete in the milestone, calendar, and Gantt views.
   ![Coach Action 4](images/coachaction4.png)
   ![Coach Action 5](images/coachaction5.png)

5. Additionally, if we sign back into the same project as a student, the completed action should still be visible but again when looking at the details, only the submission time/[lateness](#late-submissions) and the action’s semester/project should be visible to students.

### Admin Actions

1. In addition to Coach and Student specific actions there are admin actions. As the name suggests these actions are only submittable by Admins however the submission itself can be viewed by Coaches. Signed in as an [admin](authentication.md#validating-admin-sign-in), in the same place where all other actions are [created](#creating), select “Admin” as an action target.
   ![Admin Action 1](images/adminaction1.png)

2. Fill out the other fields accordingly and press submit when completed.

3. Continue signed in as an admin and navigate to the “Dashboard” tab. Here the newly created admin action should be visible in all projects within the specified semester.  
   ![ Admin Action 2](images/adminaction2.png)

4. Pressing view action will open the actions submission details and there we can submit items as an admin. The action should turn green after our submission in the milestone view.
   ![Admin Action 3](images/adminaction3.png)

5. If we sign in as the [coach](authentication.md#validating-coach-sign-in) of the project where that admin action was submitted we should continue to see the completed action alongside the submission date and time.
   ![Admin Action 4](images/adminaction4.png)

6. Pressing the submission should direct to a submission modal where the admin submitted file is still accessible.
   ![Admin Action 5](images/adminaction5.png)

7. If we sign in as a [student](authentication.md#validating-student-sign-in) of the same project and view the admin action submission link the submission details should be invisible.
   ![Admin Action 6](images/adminaction6.png)

### Unsaved Changes Confirmation

1. You may have saw in [individual](#individual-actions) or [team](#team-actions) actions, when you click off the modal or press x or close buttons while partily filling out the modal a modal appears.
   This modal appears due to not finishing the action and it's intended purpose is so that users don't lose what they wrote when accedienly leaving. To test this go to any action submission modal (pic)

2. Then enter any text but do not complete it, take for example this modal (pic of modal) fill out the first box but leave the rest.

3. You will now click off the modal, you should see the confirmation modal right now in dark mode. the cancel button returns the user to the modal and preserves all saved data.(pic)

4. Now on the same modal you returned to click the x at the top right of the modal, it should lead to the same confirmation modal. Now click the button named "discard", this willn close the action modal and reset all changes you made. (pic)

### Late Submissions

1. As you may have noticed in [individual](#individual-actions) or [team](#team-actions) actions, action submission times are tracked and displayed accordingly on the dashboard tab. Actions generally have a due date, and if a submission is past that due date, the displayed submission time should display the corresponding information. To test this, sign in as a [student](authentication.md#validating-student-sign-in) with at least one overdue action in the dashboard. Overdue actions should appear in red in the milestone view and the relevant actions view.
   ![Late Submission 1](images/latesubmission1.png)

2. Once an overdue action has been identified press the “View Action” button and proceed with the standard action submission process by filling out the fields and submitting the action.

3. After submitting the action, there should be a new submission visible on the action. Pressing on the submission link should bring up the submission’s details, and in those details, we should see a correct lateness calculation.
   ![Late Submission 2](images/latesubmission2.png)
   Keep in mind that the lateness is visible to all but the base visibility of the action remains the same, so if the action is an “Individual” action, only the student who submitted it and their coaches can see it. If it is a “Team” action, all team members can see it.

4. The logging tab of any signed-in user within the same project (or an admin) should also display the late submitted action alongside its lateness within the detailed view. The following images are from a coach signed in perspective.
   ![Late Submission 3](images/latesubmission3.png)
   ![Late Submission 4](images/latesubmission4.png)

## Creating

1. Actions can only be created by admins in this system. Sign in as an [admin](authentication.md#validating-admin-sign-in), navigate to the “Admin” tab and press the “+” button on the “Action and Announcement Editor” dropdown.
   ![Create Action Button](images/createactionbutton.png)

2. Doing so will bring up the action creation modal, which contains the functionality for creating the following “Action Targets”: Individual, Team, Coach, Admin, Student Announcement, Coach Announcement, Peer evaluation, and Break Period. By default, with no “Action Target” selected, all of the action fields are visible and ready to be added, however each “Action Target” has its own specific set of required fields and the modal should change accordingly with each specific “Action Target”. Verify this by briefly clicking through action targets.
   ![Create Action Modal](images/createactionmodal.png)

3. For this test case we will be creating a simple individual action for students to complete. Select “Individual” in the “Action Target” dropdown and fill out the fields from “Action Title” to “Due Date/Announcement End Date with unique/easily checkable information.
   ![Create Action Modal 2](images/createactionmodal2.png)

4. In the Html section include a simple html that can capture user input like below.
   ![Create Action Modal 3](images/createactionmodal3.png)

5. For now we can leave the file submission fields blank and proceed with submitting and creating the action.

6. Once the action has been created we should be able to see it in the same “Acton and Announcement Editor” dropdown at the very bottom of the list since its the newest created.
   ![Create Action Modal 4](images/createactionmodal4.png)

7. Additionally, the freshly created action should be visible in the dashboard to the admin and all of the semester-related students and coaches
   ![Create Action 1](images/createaction1.png)
   ![Create Action 2](images/createaction2.png)

8. Like all other individual actions, this action can only be completed by students, student submissions are not visible to other students, and the action is only completed once every student has completed it.

## Editing

1. In this application actions cannot be hard deleted in this system but we can still [deactivate](#deactivating) and more importantly edit actions to reuse and repurpose data. Actions can only be edited by [admins](authentication.md#validating-admin-sign-in) and like creation, editing of actions is in the “Admin” tab under the “Action and Announcement Editor” dropdown with edit buttons next to each action.
   ![Editing Actions 1](images/editingactions1.png)

2. Clicking on the edit button will bring up an action editor modal and it should display the correct action and its details.  
   ![Editing Actions 2](images/editingactions2.png)

3. Modify any of the fields with new information and press the submit button when done to finish editing the action.

4. A confirmation popup should appear afterwards and the information modified should be correctly displayed in the “Action and Announcement Editor” dropdown and every other instance of the action in the application.

## Deactivating

1. In this application actions cannot be hard deleted in this system but we can still deactivate actions to remove them from project requirements for completion and make them unavailable to all users except admins. Actions can only be deactivated by [admins](authentication.md#validating-admin-sign-in) and deactivating an action exists within the action editing modal itself at the very bottom.
   ![Deactivating Actions 1](images/deactivatingactions1.png)

2. Unchecking the active button deactivates the action and creates a time log of when the action was deactivated, visible in the editing modal. Submit the action to save the deactivation state.
   ![Deactivating Actions 2](images/deactivatingactions2.png)

3. Reopening the edit modal should display the time at which the action was deactivated
   ![Deactivating Actions 3](images/deactivatingactions3.png)

4. Because the action is no longer active it should not appear in any project within that action’s semester. Verify this by navigating to the dashboard tab and confirming that the action cannot be found and or by signing in as a [student](authentication.md#validating-student-sign-in) or [coach](authentication.md#validating-coach-sign-in) and searching for the now non existent action.
