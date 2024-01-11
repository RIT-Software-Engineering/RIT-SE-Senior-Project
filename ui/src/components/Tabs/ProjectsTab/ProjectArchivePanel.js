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

  const [projectArchive, setProjectArchive] = useState({
    projectArchive: {
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
    }
  });

  //This is for if creating a new archived project.
  //If there is a newArchive property, then do what's inside the useEffect.
  //It is for filling form data to archive that does not exist.
  useEffect(() => {
    //todo: create if for project.status. If it's already archived, find a way to guard from rearchiving.
    if (props.newArchive) {
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
  }, [props.project, props.newArchive]);

  useEffect(() => {
    if (!props.newArchive) {
      SecureFetch(
        `${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${props.project?.project_id}`
      )
        .then((response) => response.json())
        .then((archive) => {
          setProjectArchive((archive) => {
            return {
              projectArchive.archive_id: archive.archive_id,
              projectArchive.project_id: archive.project_id,
              projectArchive.title: archive.title,
              projectArchive.team_name: archive.team_name,
              projectArchive.members: archive.members,
              projectArchive.sponsor: archive.sponsor,
              projectArchive.coach: archive.coach,
              projectArchive.poster_thumb: archive.poster_thumb,
              projectArchive.poster_full: archive.poster_full,
              projectArchive.archive_image: archive.archive_image,
              projectArchive.synopsis: archive.synopsis,
              projectArchive.video: archive.video,
              projectArchive.name: archive.name,
              projectArchive.dept: archive.dept,
              projectArchive.start_date: archive.start_date,
              projectArchive.end_date: archive.end_date,
              projectArchive.keywords: archive.keywords,
              projectArchive.url_slug: archive.url_slug,
              projectArchive.inactive: archive.inactive,
              projectArchive.locked: archive.locked,
            };
          });
        });
    }
  }, [props.project, props.newArchive]);

  const [initialState, setInitialState] = useState({
    archive_id: props?.project?.archive_id || "",
    project_id: props?.project?.project_id || "",
    title: decode(props?.project?.title) || "",
    team_name: decode(props?.project?.team_name) || "",
    members: decode(props?.project?.members) || "",
    sponsor: decode(props?.project?.sponsor) || "",
    coach: decode(props?.project?.coach) || "",
    poster_thumb: decode(props?.project?.poster_thumb) || "",
    poster_full: decode(props?.project?.poster_full) || "",
    archive_image: decode(props?.project?.archive_image) || "",
    synopsis: decode(props?.project?.synopsis).replace(/\r\n|\r/g, "\n") || "",
    video: decode(props?.project?.video) || "",
    name: decode(props?.project?.name) || "",
    dept: props?.project?.dept || "",
    start_date: props?.project?.start_date || "",
    end_date: props?.project?.end_date || "",
    keywords: decode(props?.project?.project_search_keywords) || "",
    // suggest a slug if this is a new archive project and the project already exists before archival
    url_slug:
      props?.project?.url_slug || props.newArchive
        ? slugify(props?.project?.title)
        : "",
    inactive: props.project?.inactive || "",
    locked: props.project?.locked || "",
  });

  let submissionModalMessages;
  if (props.newArchive) {
    submissionModalMessages = {
      SUCCESS: "The project has been archived.",
      FAIL: "Could not archive the project.",
    };
  } else {
    submissionModalMessages = props.create
      ? {
          SUCCESS: "The archive project has been created.",
          FAIL: "We were unable to add to archive.",
        }
      : {
          SUCCESS: "The archived project has been edited.",
          FAIL: "Could not make edits.",
        };
  }

  let submitRouter;
  if (props.newArchive) {
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
      header={props.header}
      button={props.buttonIcon || (props.create ? "plus" : "edit")}
    />
  );
}
