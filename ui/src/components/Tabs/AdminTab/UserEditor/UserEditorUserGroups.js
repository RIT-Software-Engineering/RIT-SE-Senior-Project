import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config, USERTYPES } from "../../../util/functions/constants";
import _ from "lodash";
import StudentTeamTable from "../../StudentsTab/StudentTeamTable";
import { SecureFetch } from "../../../util/functions/secureFetch";
import { isSemesterActive } from "../../../util/functions/utils";

/**
 * FIXME: This whole component should be redesigned to only
 * get users when opening an accordion. Loading all of the users
 * at the beginning will slow down over time especially as we add
 * nearly 200 users per semester. Overall, the design of this component
 * could be less complex.
 */
export default function UserEditorUserGroups(props) {
  const unassignedStudentsStr = "Unassigned students";
  const coaches = "Coaches";
  const admins = "Admins";
  const inactive = "Inactive Users";

  let groupings;
  let semesterMap = {};
  let projectMap = {};
  let semesterAccordions = [];

  function groupUsers(studentData, userData, projectMap) {
    let semesterMap = { semesters: [] };

    userData.forEach((user) => {
      if (user.active === "") {
        switch (user.type) {
          case USERTYPES.COACH:
            if (!semesterMap[coaches]) {
              semesterMap[coaches] = [];
            }
            semesterMap[coaches].push(user);
            semesterMap[coaches].sort((a, b) => a.lname.localeCompare(b.lname));
            break;
          case USERTYPES.ADMIN:
            if (!semesterMap[admins]) {
              semesterMap[admins] = [];
            }
            semesterMap[admins].push(user);
            semesterMap[admins].sort((a, b) => a.lname.localeCompare(b.lname));
            break;

          default:
            break;
        }
      } else {
        if (!semesterMap[inactive]) {
          semesterMap[inactive] = [];
        }
        semesterMap[inactive].push(user);
      }
    });

    for (let i = 0; i < studentData.length; i++) {
      let student = studentData[i];
      if (student.semester_group) {
        if (!semesterMap["semesters"][student.semester_id]) {
          semesterMap["semesters"][student.semester_id] = { projects: {} };
        }

        if (student.project) {
          //If a students project doesn't exist inside the semestermap yet, it creates it
          if (
            !semesterMap["semesters"][student.semester_id]["projects"][
              student.project
            ]
          ) {
            semesterMap["semesters"][student.semester_id]["projects"][
              student.project
            ] = {
              name:
                projectMap[student.project].display_name ||
                projectMap[student.project].title,
              project_id: projectMap[student.project].project_id,
              students: [],
            };
          }
          semesterMap["semesters"][student.semester_id]["projects"][
            student.project
          ]["students"].push(student);
          //Sorting after insertion, not the most optimal, but should be okay.
          semesterMap["semesters"][student.semester_id]["projects"][
            student.project
          ]["students"].sort((a, b) => a.lname.localeCompare(b.lname));
        } else {
          // if a student hasn't been assigned a project yet
          if (
            !semesterMap["semesters"][student.semester_id][
              unassignedStudentsStr
            ]
          ) {
            semesterMap["semesters"][student.semester_id][
              unassignedStudentsStr
            ] = [];
          }
          semesterMap["semesters"][student.semester_id][
            unassignedStudentsStr
          ].push(student);
          semesterMap["semesters"][student.semester_id][
            unassignedStudentsStr
          ].sort((a, b) => a.lname.localeCompare(b.lname));
        }
      } else {
        //if a student doesn't have an assigned semester group yet
        if (!semesterMap[unassignedStudentsStr]) {
          semesterMap[unassignedStudentsStr] = [];
        }
        semesterMap[unassignedStudentsStr].push(student);
        semesterMap[unassignedStudentsStr].sort((a, b) =>
          a.lname.localeCompare(b.lname),
        );
      }
    }
    return semesterMap;
  }

  function createSemesterAccordion(grouping) {
    let panels = [];

    if (grouping[unassignedStudentsStr]) {
      panels.push(
        <StudentTeamTable
          key={unassignedStudentsStr}
          childKey={unassignedStudentsStr}
          title={`Unassigned Students (${grouping[unassignedStudentsStr].length})`}
          projectsData={props.projectData}
          semesterData={props.semesterData}
          students={grouping[unassignedStudentsStr]}
          callback={props.callback}
        />,
      );
    }

    if (grouping["projects"]) {
      let sortedProjects = _.sortBy(grouping["projects"], ["name"]);

      panels.push(
        sortedProjects.map((project) => {
          return (
            <StudentTeamTable
              key={`project-${project.project_id}`}
              childKey={`project-${project.project_id}`}
              title={`${project["name"]} (${project["students"].length})`}
              projectsData={props.projectData}
              semesterData={props.semesterData}
              students={project["students"]}
              callback={props.callback}
            />
          );
        }),
      );
    }
    return panels;
  }

  /*function callback(){
        //getUsers();
    
        props.semesterData.forEach(semester => {
            semesterMap[semester.semester_id] = semester;
        })
        props.projectData.forEach(project => {
            projectMap[project.project_id] = project;
        })
    
        groupings = groupUsers(props.studentData, props.userData, projectMap);
    
        semesterAccordions = Object.keys(groupings["semesters"]).map(semesterId => {
            return {
                endDate: semesterMap[semesterId]?.end_date,
                startDate: semesterMap[semesterId]?.start_date,
                accordion: <Accordion
                    key={semesterId}
                    fluid
                    styled
                    panels={[
                        {
                            key: "StudentsTab-semester-selector-" + semesterId,
                            title: `${semesterMap[semesterId]["name"]} (${Object.keys(groupings["semesters"][semesterId])?.length})`,
                            content: { content: createSemesterAccordion(groupings["semesters"][semesterId]) },
                        },
                    ]}
                />,
            }
        })
    
        semesterAccordions = _.sortBy(semesterAccordions, ["end_date", "start_date"]).reverse();
    }*/

  if (
    !props.studentData ||
    !props.semesterData ||
    !Object.keys(props.projectData).length
  ) {
    return <>loading...</>;
  }

  props.semesterData.forEach((semester) => {
    semesterMap[semester.semester_id] = semester;
  });
  props.projectData.forEach((project) => {
    projectMap[project.project_id] = project;
  });

  groupings = groupUsers(props.studentData, props.userData, projectMap);

  semesterAccordions = Object.keys(groupings["semesters"]).map((semesterId) => {
    let active = isSemesterActive(semesterMap[semesterId]["start_date"], semesterMap[semesterId]["end_date"]);

    return {
      endDate: semesterMap[semesterId]?.end_date,
      startDate: semesterMap[semesterId]?.start_date,
      accordion: (
        <Accordion
          key={semesterId}
          fluid
          styled

          panels={[
            {
              key: "StudentsTab-semester-selector-" + semesterId,
              title: `${semesterMap[semesterId]["name"]} (${Object.keys(groupings["semesters"][semesterId])?.length})`,
              active: active,
              content: {
                content: createSemesterAccordion(
                  groupings["semesters"][semesterId],
                ),
              },
            },
          ]}
        />
      ),
    };
  });

  semesterAccordions = _.sortBy(semesterAccordions, [
    "end_date",
    "start_date",
  ]).reverse();
  //console.log(semesterAccordions);

  return (
    <>
      <StudentTeamTable
        title="Unassigned Students"
        key="Unassigned Students Key"
        childKey="Unassigned Students Key"
        projectsData={props.projectData}
        semesterData={props.semesterData}
        students={groupings[unassignedStudentsStr]}
        callback={props.callback}
      />
      <StudentTeamTable
        title="Admins"
        key="Admins"
        childKey="Admins"
        projectsData={props.projectData}
        semesterData={props.semesterData}
        students={groupings[admins]}
        callback={props.callback}
      />
      <StudentTeamTable
        title="Coaches"
        key="Coaches"
        childKey="Coaches"
        projectsData={props.projectData}
        semesterData={props.semesterData}
        students={groupings[coaches]}
        callback={props.callback}
      />
      {semesterAccordions?.map((semesterAccordion) => {
        return semesterAccordion.accordion;
      })}
      <StudentTeamTable
        title="Inactive Students"
        key="Inactive Students"
        childKey="Inactive Students"
        projectsData={props.projectData}
        semesterData={props.semesterData}
        students={groupings[inactive]}
        callback={props.callback}
      />
    </>
  );
}
