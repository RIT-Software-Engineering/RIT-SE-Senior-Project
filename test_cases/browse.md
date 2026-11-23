# Browse

[TEST CASES](readme.md)

## Covers

- [Browse All Projects](#browse-all-projects)
- [Filtering](#filtering)

## Browse All Projects

1. This page can be used to view all projects regardless of status. Under the projects are arrows and the page number out of all pages. The user should be able to use the arrows to navigate to other pages, and the current page number should update accordingly.

2. On the first page, the left arrow should be disabled and greyed out, and on the last page, the right arrow should be disabled and greyed out.

3. The projects should be paginated so that every page up to the last one should have exactly nine projects and the last page should have nine projects at most.

4. When the screen width is larger than 1175px, the project cards should display in rows of three.

5. When the screen width is smaller than 1175px and larger than 700px, the project cards should display in rows of two.

6. When the screen width is smaller than 1000px, the search bar and dropdown filters should stack on top of each other.

7. When the screen width is smaller than 700px, the project cards should be stacked in a single column.

8. The current page number and total page number should remain the same regardless of screen width.

9. Some projects will have an award associated with it. If a project has one award, then there should be an award ribbon under the project title in the award's configured color. If it has two awards, a ribbon for each award should display on top of each other. If the user navigates to the "Admin" tab, opens the "Archive" accordion, and updates the award tags on a project, then the ribbons should update on the carousel.

## Filtering

1. When the user clicks on the Terms dropdown, all available project semesters should appear as options, which are all checked by default. Checking or unchecking should update the results so that all displayed projects were active during at least one of the checked terms.

2. When the user clicks on the Status dropdown and clicks Current, only projects that are ongoing should appear (which will be indicated in the project dates).

3. After clicking Current, clicking All should return to displaying all projects.

4. When the user clicks on the Award dropdown, all available awards as well as an All option should appear. Clicking an award should update the results so that only projects that are marked with that award appear.

5. After clicking an award, clicking All should return to displaying all projects regardless of award status.

6. Typing in a word into the search bar should update the results so that only projects that have the input in the title or description appear.
