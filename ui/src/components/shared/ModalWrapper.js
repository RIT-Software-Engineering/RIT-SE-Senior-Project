import React from "react";
import { Modal } from "semantic-ui-react";

/**
 * A reusable modal wrapper component.
 */
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
  return (
    <Modal
      open={open}
      onClose={onClose}
      size={size}
      closeOnDimmerClick={closeOnDimmerClick}
      closeOnEscape={closeOnEscape}
      closeIcon={closeIcon}
      className={className}
      trigger={trigger}
    >
      {title && <Modal.Header>{title}</Modal.Header>}
      <Modal.Content>{children}</Modal.Content>
      {actions && <Modal.Actions>{actions}</Modal.Actions>}
    </Modal>
  );
}
