import React from "react";
import ModalWrapper from "../../../../shared/ModalWrapper";
import SubmissionViewerModalContent from "./SubmissionViewerModalContent";
import { Button } from "semantic-ui-react";

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
      open={open}
      onClose={onClose}
      closeOnDimmerClick={false}
      closeOnEscape={false}
      size="large" // Use "large" for peer evaluations
      trigger={trigger && <div>{trigger}</div>}
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
