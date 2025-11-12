import React, { useEffect, useCallback } from "react";
import { Modal } from "semantic-ui-react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function ModalWrapper({
  open,
  onClose,
  title,
  size = "small",
  closeOnDimmerClick = false,
  closeOnEscape = true,
  closeIcon = true,
  className = "",
  trigger,
  actions,
  children,
  confirmOnClose = false, // 🧩 confirm close behavior
  hasUnsavedChanges = false, // 🧩 track unsaved form edits
}) {
  useEffect(() => {
    const body = document.body;
    if (open) {
      const originalOverflow = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  const handleClose = useCallback(() => {
    if (confirmOnClose && hasUnsavedChanges) {
      confirmAlert({
        title: "Unsaved Changes",
        message:
          "You have unsaved work. Are you sure you want to close without saving?",
        buttons: [
          {
            label: "Keep Working",
            onClick: () => {}, // stay open
          },
          {
            label: "Discard Changes",
            onClick: () => {
              if (onClose) onClose();
            },
          },
        ],
        overlayClassName: "custom-confirm-overlay",
      });
    } else {
      onClose && onClose();
    }
  }, [onClose, confirmOnClose, hasUnsavedChanges]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size={size}
      closeOnDimmerClick={closeOnDimmerClick}
      closeOnEscape={closeOnEscape}
      closeIcon={closeIcon}
      className={`${className} your-custom-modal semantic-centered-modal`}
      trigger={trigger}
      dimmer="blurring"
      centered={false}
      scrolling={false}
    >
      {title && <Modal.Header>{title}</Modal.Header>}
      <Modal.Content>{children}</Modal.Content>
      {actions && <Modal.Actions>{actions.map((a) => a)}</Modal.Actions>}
    </Modal>
  );
}
