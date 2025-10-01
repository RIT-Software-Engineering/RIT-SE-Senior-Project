import React from "react";
import ModalWrapper from "../../../../shared/ModalWrapper";
import { Modal } from "semantic-ui-react";
import SubmissionViewerModalContent from "./SubmissionViewerModalContent";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";

export default function SubmissionViewerModal(props) {
  const {
    open,
    onClose,
    action,
    target,
    semesterName,
    projectName,
    noSubmission,
    trigger,
  } = props;
  return (
    <ModalWrapper
      open={props.open}
      onClose={props.onClose}
      closeOnDimmerClick={false}
      closeOnEscape={false}
      className="sticky"
      trigger={<div>{props.trigger}</div>}
      title={`Submission for ${action.action_title} (${target[0]?.toUpperCase()}${target?.substring(1)} Action)`}
      actions={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <SubmissionViewerModalContent
        action={action}
        target={target}
        semesterName={semesterName}
        projectName={projectName}
        noSubmission={noSubmission}
      />
    </ModalWrapper>
  );
}
