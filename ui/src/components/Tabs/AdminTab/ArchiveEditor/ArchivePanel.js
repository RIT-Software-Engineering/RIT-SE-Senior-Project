import DatabaseTableEditor from "../../../shared/editors/DatabaseTableEditor";
import { config, USERTYPES } from "../../../util/functions/constants";
import React, { useEffect, useState } from "react";
import { SecureFetch } from "../../../util/functions/secureFetch";
import { slugify } from "../../../util/functions/utils";
import { decode } from "html-entities";

/**
 * Represents an archived project in the Admin Tab -> Archive Editor
 * @param props
 *      Notable props: newArchive, indicates whether a project has been added to archives or not
 */
export default function ArchivePanel(props) {
  const [projectMembers, setProjectMembers] = useState({
    students: [],
    coaches: [],
    sponsor: "",
  });

  const assignSponsor = () => {
    //finds the sponsor name inside the list of sponsor objects.
    if (props.activeSponsors !== undefined) {
      let sponsorName = props?.activeSponsors.find(
        (sponsyBoi) => sponsyBoi.sponsor_id === props?.project?.sponsor
      );
      if (sponsorName !== undefined) {
        setInitialState((prevInitialState) => {
          return {
            ...prevInitialState,
            sponsor: `${sponsorName.fname} ${sponsorName.lname}`,
          };
        });
      }
    }
  };

  useEffect(() => {
    assignSponsor();
  }, [props.activeSponsors]);

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
    //this is for getting the start and end date of a project.
    if (props?.project?.semester) {
      SecureFetch(
        `${config.url.API_GET_START_AND_END_DATE}/?semester=${props.project.semester}`
      )
        .then((response) => response.json())
        .then((dates) => {
          setInitialState((prevInitialState) => {
            return {
              ...prevInitialState,
              start_date: dates.start_date,
              end_date: dates.end_date,
              dept: "SE",
            };
          });
        })
        .catch((error) => {
          alert(
            "An issue occurred while searching for archive content " + error
          );
        });
    }
  }, [props.project]);

  const [initialState, setInitialState] = useState({
    featured: props?.project?.featured || "",
    outstanding: props?.project?.outstanding || "",
    creative: props?.project?.creative || "",
    priority: props?.project?.priority || "",
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
    submitRouter = config.url.API_POST_CREATE_ARCHIVE;
  } else {
    submitRouter = config.url.API_POST_EDIT_ARCHIVE;
  }

  let formFieldArray = [
    {
      type: "input",
      label: "Project ID",
      placeholder: "Project ID",
      name: "project_id",
      disabled: true,
    },
    {
      type: "input",
      label: "Archive Project Title",
      placeholder: "Archive Project Title",
      name: "title",
    },
    {
      type: "input",
      label: "Team Name",
      placeholder: "Team Name",
      name: "team_name",
    },
    {
      type: "input",
      label: "Members",
      placeholder: "Members",
      name: "members",
    },
    {
      type: "input",
      label: "Keywords",
      placeholder: "Keywords",
      name: "keywords",
    },
    {
      type: "input",
      label: "Sponsor",
      placeholder: "Sponsor",
      name: "sponsor",
    },
    {
      type: "input",
      label: "Coach",
      placeholder: "Coach",
      name: "coach",
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
      label: "Name",
      placeholder: "Name",
      name: "name",
    },
    {
      type: "input",
      label: "Department",
      placeholder: "Department",
      name: "dept",
    },
    {
      type: "date",
      label: "Start Date",
      placeholder: "Start Date",
      name: "start_date",
    },
    {
      type: "date",
      label: "End Date",
      placeholder: "End Date",
      name: "end_date",
    },
    {
      type: "checkbox",
      label: "featured",
      name: "featured",
      disabled: false,
    },
    {
      type: "checkbox",
      label: "outstanding",
      name: "outstanding",
      disabled: false,
    },
    {
      type: "checkbox",
      label: "creative",
      name: "creative",
      disabled: false,
    },
    {
      type: "input",
      name: "priority",
      label: "priority ***INTEGERS ONLY",
    },
    {
      // slugs can only be set on new archive submission
      type: "input",
      label: props.newArchive
        ? "URL Slug (this can not be changed)"
        : "URL Slug",
      placeholder: "url_slug",
      name: "url_slug",
      disabled: !props.newArchive,
    },
    {
      type: "checkbox",
      label: "inactive",
      name: "inactive",
      disabled: false,
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
