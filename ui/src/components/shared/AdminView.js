import React, { useState, useEffect } from 'react'
import { Button, Dropdown, Label } from "semantic-ui-react";
import { config } from '../util/constants';
import { SecureFetch } from '../util/secureFetch';
import _ from 'lodash';

export default function AdminView(props) {

  const [selectedUser, setSelectedUser] = useState();
  const [users, setUsers] = useState([])

  useEffect(() => {
    SecureFetch(config.url.API_GET_ACTIVE_USERS)
      .then((response) => response.json())
      .then(users => {
        let userMap = {};
        users.forEach(user => {
          userMap[user.system_id] = user;
        });
        setUsers(userMap);
      })
      .catch(err => {
        console.error("Failed to fetch users for AdminView...this is probably to be expected", err);
        setUsers([]);
      })
  }, [])

  const changeView = () => {// changes view for admin to another user

    if (!users[selectedUser]?.system_id) {
      alert("Can't change view - No user selected");
      return;
    }

    //cookie stuff
    document.cookie = `mockUser=${users[selectedUser].system_id}`;
    document.cookie = `mockType=${users[selectedUser].type}`;
    //refresh as new user
    window.location.reload();
  }

  const renderButton = () => {
    if (props.user?.isMock) {
      return <Button
        secondary
        content="Sign out of mock user"
        onClick={() => {
          document.cookie = `mockUser=;max-age=0`;
          document.cookie = `mockType=;max-age=0`;
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

  if (props.user?.isMock || props.user?.role === "admin") {
    return (
      <>
        <h4 style={props.user?.isMock && { backgroundColor: 'red' }}>Currently signed in as: "{props.user?.user}" who is a "{props.user.role}"</h4>
        <Label pointing='right'>To view this page as a different user</Label>
        <Dropdown
          search
          button
          value={selectedUser}
          options={_.sortBy(Object.values(users), ["fname", "lname"]).map((user) => { return { text: `${user.fname} ${user.lname} (${user.system_id})`, value: user.system_id, key: user.system_id } })}
          onChange={(e, target) => setSelectedUser(target.value)} />
        {renderButton()}
      </>
    )
  }

  return <></>

}
