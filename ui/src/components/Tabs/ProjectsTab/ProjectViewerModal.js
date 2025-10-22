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

  const handleOpen = (e) => {
    // Crucial change: Stop propagation here to prevent clicks (especially in a table row)
    // from triggering a parent element's action.
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setOpen(true);
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
