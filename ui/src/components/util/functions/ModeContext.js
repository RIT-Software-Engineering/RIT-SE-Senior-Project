import React, { createContext, useState } from "react";

export const ModeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
});

export function ModeContextProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <ModeContext.Provider value={{ darkMode, setDarkMode: toggleDarkMode }}>
      {children}
    </ModeContext.Provider>
  );
}
