import React, { useState, useEffect } from 'react'
import { Button, Dropdown, Label } from "semantic-ui-react";
import { config } from '../util/constants';
import { SecureFetch } from '../util/secureFetch';

export default function AdminView(props) {

  const [selectedUser, setSelectedUser] = useState();
  const [users, setUsers] = useState([])

  useEffect(() => {
    SecureFetch(config.url.API_GET_ACTIVE_USERS)
      .then((response) => response.json())
      .then(users => {
        setUsers(users.map(user => {
          return { text: `${user.fname} ${user.lname} (${user.system_id})`, value: { system_id: user.system_id, type: user.type }, key: user.system_id }
        }))
      })
    return () => {
    }
  }, [])

  const changeView = () => {// changes view for admin to another user

    if (!selectedUser?.system_id) {
      alert("Can't change view - No user selected");
      return;
    }

    //cookie stuff
    document.cookie = `mockUser=${selectedUser.system_id}`;
    document.cookie = `mockType=${selectedUser.type}`;
    //refresh as new user
    window.location.reload();
  }

  if (props.user?.isMock || props.user?.role === "admin") {
    return (
      <div>
        <h4 style={props.user?.isMock && { backgroundColor: 'red' }}>Currently signed in as: "{props.user?.user}" who is a "{props.user.role}"</h4>
        <Label pointing='right'>To view this page as a different user</Label>
        <Dropdown button options={users} onChange={(e, target) => setSelectedUser(target.value)} />
        {props.user?.isMock ? <Button
          secondary
          content="Sign out of mock user"
          onClick={() => {
            document.cookie = `mockUser=;max-age=0`;
            document.cookie = `mockType=;max-age=0`;
            window.location.reload();
          }}
        /> : <Button
          primary
          content="Change View"
          onClick={() => {
            changeView();
          }}
        />}
      </div>
    )
  }

  return <></>

}
