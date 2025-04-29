import React, { useEffect, useState , useContext} from "react";
import { 
  Accordion,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Icon
} from "semantic-ui-react";import { config, USERTYPES } from "../../util/functions/constants";
import { SecureFetch } from "../../util/functions/secureFetch";
import SemesterCoaches from "./SemesterCoaches";
import _ from "lodash";
import { isSemesterActive } from "../../util/functions/utils";
import CoachActions from "./CoachActions"
import { UserContext } from "../../util/functions/UserContext";
import CoachProjects from "./CoachProjects";

export default function CoachesTab() {
  const [semesters, setSemestersData] = useState([]);
  const [active, setActive] = useState({});
  const [coachInfo, setCoachInfoData] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    SecureFetch(config.url.API_GET_SEMESTERS)
      .then((response) => response.json())
      .then((semestersData) => {
        const sortedSemesterData = _.sortBy(semestersData, [
          "end_date",
          "start_date",
          "name",
        ]).reverse();
        setSemestersData(sortedSemesterData);
        let initialActive = {};
        sortedSemesterData.forEach((semester) => {
          initialActive[semester.semester_id] = isSemesterActive(
            semester.start_date,
            semester.end_date,
          );
        });
        setActive(initialActive);
      })
      .catch((error) => {
        alert("Failed to get semestersData data" + error);
      });
  }, []);

  useEffect(() => {
    SecureFetch(config.url.API_GET_ALL_COACH_INFO)
      .then((response) => response.json())
      .then((coachInfo) => {
        coachInfo.map((coach) => {
          coach.projects = JSON.parse(coach.projects);
          return coach;
        });
        setCoachInfoData(coachInfo);
      })
      .catch((error) => {
        alert("Failed to get coachInfo data" + error);
      });
  }, []);

  const mapCoachesToSemesters = () => {
    let mappedCoaches = { Unassigned: [] };
    let mappedEmails = { Unassigned: [] };
    let mappedCurrent = {Unassigned: []};
    let currentCoach = {};

    if (!!coachInfo && !!semesters) {
      coachInfo.forEach((coach) => {
        if (coach.projects) {
          coach.projects.forEach((project) => {
            if (!mappedCoaches[project.semester_id]) {
              mappedCoaches[project.semester_id] = [];
              mappedEmails[project.semester_id] = [];
              if(coach.system_id === user.user){
                mappedCurrent[project.semester_id] = [];
                currentCoach = coach;
                console.log(currentCoach.projects)
                console.log(semesters)
              }
            }
            if (!mappedCoaches[project.semester_id].includes(coach)) {
              mappedCoaches[project.semester_id].push(coach);
              mappedEmails[project.semester_id].push(coach.email);
              if(coach.system_id === user.user){
                mappedCurrent[project.semester_id].push(coach);
              }
            }
          });
        } else {
          mappedCoaches["Unassigned"].push(coach);
          mappedEmails["Unassigned"].push(coach.email);
        }
      });
    }
    return [mappedCoaches, mappedEmails, mappedCurrent, currentCoach];
  };

  const [mappedCoachData, mappedEmailData, mappedCurrent, currentCoach] = mapCoachesToSemesters();
  console.log("mapped coach data here ", mappedCoachData);

  const GenerateCoachActions = () => {
    if(user.role === USERTYPES.ADMIN){
      return(
        <div className="accordion-button-group">
        <Accordion
          fluid
          styled
          panels={[
            {
              key: "Overdue coach actions",
              title: "Overdue Coach Actions",
              content:{
                content:(
                  semesters.map((semester) =>{
                    return(
                      mappedCoachData[semester.semester_id] &&
                      <div key={semester.semester_id} className="test2">
                        <Accordion
                          fluid
                          styled
                          key = {semester.semester_id}
                          onTitleClick={() => {
                            setActive({
                              ...active,
                              [semester.semester_id]: !active[semester.semester_id],
                            });
                          }}
                          panels={[
                            {
                              active: active[semester.semester_id],
                              title: semester.name,
                              content:{
                                content:(
                                  <Table>
                                    <TableHeader>
                                        <TableRow>
                                          <TableHeaderCell>Coach Name</TableHeaderCell>
                                          <TableHeaderCell>Project Name</TableHeaderCell>
                                          <TableHeaderCell>Action Name</TableHeaderCell>
                                          <TableHeaderCell>Due Date</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    {mappedCoachData[semester.semester_id]?.map((coach) =>{
                                    return(
                                      coach.projects
                                      ?.filter(
                                          (project) =>
                                          project.semester_id === semester.semester_id.toString(),
                                      )
                                      ?.map((project) => {
                                          return (
                                              <CoachProjects
                                              project = {project}
                                              coach = {coach}
                                              />
                                          );
                                    }));
                                    })}
                                  </Table>
                                )
                              }
                            }
                          ]}
                        />
                      </div>
                    )     
                }))
              },
            }
          ]}/>
      </div>)
    }
    else if(user.role === USERTYPES.COACH){
      return(
        <div className="accordion-button-group">
          <Accordion
            fluid
            styled
            panels={[
              {
                key: "Coach actions",
                title: "Coach Actions",
                content:{
                  content:(
                    semesters.map((semester) =>{
                      return(
                        mappedCurrent[semester.semester_id] &&
                        <Accordion
                          fluid
                          styled
                          key = {semester.semester_id}
                          onTitleClick={() => {
                            setActive({
                              ...active,
                              [semester.semester_id]: !active[semester.semester_id],
                            });
                          }}
                          panels={[
                            {
                              active: active[semester.semester_id],
                              title: semester.name,
                              content:{
                                content:(
                                  <Table>
                                    <TableHeader>
                                        <TableRow>
                                          <TableHeaderCell>Project Name</TableHeaderCell>
                                          <TableHeaderCell>Action Name</TableHeaderCell>
                                          <TableHeaderCell>Action</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    {currentCoach.projects
                                    ?.filter(
                                      (project) =>
                                        project.semester_id === semester.semester_id.toString(),
                                    )
                                    ?.map((project) => {
                                      return(
                                        <CoachActions
                                          project={project}
                                          coach={currentCoach}
                                          semester={semester}
                                        />
                                      );
                                    })}
                                  </Table> 
                                )
                              }
                            }
                          ]}
                        />
                      )
                    }))
                },
              }
            ]}/>
        </div>
      )
    }
    
  }

  return (
    <div>
      {GenerateCoachActions()}
      <div className="accordion-button-group">
        <Accordion
          fluid
          styled
          defaultActiveIndex={0}
          panels={[
            {
              key: "Unassigned",
              title: "Unassigned",
              content: {
                content: (
                  <SemesterCoaches
                    coaches={mappedCoachData && mappedCoachData["Unassigned"]}
                  />
                ),
              },
            },
          ]}
        />
        <div className="accordion-buttons-container">
          <a
            href={`mailTo:${mappedEmailData["Unassigned"].join(",")}`}
            className="ui icon button"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="mail" />
          </a>
        </div>
      </div>
      {semesters.map((semester) => {
        return (
          mappedCoachData[semester.semester_id] && (
            <div key={semester.semester_id} className="accordion-button-group">
              {console.log(
                `****** + ${
                  mappedCoachData && mappedCoachData[semester.semester_id]
                }`,
              )}
              <Accordion
                fluid
                styled
                key={semester.semester_id}
                onTitleClick={() => {
                  setActive({
                    ...active,
                    [semester.semester_id]: !active[semester.semester_id],
                  });
                }}
                panels={[
                  {
                    key: semester.semester_id,
                    title: semester.name,
                    active: active[semester.semester_id],
                    content: {
                      content: (
                        <SemesterCoaches
                          coaches={
                            mappedCoachData &&
                            mappedCoachData[semester.semester_id]
                          }
                          semesterId={semester.semester_id}
                        />
                      ),
                    },
                  },
                ]}
              />
              <div className="accordion-buttons-container">
                <a
                  href={`mailTo:${mappedEmailData[semester.semester_id].join(
                    ",",
                  )}`}
                  className="ui icon button"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="mail" />
                </a>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}
