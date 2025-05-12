import React, { useEffect, useState } from "react";
import { Modal, Button } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config, USERTYPES } from "../../util/functions/constants";
import { useSessionStorage } from "../../util/functions/utils";

const ProfileModal = ({ open, onClose, user }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [preference, setPreference] = useSessionStorage(
    "displayPreference",
    "gantt",
  );
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (open && user?.user) {
      SecureFetch(config.url.API_GET_DARK_MODE + `?system_id=${user.user}`)
        .then((res) => res.json())
        .then((data) => {
          const isDark = ["1", 1, true, "true"].includes(data.dark_mode);
          setDarkMode(isDark);
        })
        .catch((err) => console.error("Failed to fetch dark mode:", err));

      SecureFetch(config.url.API_GET_GANTT_VIEW + `?system_id=${user.user}`)
        .then((res) => res.json())
        .then((data) => {
          const gantt = ["1", 1, true, "true"].includes(data.gantt_view);
          setPreference(gantt);
          sessionStorage.setItem("ganttView", gantt);
        })
        .catch((err) => console.error("Failed to fetch gantt view:", err));

      SecureFetch(
        config.url.API_GET_ADDITIONAL_INFO + `?system_id=${user.user}`,
      )
        .then((res) => res.json())
        .then((data) => setAdditionalInfo(data?.additional_info || ""))
        .catch((err) => console.error("Failed to fetch additional info:", err));
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

  const handleSaveAdditionalInfo = async () => {
    try {
      const url = `${config.url.API_POST_EDIT_ADDITIONAL_INFO}`;

      const response = await SecureFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_id: user.user,
          additional_info: additionalInfo,
        }),
      });

      if (!response.ok) throw new Error("Failed to update additional info");

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating additional info:", error);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnDimmerClick={false}
      size="small"
      centered={false}
      style={{
        position: "sticky",
        top: "20%",
        left: "0%",
      }}
    >
      <Modal.Header>Hi, {user.fname}!</Modal.Header>
      <Modal.Content>
        {/* --- User Info --- */}
        <div style={{ marginBottom: "2em" }}>
          <p>
            <strong>Name:</strong> {user.fname} {user.lname}
          </p>
          <p>
            <strong>Username:</strong> {user.user}
          </p>
          <p>
            <strong>Last Login:</strong>{" "}
            {user.last_login
              ? new Date(user.last_login).toLocaleString()
              : "Never Logged In"}
          </p>
        </div>

        {/* --- Additional Info (Students Only) --- */}
        {user.role === USERTYPES.STUDENT && (
          <div style={{ marginBottom: "2em" }}>
            <strong>Additional Info:</strong>
            {isEditing ? (
              <>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={4}
                  style={{ width: "100%" }}
                />
                <Button
                  onClick={handleSaveAdditionalInfo}
                  primary
                  size="small"
                  style={{ marginTop: "0.5em" }}
                >
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  size="small"
                  style={{ marginLeft: "0.5em", marginTop: "0.5em" }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span style={{ marginLeft: "0.5em" }}>
                  {additionalInfo || "No additional info available"}
                </span>
                <Button
                  onClick={() => setIsEditing(true)}
                  size="small"
                  style={{ marginLeft: "0.5em" }}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        )}

        {/* --- Preferences Section --- */}
        <div style={{ borderTop: "1px solid #ccc", paddingTop: "1em" }}>
          <h4 style={{ marginBottom: "1em" }}>Preferences:</h4>

          <div style={{ marginBottom: "1em" }}>
            <p>
              <strong>Dark Mode:</strong>
            </p>
            <Button toggle active={darkMode} onClick={toggleDarkMode}>
              {darkMode ? "Dark Mode On" : "Dark Mode Off"}
            </Button>
          </div>

          <div>
            <p>
              <strong>Gantt or Calendar View:</strong>
            </p>
            <Button toggle active={preference} onClick={toggleGanttView}>
              {preference ? "Viewing Calendar" : "Viewing Gantt"}
            </Button>
          </div>
        </div>
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ProfileModal;
