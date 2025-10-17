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

  // Scroll the modal content to top when it opens
  useEffect(() => {
    // If you apply scrolling to the Modal.Content, use modalRef.current for content
    // If you apply scrolling to the Modal component, you'll need a different ref strategy
    if (open) {
      // Wait a small delay to ensure the content is rendered and positioned
      setTimeout(() => {
        const modalElement = document.querySelector(".ui.modal.visible");
        // Check if SUI applied the .scrolling class and scroll that element
        const scrollingContent = modalElement?.querySelector(".content");

        if (scrollingContent) {
          scrollingContent.scrollTop = 0;
        } else if (modalElement) {
          // Fallback for non-scrolling content
          modalElement.scrollTop = 0;
        }
      }, 100);
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
      className={`${className} your-custom-modal`} // Add a custom class if needed
      trigger={trigger}
      dimmer="blurring"
      centered={false}
      // Use Semantic UI's 'scrolling' prop on the modal to apply the vertical scrollbar
      // to the content section, *excluding* the header and actions.
      // This is the standard SUI approach for tall modals.
    >
      {title && <Modal.Header>{title}</Modal.Header>}

      {/* Apply the SUI 'scrolling' prop to the Content, and let SUI handle the internal overflow.
        We'll remove the custom style props for max-height/overflow from the main Modal tag.
      */}
      <Modal.Content scrolling>{children}</Modal.Content>

      {actions && (
        <Modal.Actions>{actions.map((action) => action)}</Modal.Actions>
      )}
    </Modal>
  );
}
