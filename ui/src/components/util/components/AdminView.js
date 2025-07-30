import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Button,
  Dropdown,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  DropdownHeader,
  Label,
} from "semantic-ui-react";
import { config, USERTYPES } from "../functions/constants";
import { SecureFetch } from "../functions/secureFetch";
import { UserContext } from "../functions/UserContext";
import _ from "lodash";

export default function AdminView(props) {
  const [selectedUser, setSelectedUser] = useState();
  const [users, setUsers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchCoaches, setSearchCoaches] = useState([]);
  const [searchStudents, setSearchStudents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(UserContext);
  const ref = useRef(null);

  // Helper function to get user status text
  const getUserStatusText = (user) => {
    const isDeactivated = user.active && user.active !== "";
    const isViewOnly = user.view_only === "TRUE";

    if (isDeactivated && isViewOnly) {
      return "(Deactivated, View Only)";
    } else if (isDeactivated) {
      return "(Deactivated)";
    } else if (isViewOnly) {
      return "(View Only)";
    }
    return "";
  };

  useEffect(() => {
    if (user.role === USERTYPES.ADMIN) {
      SecureFetch(config.url.API_GET_ACTIVE_USERS)
        .then((response) => response.json())
        .then((users) => {
          let studentMap = {};
          let coachMap = {};
          let userMap = {};
          users.forEach((dbUser) => {
            if (dbUser.system_id !== user.user && dbUser.type === "coach") {
              coachMap[dbUser.system_id] = dbUser;
              userMap[dbUser.system_id] = dbUser;
            } else if (
              dbUser.system_id !== user.user &&
              dbUser.type === "student"
            ) {
              studentMap[dbUser.system_id] = dbUser;
              userMap[dbUser.system_id] = dbUser;
            }
          });
          setUsers(userMap);
          setCoaches(coachMap);
          setStudents(studentMap);
          setSearchCoaches(coachMap);
          setSearchStudents(studentMap);
        })
        .catch((err) => {
          console.error(
            "Failed to fetch users for AdminView...this is probably to be expected",
            err,
          );
          setUsers([]);
          setCoaches([]);
          setStudents([]);
          setSearchCoaches([]);
          setSearchStudents([]);
        });

      const handleClickOutside = (event) => {
        if (ref && !ref.current.contains(event.target) && isOpen) {
          setIsOpen(false);
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [user, ref, isOpen]);

  const changeView = () => {
    // changes view for admin to another user

    if (!users[selectedUser]?.system_id) {
      alert("Can't change view - No user selected");
      return;
    }
    if (users[selectedUser]?.type === "admin") {
      alert("Can't change view - Admin cannot mock another admin");
      return;
    }

    //cookie stuff
    document.cookie = `mock_system_id=${users[selectedUser].system_id}`;
    document.cookie = `mock_fname=${users[selectedUser].fname}`;
    document.cookie = `mock_lname=${users[selectedUser].lname}`;
    document.cookie = `mock_email=${users[selectedUser].email}`;
    document.cookie = `mock_type=${users[selectedUser].type}`;
    document.cookie = `mock_semester_group=${users[selectedUser].semester_group}`;
    document.cookie = `mock_project=${users[selectedUser].project}`;
    document.cookie = `mock_active=${users[selectedUser].active}`;
    document.cookie = `mock_view_only=${users[selectedUser].view_only}`;
    //refresh as new user
    window.location.reload();
  };

  const renderSignOutButton = () => {
    return (
      <Button
        style={{ float: "right" }}
        secondary
        content="Sign out of mock user"
        onClick={() => {
          document.cookie = `mock_system_id=;max-age=0`;
          document.cookie = `mock_fname=;max-age=0`;
          document.cookie = `mock_lname=;max-age=0`;
          document.cookie = `mock_email=;max-age=0`;
          document.cookie = `mock_type=;max-age=0`;
          document.cookie = `mock_semester_group=;max-age=0`;
          document.cookie = `mock_project=;max-age=0`;
          document.cookie = `mock_active=;max-age=0`;
          document.cookie = `mock_view_only=;max-age=0`;
          window.location.reload();
        }}
      />
    );
  };

  // 196-view-only-admin-role
  //   if ((user?.isMock || user?.role === "admin")) {
  const renderChangeView = () => {
    return (
      <>
        <div style={{ float: "right" }} ref={ref}>
          <Label pointing="right">To view this page as a different user</Label>
          <Dropdown
            onClick={handleOpen}
            floating
            button
            text={
              selectedUser && users[selectedUser]
                ? `${users[selectedUser].fname} ${users[selectedUser].lname} (${selectedUser}) ${getUserStatusText(users[selectedUser])}`
                : selectedUser || "Select User..."
            }
            direction="left"
            open={isOpen}
          >
            {isOpen ? (
              <DropdownMenu>
                <Input
                  icon="search"
                  iconPosition="left"
                  placeholder="Search User..."
                  input={{ onClick: (e) => e.stopPropagation() }}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  autoFocus
                />
                <DropdownDivider />
                <DropdownHeader content="Coaches" />
                <DropdownMenu scrolling>
                  {_.sortBy(Object.values(searchCoaches), [
                    "fname",
                    "lname",
                  ]).map((coach) => {
                    const statusText = getUserStatusText(coach);
                    return (
                      <DropdownItem
                        key={coach.system_id}
                        value={coach.system_id}
                        onClick={(e, target) => handleSelectUser(target.value)}
                      >
                        <div>
                          <div>{`${coach.fname} ${coach.lname} (${coach.system_id})`}</div>
                          {statusText && (
                            <div
                              style={{
                                fontSize: "0.9em",
                                color: "#999",
                                marginTop: "2px",
                              }}
                            >
                              {statusText}
                            </div>
                          )}
                        </div>
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
                <DropdownDivider />
                <DropdownHeader content="Students" />
                <DropdownMenu scrolling>
                  {_.sortBy(Object.values(searchStudents), [
                    "fname",
                    "lname",
                  ]).map((student) => {
                    const statusText = getUserStatusText(student);
                    return (
                      <DropdownItem
                        key={student.system_id}
                        value={student.system_id}
                        onClick={(e, target) => handleSelectUser(target.value)}
                      >
                        <div>
                          <div>{`${student.fname} ${student.lname} (${student.system_id})`}</div>
                          {statusText && (
                            <div
                              style={{
                                fontSize: "0.9em",
                                color: "#999",
                                marginTop: "2px",
                              }}
                            >
                              {statusText}
                            </div>
                          )}
                        </div>
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </DropdownMenu>
            ) : null}
          </Dropdown>
          <Button
            primary
            content="Change View"
            onClick={() => {
              changeView();
            }}
          />
        </div>
      </>
    );
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    handleSearch("");
  };

  const handleSelectUser = (userId) => {
    const selectedUserObj = users[userId];
    setSelectedUser(userId);
    setIsOpen(false);
  };

  const handleSearch = (searchVal) => {
    if (searchVal === "") {
      setSearchCoaches(coaches);
      setSearchStudents(students);
      return;
    }
    setSearchCoaches(
      Object.values(coaches).filter((coach) => {
        if (
          coach.fname.toLowerCase().includes(searchVal.toLowerCase()) ||
          coach.lname.toLowerCase().includes(searchVal.toLowerCase()) ||
          coach.system_id.toLowerCase().includes(searchVal.toLowerCase())
        ) {
          return coach;
        }
        return null;
      }),
    );
    setSearchStudents(
      Object.values(students).filter((student) => {
        if (
          student.fname.toLowerCase().includes(searchVal.toLowerCase()) ||
          student.lname.toLowerCase().includes(searchVal.toLowerCase()) ||
          student.system_id.toLowerCase().includes(searchVal.toLowerCase())
        ) {
          return student;
        }
        return null;
      }),
    );
  };

  if (user?.isMock || user?.role === "admin") {
    if (user?.isMock) {
      return (
        <>
          <div>
            <div className="ui error message" style={{ float: "left" }}>
              Currently mocking: {user?.fname} {user?.lname} ({user?.user}) who
              is a "{user.role}"
            </div>
            {renderSignOutButton()}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <div className="ui positive message" style={{ float: "left" }}>
              Currently signed in as: {user?.fname} {user?.lname} ({user?.user})
              who is a "{user.role}"
            </div>
            {renderChangeView()}
          </div>
        </>
      );
    }
  }
  return <></>;
}
