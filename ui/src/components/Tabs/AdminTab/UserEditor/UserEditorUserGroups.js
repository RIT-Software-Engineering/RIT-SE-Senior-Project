import React, { useEffect, useState } from "react";
import { Accordion, Loader } from "semantic-ui-react";
import { USERTYPES } from "../../../util/functions/constants";
import _ from "lodash";
import StudentTeamTable from "../../StudentsTab/StudentTeamTable";
import { isSemesterActive } from "../../../util/functions/utils";

export default function UserEditorUserGroups(props) {
  const unassignedStudentsStr = "Unassigned students";
  const coaches = "Coaches";
  const admins = "Admins";
  const inactive = "Inactive Users";

  const [activeIndexes, setActiveIndexes] = useState([]);
  const [groupings, setGroupings] = useState(null);

  const handleAccordionClick = (semesterId) => {
    setActiveIndexes((prev) =>
      prev.includes(semesterId)
        ? prev.filter((id) => id !== semesterId)
        : [...prev, semesterId],
    );
  };

  function groupUsers(studentData, userData, projectMap) {
    const result = {
      [unassignedStudentsStr]: [],
      [coaches]: [],
      [admins]: [],
      [inactive]: [],
      semesters: {},
    };

    userData.forEach((user) => {
      if (user.active === "") {
        if (user.type === USERTYPES.COACH) {
          result[coaches].push(user);
        } else if (user.type === USERTYPES.ADMIN) {
          result[admins].push(user);
        }
      } else {
        result[inactive].push(user);
      }
    });

    studentData.forEach((student) => {
      if (!student.semester_group) {
        result[unassignedStudentsStr].push(student);
        return;
      }

      const semesterId = student.semester_id;
      if (!result.semesters[semesterId]) {
        result.semesters[semesterId] = { projects: {}, unassigned: [] };
      }

      if (student.project) {
        if (!result.semesters[semesterId].projects[student.project]) {
          result.semesters[semesterId].projects[student.project] = {
            name:
              projectMap[student.project]?.display_name ||
              projectMap[student.project]?.title,
            project_id: projectMap[student.project]?.project_id,
            students: [],
          };
        }
        result.semesters[semesterId].projects[student.project].students.push(
          student,
        );
      } else {
        result.semesters[semesterId].unassigned.push(student);
      }
    });

    [unassignedStudentsStr, coaches, admins, inactive].forEach((key) => {
      result[key].sort((a, b) => a.lname.localeCompare(b.lname));
    });
    Object.values(result.semesters).forEach((semester) => {
      semester.unassigned.sort((a, b) => a.lname.localeCompare(b.lname));
      Object.values(semester.projects).forEach((project) =>
        project.students.sort((a, b) => a.lname.localeCompare(b.lname)),
      );
    });

    return result;
  }

  function createSemesterAccordion(semesterId, semesterGroup) {
    const panels = [];

    if (semesterGroup.unassigned?.length > 0) {
      panels.push(
        <StudentTeamTable
          key={`${semesterId}-unassigned`}
          childKey={`${semesterId}-unassigned`}
          title={`Unassigned Students (${semesterGroup.unassigned.length})`}
          projectsData={props.projectData}
          semesterData={props.semesterData}
          students={semesterGroup.unassigned}
          callback={props.callback}
        />,
      );
    }

    if (semesterGroup.projects) {
      const sortedProjects = _.sortBy(
        Object.values(semesterGroup.projects),
        "name",
      );
      sortedProjects.forEach((project) => {
        panels.push(
          <StudentTeamTable
            key={`project-${project.project_id}`}
            childKey={`project-${project.project_id}`}
            title={`${project.name} (${project.students.length})`}
            projectsData={props.projectData}
            semesterData={props.semesterData}
            students={project.students}
            callback={props.callback}
          />,
        );
      });
    }

    return panels;
  }

  useEffect(() => {
    if (
      props.studentData &&
      props.semesterData &&
      Object.keys(props.projectData).length
    ) {
      const projectMap = {};
      props.projectData.forEach((project) => {
        projectMap[project.project_id] = project;
      });
      const grouped = groupUsers(props.studentData, props.userData, projectMap);
      setGroupings(grouped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.studentData, props.userData, props.projectData]);

  if (!groupings) {
    return <Loader active inline="centered" />;
  }

  const semesterAccordions = props.semesterData.map((semester) => {
    const semesterId = semester.semester_id;
    const isActive = isSemesterActive(semester.start_date, semester.end_date);
    const semesterGroup = groupings.semesters[semesterId] || {
      projects: {},
      unassigned: [],
    };

    const totalCount =
      (semesterGroup.unassigned?.length || 0) +
      Object.values(semesterGroup.projects).reduce(
        (sum, project) => sum + (project.students?.length || 0),
        0,
      );

    return {
      endDate: semester.end_date,
      startDate: semester.start_date,
      accordion: (
        <Accordion
          key={semesterId}
          fluid
          styled
          panels={[
            {
              key: `StudentsTab-semester-selector-${semesterId}`,
              title: `${semester.name} (${totalCount})`,
              content: {
                content: activeIndexes.includes(semesterId)
                  ? createSemesterAccordion(semesterId, semesterGroup)
                  : null,
              },
            },
          ]}
          active={isActive || activeIndexes.includes(semesterId)}
          onTitleClick={() => handleAccordionClick(semesterId)}
        />
      ),
    };
  });

  const sortedAccordions = _.sortBy(semesterAccordions, [
    "endDate",
    "startDate",
  ]).reverse();

  return (
    <>
      {groupings[unassignedStudentsStr]?.length > 0 && (
        <StudentTeamTable
          title={`Unassigned Students (${groupings[unassignedStudentsStr].length})`}
          key="Unassigned Students Key"
          childKey="Unassigned Students Key"
          projectsData={props.projectData}
          semesterData={props.semesterData}
          students={groupings[unassignedStudentsStr]}
          callback={props.callback}
        />
      )}
      {groupings[admins]?.length > 0 && (
        <StudentTeamTable
          title={`Admins (${groupings[admins].length})`}
          key="Admins"
          childKey="Admins"
          projectsData={props.projectData}
          semesterData={props.semesterData}
          students={groupings[admins]}
          callback={props.callback}
        />
      )}
      {groupings[coaches]?.length > 0 && (
        <StudentTeamTable
          title={`Coaches (${groupings[coaches].length})`}
          key="Coaches"
          childKey="Coaches"
          projectsData={props.projectData}
          semesterData={props.semesterData}
          students={groupings[coaches]}
          callback={props.callback}
        />
      )}
      {sortedAccordions.map((semesterAccordion) => semesterAccordion.accordion)}
      {groupings[inactive]?.length > 0 && (
        <StudentTeamTable
          title={`Inactive Users (${groupings[inactive].length})`}
          key="Inactive Students"
          childKey="Inactive Students"
          projectsData={props.projectData}
          semesterData={props.semesterData}
          students={groupings[inactive]}
          callback={props.callback}
        />
      )}
    </>
  );
}
