import React, { useEffect, useState, useRef } from "react";
import { Button, Checkbox, Divider } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config, USERTYPES } from "../../util/functions/constants";
import { useSessionStorage } from "../../util/functions/utils";
import ProfileCircle from "../../util/components/ProfileCircle";

export default function ProfileModalContent({
  user,
  darkModeCallback,
  onClose,
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [milestonePreference, setMilestonePreference] = useSessionStorage(
    "defaultMilestoneView",
    true,
  );
  const [ganttPreference, setGanttPreference] = useSessionStorage(
    "defaultGanttView",
    true,
  );
  const [calendarPreference, setCalendarPreference] = useSessionStorage(
    "defaultCalendarView",
    false,
  );
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [originalAdditionalInfo, setOriginalAdditionalInfo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (user?.user && !hasFetchedData.current) {
      hasFetchedData.current = true;

      // Fetch dark mode
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
          const ganttPref = data.gantt_view === true;
          setGanttPreference(ganttPref);
          sessionStorage.setItem("defaultGanttView", ganttPref.toString());
        })
        .catch((err) => console.error("Failed to fetch gantt view:", err));

      SecureFetch(config.url.API_GET_CALENDAR_VIEW + `?system_id=${user.user}`)
        .then((res) => res.json())
        .then((data) => {
          const calendarPref = data.calendar_view === true;
          setCalendarPreference(calendarPref);
          sessionStorage.setItem(
            "defaultCalendarView",
            calendarPref.toString(),
          );
        })
        .catch((err) => console.error("Failed to fetch calendar view:", err));

      SecureFetch(config.url.API_GET_MILESTONE_VIEW + `?system_id=${user.user}`)
        .then((res) => res.json())
        .then((data) => {
          const milestonePref = data.milestone_view === true;
          setMilestonePreference(milestonePref);
          sessionStorage.setItem(
            "defaultMilestoneView",
            milestonePref.toString(),
          );
        })
        .catch((err) => console.error("Failed to fetch milestone view:", err));

      SecureFetch(
        config.url.API_GET_ADDITIONAL_INFO + `?system_id=${user.user}`,
      )
        .then((res) => res.json())
        .then((data) => {
          const info = data?.additional_info || "";
          setAdditionalInfo(info);
          setOriginalAdditionalInfo(info);
        })
        .catch((err) => console.error("Failed to fetch additional info:", err));
    }

    return () => {
      hasFetchedData.current = false;
    };
  }, [user, setMilestonePreference, setGanttPreference, setCalendarPreference]);

  // Focus on the text area when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

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
      darkModeCallback(newDarkMode);
      document.body.classList.toggle("dark-mode", newDarkMode);
    } catch (err) {
      console.error("Error updating dark mode:", err);
    }
  };

  // toggle milestone preference
  const toggleMilestonePreference = async () => {
    const newPreference = !milestonePreference;

    try {
      const res = await SecureFetch(config.url.API_POST_SET_MILESTONE_VIEW, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: user.user,
          milestone_view: newPreference,
        }),
      });

      if (!res.ok)
        throw new Error("Failed to update milestone view preference");

      setMilestonePreference(newPreference);
      sessionStorage.setItem("defaultMilestoneView", newPreference.toString());
    } catch (err) {
      console.error("Error updating milestone view:", err);
    }
  };

  // toggle gantt perference
  const toggleGanttPreference = async () => {
    const newPreference = !ganttPreference;

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

      setGanttPreference(newPreference);
      sessionStorage.setItem("defaultGanttView", newPreference.toString());
    } catch (err) {
      console.error("Error updating gantt view:", err);
    }
  };

  const toggleCalendarPreference = async () => {
    const newPreference = !calendarPreference;

    try {
      const res = await SecureFetch(config.url.API_POST_SET_CALENDAR_VIEW, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: user.user,
          calendar_view: newPreference,
        }),
      });

      if (!res.ok) throw new Error("Failed to update calendar view preference");

      setCalendarPreference(newPreference);
      sessionStorage.setItem("defaultCalendarView", newPreference.toString());
    } catch (err) {
      console.error("Error updating calendar view:", err);
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

      setOriginalAdditionalInfo(additionalInfo);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating additional info:", error);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  // render
  return (
    <div>
      <div className="ui grid container">
        <div
          className="two column row"
          style={{ display: "flex", flexWrap: "nowrap" }}
        >
          <div className="column" style={{ flex: "1", minWidth: "250px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.5em",
              }}
            >
              <ProfileCircle
                user={user}
                size="huge"
                style={{ marginBottom: "1em" }}
              />
            </div>

            {/* User Info */}
            <div style={{ marginBottom: "2em" }}>
              <div>
                <strong>Name:</strong> {user.fname} {user.lname}
              </div>
              <div>
                <strong>Username:</strong> {user.user}
              </div>
              <div>
                <strong>Last Login:</strong>{" "}
                {user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : "Never Logged In"}
              </div>
            </div>

            {/* Additional Info (Students Only) */}
            {user.role === USERTYPES.STUDENT && (
              <div style={{ marginBottom: "2em" }}>
                <strong>Additional Info:</strong>
                {isEditing ? (
                  <>
                    <textarea
                      ref={textareaRef}
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={4}
                      style={{ width: "100%" }}
                      placeholder="Enter additional information..."
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
                      onClick={() => {
                        setAdditionalInfo(originalAdditionalInfo);
                        setIsEditing(false);
                      }}
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
          </div>

          <div className="column" style={{ flex: "1", minWidth: "300px" }}>
            {/* Preferences Section */}
            <div>
              <h3 style={{ marginBottom: "1em" }}>Preferences</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.8em",
                }}
              >
                <strong style={{ minWidth: "200px", marginRight: "1em" }}>
                  Dark Mode
                </strong>
                <Checkbox toggle checked={darkMode} onChange={toggleDarkMode} />
              </div>
            </div>

            {/* Dashboard Defaults Section */}
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "1em" }}>Dashboard Defaults</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.8em",
                }}
              >
                <strong style={{ minWidth: "200px", marginRight: "1em" }}>
                  Milestones View
                </strong>
                <Checkbox
                  toggle
                  checked={milestonePreference}
                  onChange={toggleMilestonePreference}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.8em",
                }}
              >
                <strong style={{ minWidth: "200px", marginRight: "1em" }}>
                  Gantt View
                </strong>
                <Checkbox
                  toggle
                  checked={ganttPreference}
                  onChange={toggleGanttPreference}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong style={{ minWidth: "200px", marginRight: "1em" }}>
                  Calendar View
                </strong>
                <Checkbox
                  toggle
                  checked={calendarPreference}
                  onChange={toggleCalendarPreference}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div style={{ textAlign: "right" }}>
        <Button onClick={handleClose}>Close</Button>
      </div>
    </div>
  );
}
