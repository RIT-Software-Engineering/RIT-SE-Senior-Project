import { Popup } from "semantic-ui-react";

export function MiniActionTooltip({ trigger, action }) {
  let isDarkMode = document.body.classList.contains("dark-mode");
  let startDate = new Date(action.start_date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });
  let dueDate = new Date(action.due_date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Popup
      trigger={trigger}
      fluid
      content={
        <div>
          <strong>{action.action_title}</strong>
          <br />
          {startDate} - {dueDate}
          <br />
          Click for more details
        </div>
      }
      position="top center"
      on={["hover", "click"]}
      hideOnScroll
      inverted={isDarkMode}
    />
  );
}
