import React, { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { config, USERTYPES } from "../../util/functions/constants";
import { SecureFetch } from "../../util/functions/secureFetch";
import { formattedAttachments } from "./ProjectEditorModal";
import { decode } from "he";
import { convert } from "html-to-text";
import ProfileCircle from "../../util/components/ProfileCircle";

export default function ProjectViewerModalContent(props) {
  const [projectMembers, setProjectMembers] = useState({
    students: [],
    coaches: [],
  });
  const [URL, setURL] = useState("No URL found");

  // Project Members Fetch
  useEffect(() => {
    SecureFetch(
      `${config.url.API_GET_PROJECT_MEMBERS}?project_id=${props.project?.project_id}`,
    )
      .then((response) => response.json())
      .then((members) => {
        let projectGroupedValues = { students: [], coaches: [] };
        members.forEach((member) => {
          switch (member.type) {
            case USERTYPES.STUDENT:
              member.view_only === "TRUE"
                ? projectGroupedValues.students.push(
                    `${member.fname} ${member.lname} ${"(View Only)"}`,
                  )
                : projectGroupedValues.students.push(
                    `${member.fname} ${member.lname}`,
                  );
              break;
            case USERTYPES.COACH:
              member.view_only === "TRUE"
                ? projectGroupedValues.coaches.push(
                    `${member.fname} ${member.lname} ${"(View Only)"}`,
                  )
                : projectGroupedValues.coaches.push(
                    `${member.fname} ${member.lname}`,
                  );
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
      });
  }, [props.project?.project_id]);

  // Project Archive URL Fetch
  useEffect(() => {
    SecureFetch(
      `${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${props.project?.project_id}`,
    )
      .then((response) => response.json())
      .then((archives) => {
        if (archives.length > 0) {
          if (archives[0].url_slug !== null && archives[0].url_slug !== "") {
            setURL(archives[0].url_slug);
          }
        }
      });
  }, [props.project?.project_id]);

  return (
    <>
      <style>
        {`
            #gfg {
                overflow-x: auto;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            `}
      </style>
      <h3>Team members</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <b>Students:</b>{" "}
        {projectMembers.students?.map((s) => (
          <div style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}> <ProfileCircle key={s} name={s} showFullName size="tiny" /> </div>
        ))}{" "}
        <br />
      </div>
      <br />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <b>Coaches:</b>{" "}
        {projectMembers.coaches?.map((c) => (
          <ProfileCircle
            key={c}
            name={c}
            isStudent={false}
            showFullName
            size="tiny"
          />
        ))}{" "}
        <br />
      </div>
      <h3>Website</h3>
      <b>URL:</b> {URL} <br />
      <h3>Sponsor Info</h3>
      <b>Organization:</b> {decode(props.project.organization || "")} <br />
      <b>Primary Contact:</b> {decode(props.project.primary_contact || "")}{" "}
      <br />
      <b>Email:</b> {decode(props.project.contact_email || "")} <br />
      <b>Phone:</b> {decode(props.project.contact_phone || "")} <br />
      <h3>Project Info</h3>
      <pre
        style={{
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        <b>Original Submission Date:</b>
        <br /> {decode(props.project.submission_datetime || "")}
        <br />
        <br />
        <b>Background info:</b>
        <br /> {convert(decode(props.project.background_info || ""))}
        <br />
        <br />
        <b>Description:</b>
        <br /> {convert(decode(props.project.project_description || ""))}
        <br />
        <br />
        <b>Scope:</b>
        <br /> {convert(decode(props.project.project_scope || ""))}
        <br />
        <br />
        <b>Challenges:</b>
        <br /> {convert(decode(props.project.project_challenges || ""))}
        <br />
        <br />
        <b>Constraints & Assumptions:</b>
        <br /> {convert(decode(props.project.constraints_assumptions || ""))}
        <br />
        <br />
        <b>Provided Resources:</b>
        <br /> {convert(decode(props.project.sponsor_provided_resources || ""))}
        <br />
        <br />
        <b>Search keywords:</b>
        <br /> {decode(props.project.project_search_keywords || "")}
        <br />
        <br />
        <b>Deliverables:</b>
        <br /> {convert(decode(props.project.sponsor_deliverables || ""))}
        <br />
        <br />
        <b>Proprietary Info:</b>
        <br /> {convert(decode(props.project.proprietary_info || ""))}
        <br />
        <br />
        <b>Sponsor Available: </b>
        {decode(props.project.sponsor_avail_checked) === "on" ? "Yes" : "No"}
        <br />
        <b>Assignment of Rights: </b>
        {decode(props.project.assignment_of_rights || "")}
        <br />
        <b>Semester: </b>
        {decode(props.semesterMap[props.project.semester] || "")}
        <br />
        <b>Status: </b>
        {decode(props.project.status || "")}
        <br />
      </pre>
      <h3>Attachments</h3>
      {props.project.attachments ? (
        formattedAttachments(props.project)?.map((file) => {
          return (
            <React.Fragment key={file.title}>
              <a target="_blank" rel="noreferrer" href={file.link}>
                {file.title}
              </a>
              <br />
            </React.Fragment>
          );
        })
      ) : (
        <p>No Attachments</p>
      )}{" "}
      <br />
    </>
  );
}
