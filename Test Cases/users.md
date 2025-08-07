# User Management

[TEST CASES](readme.md)

## Covers

- [Adding Users](#adding-users)
- [Mail-to-All](#mail-to-all)
- [Editing Users](#editing-users)
- [Reassigning Users](#reassigning-users)
- [Deactivation](#deactivation)
- [View Only Users](#view-only-users)

## Adding Users

### Single Add

1. Sign in as an [Admin](authentication.md#validating-admin-sign-in)

2. Navigate to the “Admin” tab, and within the “Users” accordion press the “+” button
   ![Add User Button](images/adduserbutton.png)

3. Fill out the required fields in the popup modal
   ![Add User Modal](images/addusermodal.png)

4. For the user types of “Student” and “Coach” add one new user and verify both exist under their relevant sections in the “Users” drop-down. _Note_ With different user types, the Semester fields should be different. For example, a Student should have a Semester field, while a Coach should not.

5. Before moving on, quickly ensure that creating users without all of the required fields results in an “Invalid Submission” pop-up when the “Submit” button is pressed.
   ![Invalid Submission](images/invalidsubmission.png)

6. Now verify that we can sign in by signing out of an admin and signing in as the new user. Note: Because we did not assign a user to a specific project they will not see anything on their “Dashboard” and “Logging” tab but the “Projects” and “Students” tab should be populated.

### Bulk add

1. To bulk add users into the system, sign in as an [Admin](authentication.md#validating-admin-sign-in), navigate to the admin tab, and press the upload button next to the plus sign on the Users dropdown.
   ![Bulk Add Button](images/bulkaddbutton.png)

2. This will open a pop-up modal where you can upload a CSV to bulk add users. For reference, there is also a template and an example CSV file to use. Add a CSV file, and the contents should automatically appear in the popup as seen in the image below
   ![Bulk Add Modal](images/bulkaddmodal.png)

3. Pressing upload will check the csv and only upload the correctly formatted users.

4. If a user is malformed a red highlight will appear on the row of the user and the following error message will appear.
   ![Malformed User](images/malformeduser.png)
   ![Malformed Highlight](images/malformedhighlight.png)

5. To rectify issues with bulk adding, ensure that there are no duplicate users, and ensure that the CSV conforms to the upload standards using the Download Template/Download Example buttons and or by navigating the creation template at `server/www/UserCreationTemplate.csv` or the example at `server/www/UserCreationExample.csv`

## Mail-to-All

1. Within the portal, there are several clickable mail icons available to all users, which allow them to email every user in the drop-down. This test case outlines the general proceedings for this functionality with examples for students, coaches and admins
   ![mail icon](images/mailicon.png)

2. First test the mail to all functionality from the admin perspective by signing in as an [admin](authentication.md#validating-admin-sign-in) and navigating to the “Students” tab.

3. Pick any available semester with a sizable amount of students and press the mail button seen on the right side of the semester view.
   ![Mail to All Students Dark](images/mailtoallstudentsdark.png)

4. Depending on your browser or your default settings, the applications that open may vary, however a new email window should open up with the receiving/to field filled with the same users from the semester.
   ![List of People 1](images/listofpeople1.png)

5. Test this with other mail buttons visible to administrators before signing into a coach account. The button exists in the Students tab, Coaches tab, and under the Users dropdown in the Admin tab.

6. Once tested extensively for Admins, follow the same procedure for Coaches. Note that the mail button should only appear in the Coaches and Students section.

7. Finally, test the functionality for Students. They should only have access to the mail all in the students section.

## Editing Users

1. Like other [actions](actions.md), and [projects](projects.md), users cannot be deleted from this portal however administrators still have full edit access on users. To edit a user, sign in as an [Admin](authentication.md#validating-admin-sign-in), navigate to the “Admin” tab, open the “Users” accordion and use the edit button to edit a specific user. In the accordion, coaches and administrators are separated into their own sub accordions while students are separated into their assigned (or unassigned) semesters and projects.
   ![Edit User Button](images/edituserbutton.png)
   ![Edit User Button 2](images/edituserbutton2.png)

2. Pressing the edit button will open the user editing modal which should be pre-populated with the corresponding user’s information.
   ![Edit User Modal](images/editusermodal.png)

3. Edit any editable fields (note a users ID should be displayed but not editable) and press “Submit” to apply changes.
   ![Edit User Modal 2](images/editusermodal2.png)

4. Once the success popup has appeared the updated student information should be visible in the Users accordion.  
   ![Edit User Success](images/editusersuccess.png)
   ![Edit User Success 2](images/editusersuccess2.png)

5. [Reassigning Users](#reassigning-users) to a role, [assigning students to a project](projects.md#member-assignment), [user deactivation](#deactivation), and [view only students](#view-only-students) will utilize this modal.

## Reassigning Users

1. As seen in [user creation](#adding-users), users can be assigned a type of student, coach, or admin when first added into the system. If a mistake was made and a user was wrongly assigned a role, admins can rectify the mistake by [editing](#editing-users) the user.

2. In this example we will be taking a wrongly assigned Coach and editing them to be correctly assigned. Following the procedure in [above](#editing-users), identify the user that will be reassigned.
   ![Reassigning Users 1](images/reassigningusers1.png)

3. In the edit user modal we should see the current assigned type of the user and if we change that field the modal should update accordingly.
   ![Reassigning Users 2](images/reassigningusers2.png)
   ![Reassigning Users 3](images/reassigningusers3.png)

4. Pressing submit will save our changes and the user should now appear in their corresponding section of the Users accordion.
   ![Reassigning Users Success](images/reassigninguserssuccess.png)

5. _Note_ in this scenario a student was changed to a coach however because of how [member assignment](projects.md#member-assignment) works in projects additional steps must be taken for the coach user to be a coach of their initial project.

## Deactivation

1. In the editing a user modal there is an “Active” checkbox at the bottom to indicate whether or not the user is active.
   ![User Deactivation 1](images/userdeactivation1.png)

2. Unchecking the active box should introduce an additional timestamp that indicates when the user was deactivated.
   ![User Deactivation 2](images/userdeactivation2.png)

3. Pressing submit will save the change and after the success popup appears the user should no longer be active.

4. A deactivated user’s contributions and ties will still appear throughout the portal and the user will also no longer appear in the [admin mocking](admin.md#mocking-users). The deactivated should still be able to sign in but instead of the portal they should be greeted by an access denied page.
   ![User Deactivation 3](images/userdeactivation3.png)

5. To reactivate a user simply recheck the active box.

## View Only Users

1. Users can be changed to have view only privileges at any point of time by admins of the portal. Like [user deactivation](#deactivation), setting a user to view only is done at the bottom of the [edit user](#editing-users) modal and will take effect after pressing Submit.
   ![View Only User 1](images/viewonlyuser1.png)

2. Unlike the user active checkbox view only doesn’t create a time stamp for when it's checked and users who are set to view only can still sign into the application and can be mocked by admins.

3. Further examples and information of what view only users can do can be found below.

### View Only Admins

### View Only Coaches

### View Only Students
