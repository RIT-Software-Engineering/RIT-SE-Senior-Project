import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";
import { config, USERTYPES } from "../../util/functions/constants";
import React, { useEffect, useState, useContext } from "react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { slugify } from "../../util/functions/utils";
import { decode } from "html-entities";
import { UserContext } from "../../util/functions/UserContext";

/**
 * Represents an archived project in the Admin Tab -> Archive Editor
 * @param props
 *      Notable props: newArchive, indicates whether a project has been added to archives or not
 */
export default function ProjectArchivePanel(props) {
  const [projectMembers, setProjectMembers] = useState({
    students: "",
    coaches: "",
    sponsor: "",
  });

  const [newArchive, setNewArchive] = useState({});
  const isStudent = (useContext(UserContext).user?.role === USERTYPES.STUDENT);

  const [initialState, setInitialState] = useState({
    archive_id: "",
    project_id: "",
    title: "",
    team_name: "",
    members: "",
    sponsor: "",
    coach: "",
    poster_thumb: "",
    poster_full: "",
    archive_image: "",
    synopsis: "",
    video: "",
    name: "",
    dept: "",
    start_date: "",
    end_date: "",
    keywords: "",
    url_slug: "",
    inactive: "",
    locked: "",
  });


  //This is for checking for existing archives and assigning their values as defaults.
  useEffect(() => {
    SecureFetch(
      `${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${props.project?.project_id}`
    )
      .then((response) => response.json())
      .then((archives) => {
        if (archives.length > 0){
          let archive = archives[0];
          setNewArchive(false);
          setInitialState((prevInitialState) => {
            return {
              ...prevInitialState,
              archive_id: archive.archive_id,
              project_id: archive.project_id,
              title: archive.title,
              team_name: archive.team_name,
              members: archive.members,
              sponsor: archive.sponsor,
              coach: archive.coach,
              poster_thumb: archive.poster_thumb,
              poster_full: archive.poster_full,
              archive_image: archive.archive_image,
              synopsis: archive.synopsis,
              video: archive.video,
              name: archive.name,
              dept: archive.dept,
              start_date: archive.start_date,
              end_date: archive.end_date,
              keywords: archive.keywords,
              url_slug: archive.url_slug,
              inactive: archive.inactive === ""
                ? false
                : true,
              locked: archive.locked === ""
                ? false
                : true,
            };
          });
        }else{
          setNewArchive(true);
          setInitialState((prevInitialState) => {
            return {
              ...prevInitialState,
              project_id: props.project?.project_id,
              title: props.project?.title,
              url_slug: slugify(props.project?.title),
              inactive: false,
              locked: false,
            };
          });
          SecureFetch(
            `${config.url.API_GET_PROJECT_MEMBERS}?project_id=${props.project?.project_id}`
          )
            .then((response) => response.json())
            .then((members) => {
              let projectMemberOptions = { students: [], coaches: [] };
              let projectGroupedValues = { students: [], coaches: [] };
              members.forEach((member) => {
                switch (member.type) {
                  case USERTYPES.STUDENT:
                    projectMemberOptions.students.push({
                      key: member.system_id,
                      text: `${member.lname}, ${member.fname} (${member.system_id})`,
                      value: member.system_id,
                    });
                    projectGroupedValues.students.push(
                      ` ${member.fname} ${member.lname}`
                    );
                    break;
                  case USERTYPES.COACH:
                    if (props.viewOnly) {
                      projectMemberOptions.coaches.push({
                        key: member.system_id,
                        text: `${member.lname}, ${member.fname} (${member.system_id})`,
                        value: member.system_id,
                      });
                    }
                    projectGroupedValues.coaches.push(
                      `${member.fname} ${member.lname}`
                    );
                    break;
                  default:
                    console.error(
                      `Project editor error - invalid project member type "${member.type}" for member: `,
                      member
                    );
                    break;
                }
              });
              setInitialState((prevInitialState) => {
                return {
                  ...prevInitialState,
                  members: projectGroupedValues.students,
                  coach: projectGroupedValues.coaches,
                };
              });
              setProjectMembers(projectMemberOptions);
            });
          if (props.project?.semester) {
            SecureFetch(
              `${config.url.API_GET_START_AND_END_DATE}/?semester=${props.project?.semester}`
            )
              .then((response) => response.json())
              .then((dates) => {
                setInitialState((prevInitialState) => {
                  return {
                    ...prevInitialState,
                    start_date: dates[0].start_date,
                    end_date: dates[0].end_date,
                    dept: "SE",
                  };
                });
              });
          }
          SecureFetch(
           `${config.url.API_GET_PROJECT_SPONSOR}/?project_id=${props.project?.project_id}`
          )
            .then((response) => response.json())
            .then((sponsor) => {
              if (sponsor.length > 0) {
                setInitialState((prevInitialState) => {
                  return {
                    ...prevInitialState,
                    sponsor: `${sponsor[0].fname} ${sponsor[0].lname}`
                  };
                });
              }
            });
        }
      });
  }, [props.project]);

  let submissionModalMessages;
  if (newArchive) {
    submissionModalMessages = {
      SUCCESS: "The website was created.",
      FAIL: "We were unable to create the website.",
    };
  } else {
    submissionModalMessages = {
      SUCCESS: "The website has been updated.",
      FAIL: "We were unable to update to website.",
    };
  }

  let submitRouter;
  if (newArchive) {
    submitRouter = config.url.API_POST_CREATE_ARCHIVE_STUDENT;
  } else {
    submitRouter = config.url.API_POST_EDIT_ARCHIVE_STUDENT;
  }

  let formFieldArray = [
    {
      type: "input",
      label: "Team Name",
      placeholder: "Team Name",
      name: "team_name",
      disabled: (initialState.locked || initialState.inactive) && isStudent,
    },
    {
      type: "input",
      label: "Keywords",
      placeholder: "Keywords",
      name: "keywords",
      disabled: (initialState.locked || initialState.inactive) && isStudent,
    },
    {
      type: "upload",
      label: "Poster - PNG files only, max size 30MB",
      placeholder: !!initialState.poster_full
        ? "Current File: - " + initialState.poster_full.split("/").slice().pop()
        : null,
      accept: ".png",
      name: "poster_full",
      disabled: (initialState.locked || initialState.inactive) && isStudent,
    },
    {
      type: "upload",
      label: "Archive Image - PNG files only, max size 30MB",
      placeholder: !!initialState.archive_image
        ? "Current File: - " + initialState.archive_image.split("/").slice().pop()
        : null,
      accept: ".png",
      name: "archive_image",
      disabled: (initialState.locked || initialState.inactive) && isStudent,
    },
    {
      type: "textArea",
      label: "Synopsis",
      placeholder: "Synopsis",
      name: "synopsis",
      disabled: (initialState.locked || initialState.inactive) && isStudent,
    },
    {
      type: "upload",
      label: "Video - MP4 files only, max size 300MB",
      placeholder: !!initialState.video
        ? "Current File: - " + initialState.video.split("/").slice().pop()
        : null,
      accept: ".mp4",
      name: "video",
      disabled: (initialState.locked || initialState.inactive) && isStudent,
    },
    {
      type: "input",
      label: "URL Slug",
      placeholder: "url_slug",
      name: "url_slug",
      disabled: true,
    },
    {
      type: "checkbox",
      label: "Inactive - Not Displayed On Public Site",
      placeholder: "locked",
      name: "inactive",
      disabled: isStudent,
    },
    {
      type: "checkbox",
      label: "Locked - Unable To Edit",
      placeholder: "locked",
      name: "locked",
      disabled: isStudent,
    },
  ];

  return (
    <DatabaseTableEditor
      initialState={initialState}
      submissionModalMessages={submissionModalMessages}
      submitRoute={submitRouter}
      formFieldArray={formFieldArray}
      header={(newArchive ? "Create Website" : "Edit Website")}
      button={(newArchive ? "plus" : "edit")}
    />
  );
}
