import React, { useEffect, useState } from "react";
import { Modal, Button } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";
import { useSessionStorage } from "../../util/functions/utils";

const ProfileModal = ({ open, onClose, user }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [preference, setPreference] = useSessionStorage('displayPreference', 'gantt');

  

  useEffect(() => {
    if (open && user?.user) {
      SecureFetch(config.url.API_GET_DARK_MODE + `?system_id=${user.user}`)
        .then((res) => res.json())
        .then((data) => {
          const isDark = ['1', 1, true, 'true'].includes(data.dark_mode);
          setDarkMode(isDark);
        })
        .catch((err) => console.error("Failed to fetch dark mode:", err));
  
      SecureFetch(config.url.API_GET_GANTT_VIEW + `?system_id=${user.user}`)
        .then((res) => res.json())
        .then((data) => {
          const gantt = ['1', 1, true, 'true'].includes(data.gantt_view);
          setPreference(gantt);
          sessionStorage.setItem("ganttView", gantt);
        })
        .catch((err) => console.error("Failed to fetch gantt view:", err));
    }
  }, [open, user]);
  

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
  
    try {
      const res = await SecureFetch(config.url.API_POST_SET_DARK_MODE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: user.user,
          dark_mode: newDarkMode,
        }),
      });
  
      if (!res.ok) throw new Error("Failed to update dark mode preference");
  
      setDarkMode(newDarkMode);
      document.body.classList.toggle("dark-mode", newDarkMode);
    } catch (err) {
      console.error("Error updating dark mode:", err);
    }
  };

  const toggleGanttView = async () => {
    const newPreference = !preference;
  
    try {
      const res = await SecureFetch(config.url.API_POST_SET_GANTT_VIEW, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: user.user,
          gantt_view: newPreference,
        }),
      });
  
      if (!res.ok) throw new Error("Failed to update gantt view preference");
  
      setPreference(newPreference);
      sessionStorage.setItem("ganttView", newPreference);
    } catch (err) {
      console.error("Error updating gantt view:", err);
    }
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      header={`Hi, ${user.fname}!`}
      content={
        <>
          <div>
            <p>Toggle Dark Mode:</p>
            <Button toggle active={darkMode} onClick={toggleDarkMode}>
              {darkMode ? "Dark Mode On" : "Dark Mode Off"}
            </Button>
          </div>
          <div>
            <p>Gantt or Calendar View:</p>
            <Button toggle active={preference} onClick={toggleGanttView}>
              {preference ? "Viewing Calendar" : "Viewing Gantt"}
            </Button>
          </div>
        </>
      }
      actions={[
        {
          key: "close",
          content: "Close",
          onClick: onClose,
        },
      ]}
    />
  );
};

export default ProfileModal;
