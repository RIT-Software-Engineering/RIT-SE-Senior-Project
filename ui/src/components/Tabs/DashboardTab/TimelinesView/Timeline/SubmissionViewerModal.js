import React from "react";
import { Modal } from "semantic-ui-react";
import SubmissionViewerModalContent from "./SubmissionViewerModalContent";

export default function SubmissionViewerModal(props) {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      closeOnDimmerClick={false}
      closeOnEscape={false}
      className="sticky"
      trigger={<div>{props.trigger}</div>}
      header={`Submission for ${props.action.action_title} (${props.target[0]?.toUpperCase()}${props.target?.substring(1)} Action)`}
      actions={[{ content: "Close", key: 0 }]}
      content={{
        content: (
          <SubmissionViewerModalContent
            action={props.action}
            target={props.target}
            semesterName={props.semesterName}
            projectName={props.projectName}
            noSubmission={props.noSubmission}
          />
        ),
      }}
    />
  );
}
