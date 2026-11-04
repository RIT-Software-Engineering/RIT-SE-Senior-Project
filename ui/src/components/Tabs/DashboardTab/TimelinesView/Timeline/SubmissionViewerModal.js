import React, { useState } from "react";
import ModalWrapper from "../../../../shared/ModalWrapper";
import SubmissionViewerModalContent from "./SubmissionViewerModalContent";
import { Button } from "semantic-ui-react";

export default function SubmissionViewerModal(props) {
  const [open, setOpen] = useState(false);
  const { action, target, semesterName, projectName, noSubmission, trigger } =
    props;

  return (
    <ModalWrapper
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      closeOnDimmerClick={false}
      closeOnEscape={false}
      size="large" // for peer evaluations
      trigger={trigger && <div onClick={() => setOpen(true)}> {trigger} </div>}
      title={`Submission for ${action.action_title} (${target[0]?.toUpperCase()}${target?.substring(1)} Action)`}
      actions={[
        <Button key="close" onClick={() => setOpen(false)}>
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
