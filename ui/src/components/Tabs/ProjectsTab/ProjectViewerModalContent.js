import React, { useEffect, useState } from "react";
import { config, USERTYPES } from "../../util/functions/constants";
import { SecureFetch } from "../../util/functions/secureFetch";
import { formattedAttachments } from "./ProjectEditorModal";
import { decode } from "he";
import { convert } from "html-to-text";
import ProfileCircle from "../../util/components/ProfileCircle";

const NO_URL_FOUND = "No URL found";

export default function ProjectViewerModalContent(props) {
  const project = props.project ?? {};
  const projectId = project.project_id;

  const [projectMembers, setProjectMembers] = useState({
    students: [],
    coaches: [],
  });
  const [projectURL, setProjectURL] = useState(NO_URL_FOUND);

  // Fetch project members
  useEffect(() => {
    let cancelled = false;

    setProjectMembers({ students: [], coaches: [] });

    if (projectId == null) return;

    SecureFetch(`${config.url.API_GET_PROJECT_MEMBERS}?project_id=${projectId}`)
      .then((response) => response.json())
      .then((members) => {
        if (cancelled) return;

        const projectGroupedValues = {
          students: [],
          coaches: [],
        };

        if (!Array.isArray(members)) return;

        members.forEach((member) => {
          const fullName = `${member.fname} ${member.lname}${
            member.view_only === "TRUE" ? " (View Only)" : ""
          }`;

          switch (member.type) {
            case USERTYPES.STUDENT:
              projectGroupedValues.students.push(fullName);
              break;

            case USERTYPES.COACH:
              projectGroupedValues.coaches.push(fullName);
              break;

            default:
              console.error(
                `Project viewer error - invalid project member type "${member.type}" for member: `,
                member,
              );
              break;
          }
        });

        setProjectMembers(projectGroupedValues);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to fetch project members:", error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  // Fetch the project archive URL
  useEffect(() => {
    let cancelled = false;

    // Reset the URL when switching projects
    setProjectURL(NO_URL_FOUND);

    if (projectId == null) return;

    SecureFetch(
      `${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${projectId}`,
    )
      .then((response) => response.json())
      .then((archives) => {
        if (cancelled) return;

        if (Array.isArray(archives) && archives.length > 0) {
          const slug = archives[0].url_slug;

          if (typeof slug === "string" && slug.trim() !== "") {
            // v1.8.5 fix: Display the full project URL
            // instead of only the URL slug.
            const cleanSlug = slug.replace(/^\/+/, "");

            setProjectURL(`${window.location.origin}/projects/${cleanSlug}`);
          }
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to fetch project archive URL:", error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const attachments = project.attachments
    ? (formattedAttachments(project) ?? [])
    : [];

  return (
    <>
      {/* Team Members */}
      <h3>Team members</h3>
      {/* Students */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <b>Students:</b>

        {projectMembers.students.map((student) => (
          <div
            key={student}
            style={{
              overflowWrap: "break-word",
              whiteSpace: "normal",
              maxWidth: "100%",
            }}
          >
            <ProfileCircle name={student} showFullName size="tiny" />
          </div>
        ))}
      </div>
      <br />
      {/* Coaches */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <b>Coaches:</b>

        {projectMembers.coaches.map((coach) => (
          <div
            key={coach}
            style={{
              overflowWrap: "break-word",
              whiteSpace: "normal",
              maxWidth: "100%",
            }}
          >
            <ProfileCircle
              name={coach}
              isStudent={false}
              showFullName
              size="tiny"
            />
          </div>
        ))}
      </div>
      {/* Website */}
      <h3>Website</h3>
      <b>URL:</b>{" "}
      {projectURL === NO_URL_FOUND ? (
        NO_URL_FOUND
      ) : (
        <a href={projectURL} target="_blank" rel="noopener noreferrer">
          {projectURL}
        </a>
      )}
      <br />
      {/* Sponsor Information */}
      <h3>Sponsor Info</h3>
      <b>Organization:</b> {decode(project.organization || "")}
      <br />
      <b>Primary Contact:</b> {decode(project.primary_contact || "")}
      <br />
      <b>Email:</b> {decode(project.contact_email || "")}
      <br />
      <b>Phone:</b> {decode(project.contact_phone || "")}
      <br />
      {/* Project Information */}
      <h3>Project Info</h3>
      <pre
        style={{
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        <b>Original Submission Date:</b>
        <br />
        {decode(project.submission_datetime || "")}

        <br />
        <br />

        <b>Background info:</b>
        <br />
        {convert(decode(project.background_info || ""))}

        <br />
        <br />

        <b>Description:</b>
        <br />
        {convert(decode(project.project_description || ""))}

        <br />
        <br />

        <b>Scope:</b>
        <br />
        {convert(decode(project.project_scope || ""))}

        <br />
        <br />

        <b>Challenges:</b>
        <br />
        {convert(decode(project.project_challenges || ""))}

        <br />
        <br />

        <b>Constraints & Assumptions:</b>
        <br />
        {convert(decode(project.constraints_assumptions || ""))}

        <br />
        <br />

        <b>Provided Resources:</b>
        <br />
        {convert(decode(project.sponsor_provided_resources || ""))}

        <br />
        <br />

        <b>Search keywords:</b>
        <br />
        {decode(project.project_search_keywords || "")}

        <br />
        <br />

        <b>Deliverables:</b>
        <br />
        {convert(decode(project.sponsor_deliverables || ""))}

        <br />
        <br />

        <b>Proprietary Info:</b>
        <br />
        {convert(decode(project.proprietary_info || ""))}

        <br />
        <br />

        <b>Sponsor Available: </b>
        {decode(project.sponsor_avail_checked || "") === "on" ? "Yes" : "No"}

        <br />

        <b>Assignment of Rights: </b>
        {decode(project.assignment_of_rights || "")}

        <br />

        <b>Semester: </b>
        {decode(props.semesterMap?.[project.semester] || "")}

        <br />

        <b>Status: </b>
        {decode(project.status || "")}

        <br />
      </pre>
      {/* Attachments */}
      <h3>Attachments</h3>
      {attachments.length > 0 ? (
        attachments.map((file, index) => (
          <React.Fragment key={`${file.link}-${index}`}>
            <a target="_blank" rel="noopener noreferrer" href={file.link}>
              {file.title}
            </a>
            <br />
          </React.Fragment>
        ))
      ) : (
        <p>No Attachments</p>
      )}
      <br />
    </>
  );
}
