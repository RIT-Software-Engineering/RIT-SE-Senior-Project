import React, { useState, useEffect, useContext } from 'react'
import { Button, Dropdown, Label } from "semantic-ui-react";
import { config, USERTYPES } from '../functions/constants';
import { SecureFetch } from '../functions/secureFetch';
import { UserContext } from "../functions/UserContext";
import _ from 'lodash';

export default function AdminView() {

  const [selectedUser, setSelectedUser] = useState();
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user.role === USERTYPES.ADMIN) {
      SecureFetch(config.url.API_GET_ACTIVE_USERS)
        .then((response) => response.json())
        .then(users => {
          let userMap = {};
          users.forEach(dbUser => {
            if (dbUser.system_id !== user.user) {
              userMap[dbUser.system_id] = dbUser;
            }
          });
          setUsers(userMap);
        })
        .catch(err => {
          console.error("Failed to fetch users for AdminView...this is probably to be expected", err);
          setUsers([]);
        })
    }
  }, [user])

  const changeView = () => {// changes view for admin to another user

    if (!users[selectedUser]?.system_id) {
      alert("Can't change view - No user selected");
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
    //refresh as new user
    window.location.reload();
  }

  const renderButton = () => {
    if (user?.isMock) {
      return <Button
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
          window.location.reload();
        }}
      />
    }
    return <Button
      primary
      content="Change View"
      onClick={() => {
        changeView();
      }}
    />
  }

  if (user?.isMock || user?.role === "admin") {
    return (
      <>
        <div className={`ui ${user?.isMock ? "warning message" : "info message"}`}>
          Currently signed in as: {user?.fname} {user?.lname} ({user?.user}) who is a "{user.role}"
        </div>
        <Label pointing='right'>To view this page as a different user</Label>
        <Dropdown
          search
          button
          value={selectedUser}
          options={_.sortBy(Object.values(users), ["fname", "lname", "last_login"]).map((user) => { return { text: `${user.fname} ${user.lname} (${user.system_id}) ${user.last_login}`, value: user.system_id, key: user.system_id } })}
          onChange={(e, target) => setSelectedUser(target.value)} />
        {renderButton()}
      </>
    )
  }

  return <></>

}
