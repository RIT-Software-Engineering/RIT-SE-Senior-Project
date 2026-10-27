import React, { useEffect, useState, useRef, useCallback } from "react";
import { Modal, Button, Checkbox } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config, USERTYPES } from "../../util/functions/constants";
import { useSessionStorage, formatDateTime } from "../../util/functions/utils";
import ProfileCircle from "../../util/components/ProfileCircle";
import "./../../../css/components/shared/profileModal.css";

const EMPTY_CONTACT = { method: "email", label: "", value: "" };
const ProfileModal = ({ open, onClose, user, darkModeCallback }) => {
  console.log("ProfileModal user:", user);
  const [darkMode, setDarkMode] = useState(false);
  const [contact, setContact] = useState(null);
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
  const [preferredContact, setPreferredContact] = useState(EMPTY_CONTACT);
  const [originalPreferredContact, setOriginalPreferredContact] =
    useState(EMPTY_CONTACT);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const hasFetchedData = useRef(false);

  const loadAdditionalInfo = useCallback(() => {
    if (!user?.user) return;
    SecureFetch(config.url.API_GET_ADDITIONAL_INFO + `?system_id=${user.user}`)
      .then((res) => res.json())
      .then((data) => {
        const info = data?.additional_info || "";
        setAdditionalInfo(info);
        setOriginalAdditionalInfo(info);

        const pc = { ...EMPTY_CONTACT, ...(data?.preferred_contact || {}) };
        setPreferredContact(pc);
        setOriginalPreferredContact(pc);

        setContact(data?.contact || null);
      })
      .catch((err) => console.error("Failed to fetch additional info:", err));
  }, [user?.user]);

  useEffect(() => {
    if (open && user?.user && !hasFetchedData.current) {
      hasFetchedData.current = true;
      SecureFetch(config.url.API_GET_DARK_MODE + `?system_id=${user.user}`)
        .then((res) => res.json())
        .then((data) => {
          const isDark = ["1", 1, true, "true"].includes(data.dark_mode);
          setDarkMode(isDark);
        })
        .catch((err) => console.error("Failed to fetch dark mode:", err)); // Load user-specific view preferences from the backend
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

      loadAdditionalInfo();
    }

    // Reset flag when modal closes
    if (!open) {
      hasFetchedData.current = false;
    }
  }, [open, user, loadAdditionalInfo]);

  // Focus text area when entering edit mode
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
          preferred_contact: preferredContact,
        }),
      });

      if (!response.ok) throw new Error("Failed to update additional info");

      loadAdditionalInfo();
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
      onClose={handleClose}
      closeOnDimmerClick={false}
      closeIcon={true}
      size="small"
      centered={false}
      className="semantic-centered-modal"
    >
      <Modal.Header>Your Profile</Modal.Header>
      <Modal.Content>
        <div className="ui container">
          <div style={{ display: "flex", flexWrap: "nowrap" }}>
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
                  className="profile-marginbottom1"
                />
              </div>
              {/* User Info */}
              <div className="profile-marginbottom2">
                <div>
                  <strong>Name:</strong> {user.fname} {user.lname}
                </div>
                <div>
                  <strong>Username:</strong> {user.user}
                </div>
                <div>
                  <strong>Last Login:</strong>{" "}
                  {user.last_login
                    ? formatDateTime(user.last_login)
                    : "Never Logged In"}
                </div>
              </div>

              {[USERTYPES.STUDENT, USERTYPES.COACH].includes(user.role) && (
                <div className="profile-contact-fields">
                  <strong>Additional Info:</strong>
                  {isEditing ? (
                    <>
                      <textarea
                        ref={textareaRef}
                        value={additionalInfo}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          console.log("Textarea onChange:", newValue);
                          console.log(
                            "Current additionalInfo state:",
                            additionalInfo,
                          );
                          setAdditionalInfo(newValue);
                        }}
                        rows={4}
                        className="profile-text"
                        placeholder="Enter additional information..."
                      />
                      <div className="contact">
                        <strong>Preferred Contact:</strong>
                        <select
                          className="dropdown"
                          value={preferredContact.method}
                          onChange={(e) =>
                            setPreferredContact({
                              method: e.target.value,
                              label: "",
                              value: "",
                            })
                          }
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="other">Other</option>
                        </select>

                        {preferredContact.method === "phone" && (
                          <input
                            className="profile-text-small"
                            maxLength={30}
                            placeholder="Phone number"
                            value={preferredContact.value}
                            onChange={(e) =>
                              setPreferredContact({
                                ...preferredContact,
                                value: e.target.value,
                              })
                            }
                          />
                        )}

                        {preferredContact.method === "other" && (
                          <>
                            <input
                              className="profile-text-small"
                              maxLength={30}
                              placeholder="Platform (Discord, Slack, etc.)"
                              value={preferredContact.label}
                              onChange={(e) =>
                                setPreferredContact({
                                  ...preferredContact,
                                  label: e.target.value,
                                })
                              }
                            />
                            <input
                              className="profile-text-small"
                              maxLength={100}
                              placeholder="Contact info"
                              value={preferredContact.value}
                              onChange={(e) =>
                                setPreferredContact({
                                  ...preferredContact,
                                  value: e.target.value,
                                })
                              }
                            />
                          </>
                        )}
                      </div>
                      <div className="profile-buttons">
                        <Button
                          onClick={handleSaveAdditionalInfo}
                          primary
                          size="small"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setAdditionalInfo(originalAdditionalInfo);
                            setPreferredContact(originalPreferredContact);
                            setIsEditing(false);
                          }}
                          size="small"
                          className="profile-cancel"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="profile-edit">
                        {additionalInfo || "No additional info available"}
                      </span>
                      <div>
                        <strong>Preferred Contact:</strong>
                        <div className="profile-contact-value">
                          {contact
                            ? `${contact.label}: ${contact.value}`
                            : "Not set"}
                        </div>
                      </div>

                      <Button
                        onClick={() => setIsEditing(true)}
                        size="small"
                        className="profile-edit"
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
                <h3 className="profile-marginbottom1">Preferences</h3>
                <div className="profile-preference">
                  <strong className="profile-dark">Dark Mode</strong>
                  <Checkbox
                    toggle
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                </div>
              </div>

              {/* Dashboard Defaults Section */}
              <div className="profile-dash">
                <h3 className="profile-marginbottom1">Dashboard Defaults</h3>
                <div className="profile-preference">
                  <strong className="profile-dark">Milestones View</strong>
                  <Checkbox
                    toggle
                    checked={milestonePreference}
                    onChange={toggleMilestonePreference}
                  />
                </div>
                <div className="profile-preference">
                  <strong className="profile-dark">Gantt View</strong>
                  <Checkbox
                    toggle
                    checked={ganttPreference}
                    onChange={toggleGanttPreference}
                  />
                </div>
                <div className="profile-calendar">
                  <strong className="profile-dark">Calendar View</strong>
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
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ProfileModal;
