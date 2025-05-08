import React, { useState, useRef } from "react";
import { Button, Divider, Form, Icon, Modal, Table } from "semantic-ui-react";
import CSV from "comma-separated-values";
import { SecureFetch } from "../../../util/functions/secureFetch";
import { config } from "../../../util/functions/constants";

const UPLOAD_BUTTON_TEXT = "Upload";

export default function BatchUserPanel({ callback }) {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInput = useRef();
  const [failedUsers, setFailedUsers] = useState([]);

  const onFileUpload = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (output) => {
      const csv = new CSV(output.target.result, {
        header: true,
        cast: [
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
        ],
      });
      setUsers(csv.parse());
    };
  };

  const uploadBatchUsers = (e) => {
    if (users.length === 0) {
      return;
    }

    let body = new FormData();
    body.append("users", JSON.stringify(users));

    SecureFetch(config.url.API_POST_BATCH_CREATE_USER, {
      method: "post",
      body: body,
    })
      .then((response) => {
        if (response.ok) return response.json();
        return response.json().then((err) => Promise.reject(err));
      })
      .then((response) => {
        if (response.failedUsers.length > 0) {
          setFailedUsers(response.failedUsers.map((f) => f.user.system_id));
          alert("Some users failed to upload.");
        } else {
          setFailedUsers([]);
          alert("Users successfully created!");
          setModalOpen(false);
          setUsers([]);
          callback?.();
        }
      })
      .catch((err) => {
        alert(
          "An unknown error has occurred in the UI: " + JSON.stringify(err),
        );
      });
  };

  const handleCancel = () => {
    setModalOpen(false);
    setUsers([]);
    callback?.();
  };

  const clearData = () => {
    setUsers([]);
    fileInput.current.value = "";
  };

  const generateUsers = () => {
    if (users.length) {
      return (
        <>
          <h5>Users to create:</h5>
          <Button icon labelPosition="left" onClick={clearData}>
            <Icon name="trash" />
            Clear Users
          </Button>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>system_id</Table.HeaderCell>
                <Table.HeaderCell>fname</Table.HeaderCell>
                <Table.HeaderCell>lname</Table.HeaderCell>
                <Table.HeaderCell>email</Table.HeaderCell>
                <Table.HeaderCell>type</Table.HeaderCell>
                <Table.HeaderCell>semester_group</Table.HeaderCell>
                <Table.HeaderCell>active</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user, idx) => {
                const isError = failedUsers.includes(user.system_id);
                return (
                  <Table.Row
                    key={idx}
                    style={
                      isError
                        ? { backgroundColor: "var(--action-bar-proposal-red)" }
                        : {}
                    }
                  >
                    {Object.keys(user).map((key) => (
                      <Table.Cell key={key}>{user[key]}</Table.Cell>
                    ))}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </>
      );
    }
    return <>No users uploaded yet</>;
  };

  let modalContent = (
    <Form>
      <h5>Template User CSV:</h5>
      <Button
        target="_BLANK"
        href={`${config.url.WWW}/UserCreationTemplate.csv`}
      >
        Download Template
      </Button>
      <Button
        target="_BLANK"
        href={`${config.url.WWW}/UserCreationExample.csv`}
      >
        Download Example
      </Button>
      <Divider />
      <h5>Upload files:</h5>
      <input
        ref={fileInput}
        type="file"
        accept=".csv"
        onChange={onFileUpload}
      />
      {generateUsers()}
    </Form>
  );

  return (
    <Modal
      className={"sticky"}
      trigger={<Button icon="upload" />}
      header="Upload users (Untested for large number of users)"
      content={{ content: modalContent, scrolling: true }}
      open={modalOpen}
      closeOnEscape={false}
      closeOnDimmerClick={false}
      onOpen={() => setModalOpen(true)}
      onClose={(event, t) => {
        if (event.target?.innerText !== UPLOAD_BUTTON_TEXT) setModalOpen(false);
      }} // Don't close modal if close was triggered by pressing the upload button
      actions={[
        { key: "Cancel", content: "Cancel", onClick: handleCancel },
        {
          key: UPLOAD_BUTTON_TEXT,
          content: UPLOAD_BUTTON_TEXT,
          onClick: uploadBatchUsers,
          positive: true,
        },
      ]}
    />
  );
}
