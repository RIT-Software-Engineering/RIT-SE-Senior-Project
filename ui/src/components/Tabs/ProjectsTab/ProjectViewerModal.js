import React, { useState } from "react";
import ModalWrapper from "../../shared/ModalWrapper";
import ProjectViewerModalContent from "./ProjectViewerModalContent";
import { Button } from "semantic-ui-react";

export default function ProjectViewerModal(props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    if (props.onClose) props.onClose();
  };

  const triggerElement = props.trigger || (
    <Button icon="eye" onClick={handleOpen} />
  );

  return (
    <ModalWrapper
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      closeOnDimmerClick={false}
      trigger={triggerElement}
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
