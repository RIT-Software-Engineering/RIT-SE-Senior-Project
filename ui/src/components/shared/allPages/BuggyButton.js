import React, { useState } from "react";

function BuggyButton() {
  const [errorTriggered, setErrorTriggered] = useState(false);

  if (errorTriggered) {
    throw new Error("Button click error!");
  }

  return (
    <button onClick={() => setErrorTriggered(true)}>
      Click me to throw an error
    </button>
  );
}

export default BuggyButton;
