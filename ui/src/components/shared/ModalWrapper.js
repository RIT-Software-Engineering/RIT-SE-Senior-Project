import React, { useEffect } from "react";
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
  useEffect(() => {
    const body = document.body;

    if (open) {
      // Backup original overflow
      const originalOverflow = body.style.overflow;

      // Allow page scrolling
      // body.style.overflow = "auto";
      body.style.overflow = "hidden";
      // Wait for SUI to render modal, then adjust it
      setTimeout(() => {
        const modalEl = document.querySelector(".ui.modal.transition.visible");
        if (modalEl) {
          modalEl.style.position = "absolute";
          modalEl.style.top = "40px";
          modalEl.style.left = "50%";
          modalEl.style.transform = "translateX(-50%)";
          modalEl.style.maxHeight = "none";
          modalEl.style.overflow = "visible";
        }
      }, 60);

      // Restore overflow when modal closes
      return () => {
        body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size={size}
      closeOnDimmerClick={closeOnDimmerClick}
      closeOnEscape={closeOnEscape}
      closeIcon={closeIcon}
      className={`${className} your-custom-modal`}
      trigger={trigger}
      dimmer="blurring"
      centered={false}
    >
      {title && <Modal.Header>{title}</Modal.Header>}

      <Modal.Content>{children}</Modal.Content>

      {actions && <Modal.Actions>{actions.map((a) => a)}</Modal.Actions>}
    </Modal>
  );
}
