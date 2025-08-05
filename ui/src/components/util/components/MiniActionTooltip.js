import { Popup } from "semantic-ui-react";

export function MiniActionTooltip({ trigger, action, start, end }) {
  let isDarkMode = document.body.classList.contains("dark-mode");
  return (
    <Popup
      trigger={trigger}
      content={
        <div>
          <strong>{action.action_title}</strong>
          <br />
          {start} - {end}
          <br />
          Click for more details
        </div>
      }
      position="top center"
      on="hover"
      hideOnScroll
      hideOnDocumentClick
      inverted={isDarkMode}
    />
  );
}
