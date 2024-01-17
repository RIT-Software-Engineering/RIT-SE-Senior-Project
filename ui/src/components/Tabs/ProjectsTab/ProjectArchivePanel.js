import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";
import { config, USERTYPES } from "../../util/functions/constants";
import React, { useEffect, useState } from "react";
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
              inactive: archive.inactive,
              locked: archive.locked,
            };
          });
        }else{
          setNewArchive(true);
        }
      });
  }, [props.project]);

  //This is for if creating a new archived project.
  //If there is a newArchive property, then do what's inside the useEffect.
  //It is for filling form data to archive that does not exist.
  useEffect(() => {
    if (newArchive) {
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
    }
  }, [props.project]);

  let submissionModalMessages;
  if (newArchive) {
    submissionModalMessages = {
      SUCCESS: "The project has been archived.",
      FAIL: "Could not archive the project.",
    };
  } else {
    submissionModalMessages = {
      SUCCESS: "The archive project has been created.",
      FAIL: "We were unable to add to archive.",
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
    },
    {
      type: "input",
      label: "Keywords",
      placeholder: "Keywords",
      name: "keywords",
    },
    {
      type: "input",
      label: "Poster Thumb",
      placeholder: "Poster Thumb",
      name: "poster_thumb",
    },
    {
      type: "input",
      label: "Poster Full",
      placeholder: "Poster Full",
      name: "poster_full",
    },
    {
      type: "input",
      label: "Archive Image",
      placeholder: "Archive Image",
      name: "archive_image",
    },
    {
      type: "textArea",
      label: "Synopsis",
      placeholder: "Synopsis",
      name: "synopsis",
    },
    {
      type: "input",
      label: "Video",
      placeholder: "Video",
      name: "video",
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
      label: "Locked",
      placeholder: "locked",
      name: "locked",
      disabled: true,
    },
  ];

  return (
    <DatabaseTableEditor
      initialState={initialState}
      submissionModalMessages={submissionModalMessages}
      submitRoute={submitRouter}
      formFieldArray={formFieldArray}
      header={(newArchive ? "Create Archive" : "Edit Archive")}
      button={(newArchive ? "plus" : "edit")}
    />
  );
}
