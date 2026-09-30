import React, { useState } from "react";
import ModalWrapper from "../../shared/ModalWrapper";
import ProjectViewerModalContent from "./ProjectViewerModalContent";
import { Button } from "semantic-ui-react";

export default function ProjectViewerModal(props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  useEffect(() => {
    SecureFetch(
      `${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${props.project?.project_id}`,
    )
      .then((response) => response.json())
      .then((archives) => {
        if (archives.length > 0) {
          if (archives[0].url_slug !== null && archives[0].url_slug !== "") {
            setURL(
              `${window.location.origin}/projects/${archives[0].url_slug}`,
            );
          }
        }
      });
  }, [props.project?.project_id]);

  const generateModalContent = () => {
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <b>Students:</b>{" "}
          {projectMembers.students?.map((s) => (
            <ProfileCircle key={s} name={s} showFullName size="tiny" />
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
        <b>URL:</b>{" "}
        {URL === "No URL found" ? (
          URL
        ) : (
          <a href={URL} target="_blank">
            {URL}
          </a>
        )}
        <br />
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
          <br />{" "}
          {convert(decode(props.project.sponsor_provided_resources || ""))}
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
              <>
                <a target="_blank" rel="noreferrer" href={file.link}>
                  {file.title}
                </a>
                <br />
              </>
            );
          })
        ) : (
          <p>No Attachments</p>
        )}{" "}
        <br />
      </>
    );
  };

  // Determine the trigger element.
  // We use the custom trigger if provided, otherwise, default to the eye Button.
  // The onClick handler is applied directly to ensure it works with Semantic UI layout.
  const triggerElement = props.trigger || (
    <Button
      icon="eye"
      onClick={handleOpen} // Handler applied directly to the Button
    />
  );

  return (
    <ModalWrapper
      open={open}
      onClose={handleClose}
      closeOnDimmerClick={false}
      trigger={triggerElement} // Pass the button directly
      title={`Viewing "${props.project?.display_name || props.project?.title || "Project"}"`}
      actions={[<Button key="close" content="Close" onClick={handleClose} />]}
    >
      <ProjectViewerModalContent
        project={props.project}
        semesterMap={props.semesterMap}
      />
    </ModalWrapper>
  );
}
