import React, { useRef } from 'react'
import { Button, Input, Label, Ref } from "semantic-ui-react";

export default function AdminView() {
  let inputRef = useRef()
  const changeView = () => {// changes view for admin to another user
    //cookie stuff
    document.cookie = `user= ${inputRef.current.children[0].value}`
    //refresh as new user
    window.location.reload()
  }
  return (
    <div>
      <Label pointing='right'>To view this page as a different user</Label>
      <Ref innerRef={inputRef}>
        <Input placeholder='Enter username to view' />
      </Ref>
      <Button
        content="Change View"
        onClick={() => {
          changeView();
        }}
        primary
      />
    </div>
  )
}
//fix this nightmare later
