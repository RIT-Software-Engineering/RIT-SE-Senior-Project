import React, { useEffect, useState } from "react";
import { Modal, Button } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";

const ProfileModal = ({ open, onClose, user }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (user?.system_id) {
      SecureFetch(config.url.API_GET_DARK_MODE+`?system_id=${user.system_id}`)
        .then((res) => res.json())
        .then((data) => {
          const isDark = data.dark_mode === true;
          setDarkMode(isDark);
          document.body.classList.toggle("dark-mode", isDark);
        })
        .catch((err) => console.error("Failed to fetch dark mode:", err));
    }
  }, [user]);

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
  
    try {
      const res = await SecureFetch(config.url.API_POST_SET_DARK_MODE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: user.system_id,
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
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      header={`Hi, ${user.fname}!`}
      content={
        <div>
          <p>Toggle Dark Mode:</p>
          <Button toggle active={darkMode} onClick={toggleDarkMode}>
            {darkMode ? "Dark Mode On" : "Dark Mode Off"}
          </Button>
        </div>
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
