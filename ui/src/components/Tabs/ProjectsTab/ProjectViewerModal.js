import React, { useState } from "react";
import ModalWrapper from "../../shared/ModalWrapper";
import ProjectViewerModalContent from "./ProjectViewerModalContent";
import { Button } from "semantic-ui-react";

export default function ProjectViewerModal(props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    if (props.onClose) props.onClose();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <ModalWrapper
      open={open}
      onClose={handleClose}
      closeOnDimmerClick={false}
      trigger={
        <div onClick={handleOpen}>{props.trigger || <Button icon="eye" />}</div>
      }
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
