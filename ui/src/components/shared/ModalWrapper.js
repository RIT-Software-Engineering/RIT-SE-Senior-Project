import React from "react";
import { Modal } from "semantic-ui-react";

/**
 * A reusable modal wrapper component.
 */
export default function ModalWrapper({
  open,
  onClose,
  size = "small",
  children,
}) {
  return (
    <Modal open={open} onClose={onClose} size={size} closeIcon>
      {children}
    </Modal>
  );
}
