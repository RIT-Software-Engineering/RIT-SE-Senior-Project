import React, { useEffect, useRef } from "react";
import { Modal } from "semantic-ui-react";

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
}) {
  const modalRef = useRef(null);

  // Scroll entire modal to top when it opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        const modalElement = document.querySelector(".ui.modal.visible");
        if (modalElement) {
          const contentElement = modalElement.querySelector(".content");
          if (contentElement) {
            contentElement.scrollTop = 0;
          }
        }
      }, 100);
    }
  }, [open]);

  return (
    <Modal
      ref={modalRef}
      open={open}
      onClose={onClose}
      size={size}
      closeOnDimmerClick={closeOnDimmerClick}
      closeOnEscape={closeOnEscape}
      closeIcon={closeIcon}
      className={className}
      trigger={trigger}
      dimmer="blurring"
      centered={false}
      style={{
        position: "fixed",
        top: "5vh",
        left: "50%",
        transform: "translateX(-50%)",
        maxHeight: "90vh",
        margin: 0,
      }}
    >
      {title && <Modal.Header>{title}</Modal.Header>}
      <Modal.Content scrolling style={{ maxHeight: "calc(90vh - 10em)" }}>
        {children}
      </Modal.Content>
      {actions && (
        <Modal.Actions>{actions.map((action) => action)}</Modal.Actions>
      )}
    </Modal>
  );
}
