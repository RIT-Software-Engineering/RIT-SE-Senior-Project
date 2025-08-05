import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";
import { config, USERTYPES } from "../../util/functions/constants";
import React, { useEffect, useState, useContext } from "react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { slugify } from "../../util/functions/utils";
import { UserContext } from "../../util/functions/UserContext";
import { canEditProjectWebsite } from "../../util/functions/projectPermissions";

/**
 * Represents an archived project in the Admin Tab -> Archive Editor
 * @param props
 *      Notable props: newArchive, indicates whether a project has been added to archives or not
 */
export default function ProjectArchivePanel(props) {
  const [newArchive, setNewArchive] = useState({});
  const isStudent = useContext(UserContext).user?.role === USERTYPES.STUDENT;
  const userContext = useContext(UserContext);
  const [canEdit, setCanEdit] = useState(false);
  const [errors, setErrors] = useState([]);

  // Check if this component should allow editing
  const shouldAllowEditing = () => {
    console.log("ProjectArchivePanel shouldAllowEditing check:", {
      project_id: props.project?.project_id,
      userType: userContext.user?.type,
      isCandidateProject: props.isCandidateProject,
      canEditProject: props.canEditProject,
      viewOnly: props.viewOnly,
    });

    // If viewOnly is set, no editing
    if (props.viewOnly) {
      console.log("shouldAllowEditing: false (viewOnly)");
      return false;
    }

    // Admin can always edit
    if (userContext.user?.role === USERTYPES.ADMIN) {
      console.log(
        "ProjectArchivePanel: Admin user, allowing edit",
        props.project?.project_id,
      );
      return true;
    }

    // If it's a candidate project, only allow editing if explicitly permitted
    if (props.isCandidateProject) {
      const canEdit = props.canEditProject === true;
      console.log("shouldAllowEditing (candidate):", canEdit);
      return canEdit;
    }

    // For non-candidate projects, check if user has edit permission
    const canEdit = props.canEditProject === true;
    console.log("shouldAllowEditing (non-candidate):", canEdit);
    return canEdit;
  };

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

  // Generate a team name based on project title and keywords
  const generateTeamName = (projectTitle, projectKeywords, semester) => {
    if (!projectTitle && !projectKeywords) {
      return "Project Team";
    }

    let baseNameSource = projectTitle || projectKeywords;

    // Split the source into words and filter out common words
    const commonWords = [
      "a",
      "an",
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "system",
      "platform",
      "application",
      "tool",
      "project",
    ];
    const words = baseNameSource
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.includes(word))
      .slice(0, 2); // Take first 2 meaningful words

    if (words.length === 0) {
      return "ProjectTeam";
    }

    // Capitalize first letter of each word and join
    const projectPart = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    // Generate project semester suffix (e.g., "Summer2025")
    let dateSuffix = "";
    if (semester) {
      const semesterMatch = semester.toString().match(/(\d{4})-(\d{2})/);
      if (semesterMatch) {
        const year = semesterMatch[1];
        const month = parseInt(semesterMatch[2]);
        // Determine season based on month
        let season;
        if (month >= 8) {
          season = "Fall";
        } else if (month >= 1 && month <= 5) {
          season = "Spring";
        } else {
          season = "Summer";
        }
        dateSuffix = `${season}${year}`;
      }
    }

    // If no semester info, fall back to current date
    if (!dateSuffix) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
      const currentYear = currentDate.getFullYear();

      let season;
      if (currentMonth >= 6 && currentMonth <= 8) {
        season = "Summer";
      } else if (currentMonth >= 9 && currentMonth <= 11) {
        season = "Fall";
      } else if (currentMonth >= 12 || currentMonth <= 2) {
        season = "Winter";
      } else {
        season = "Spring";
      }

      dateSuffix = `${season}${currentYear}`;
    }

    // Combine: ProjectPart + ProjectSemester (e.g., "BuzzboostAnalyticsSummer2025")
    return `${projectPart}${dateSuffix}`;
  };

  // Generate a unique URL slug by checking existing archives
  const generateUniqueSlug = async (baseTitle) => {
    if (!baseTitle) return "";

    const baseSlug = slugify(baseTitle);

    try {
      // Fetch existing archives with proper parameters to avoid datatype mismatch
      const response = await SecureFetch(
        `${config.url.API_GET_ARCHIVES}?resultLimit=1000&offset=0`,
      );
      const data = await response.json();

      // Handle both array and object responses
      const archiveList = Array.isArray(data)
        ? data
        : data.projects
          ? data.projects
          : [];

      // Get all existing URL slugs
      const existingSlugs = archiveList
        .map((archive) => archive?.url_slug)
        .filter(Boolean);

      // If base slug doesn't exist, return it
      if (!existingSlugs.includes(baseSlug)) {
        return baseSlug;
      }

      // Find next available numbered slug
      let counter = 2;
      let uniqueSlug = `${baseSlug}${counter.toString().padStart(2, "0")}`;

      while (existingSlugs.includes(uniqueSlug)) {
        counter++;
        uniqueSlug = `${baseSlug}${counter.toString().padStart(2, "0")}`;
      }

      return uniqueSlug;
    } catch (error) {
      console.error("Error generating unique slug:", error);
      // Fallback to basic slug with timestamp if API fails
      return `${baseSlug}-${Date.now()}`;
    }
  };

  const loadArchiveData = () => {
    SecureFetch(
      `${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${props.project?.project_id}`,
    )
      .then((response) => response.json())
      .then((archives) => {
        if (archives.length > 0) {
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
              inactive: archive.inactive === "" ? false : true,
              locked: archive.locked === "" ? false : true,
            };
          });
        } else {
          setNewArchive(true);
          const generatedTeamName = generateTeamName(
            props.project?.title,
            props.project?.project_search_keywords,
            props.project?.semester,
          );

          // Generate unique URL slug
          generateUniqueSlug(props.project?.title)
            .then((uniqueSlug) => {
              setInitialState((prevInitialState) => {
                return {
                  ...prevInitialState,
                  project_id: props.project?.project_id,
                  title: props.project?.title,
                  team_name: generatedTeamName,
                  url_slug: uniqueSlug,
                  inactive: false,
                  locked: false,
                };
              });
            })
            .catch((error) => {
              console.error(
                "Error generating unique slug, using basic slug:",
                error,
              );
              // Fallback to basic slug generation
              setInitialState((prevInitialState) => {
                return {
                  ...prevInitialState,
                  project_id: props.project?.project_id,
                  title: props.project?.title,
                  team_name: generatedTeamName,
                  url_slug: slugify(props.project?.title || ""),
                  inactive: false,
                  locked: false,
                };
              });
            });
          SecureFetch(
            `${config.url.API_GET_PROJECT_MEMBERS}?project_id=${props.project?.project_id}`,
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
                      ` ${member.fname} ${member.lname}`,
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
                      `${member.fname} ${member.lname}`,
                    );
                    break;
                  default:
                    console.error(
                      `Project editor error - invalid project member type "${member.type}" for member: `,
                      member,
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
            });
          if (props.project?.semester) {
            SecureFetch(
              `${config.url.API_GET_START_AND_END_DATE}/?semester=${props.project?.semester}`,
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
            `${config.url.API_GET_PROJECT_SPONSOR}/?project_id=${props.project?.project_id}`,
          )
            .then((response) => response.json())
            .then((sponsor) => {
              if (sponsor.length > 0) {
                setInitialState((prevInitialState) => {
                  return {
                    ...prevInitialState,
                    sponsor: `${sponsor[0].fname} ${sponsor[0].lname}`,
                  };
                });
              }
            });
        }
      });
  };

  //This is for checking for existing archives and assigning their values as defaults.
  useEffect(() => {
    loadArchiveData(props.project);

    // Set whether editing is allowed
    setCanEdit(shouldAllowEditing());
  }, [
    props.project,
    props.isCandidateProject,
    props.requireMembershipCheck,
    props.canEdit,
    props.permissionsLoaded,
  ]);

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
      disabled:
        userContext.user?.role !== USERTYPES.ADMIN ||
        ((initialState.locked || initialState.inactive) && isStudent),
      required: true,
    },
    {
      type: "input",
      label: "Project Keywords",
      placeholder: "Keywords",
      name: "keywords",
      disabled: (initialState.locked || initialState.inactive) && isStudent,
      required: true,
    },
    {
      type: "upload",
      label: "Poster - PNG files only, max size 30MB",
      accept: ".png",
      name: "poster_full",
      disabled: (initialState.locked || initialState.inactive) && isStudent,
    },
    {
      type: "upload",
      label: "Archive Image - PNG files only, max size 30MB",
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
      required: true,
    },
    {
      type: "upload",
      label: "Video - MP4 files only, max size 300MB",
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

  // Validation functions
  const validateForm = (data) => {
    const errorsFound = [];

    // Required field validations
    // Team Name
    if (!data.team_name?.trim()) {
      errorsFound.push({
        name: "team_name",
        message: "Team Name must be provided",
      });
    }

    // Keywords
    if (!data.keywords?.trim()) {
      errorsFound.push({
        name: "keywords",
        message: "Keywords must be provided",
      });
    }

    // Synopsis
    if (!data.synopsis?.trim()) {
      errorsFound.push({
        name: "synopsis",
        message: "Synopsis must be provided",
      });
    }

    return errorsFound;
  };

  const preSubmit = (data) => {
    const validationErrors = validateForm(data);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return null;
    }

    setErrors([]);
    return data;
  };

  return (
    <>
      {canEdit && (
        <DatabaseTableEditor
          initialState={initialState}
          submissionModalMessages={submissionModalMessages}
          submitRoute={submitRouter}
          formFieldArray={formFieldArray}
          header={newArchive ? "Create Website" : "Edit Website"}
          button={newArchive ? "plus" : "edit"}
          callback={() => {
            loadArchiveData(props.project);
          }}
          viewOnly={props.viewOnly}
          preSubmit={preSubmit}
          errors={errors}
        />
      )}
    </>
  );
}
