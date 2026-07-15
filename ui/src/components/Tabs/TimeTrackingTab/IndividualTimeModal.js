import React, { useContext, useState } from "react";

import { Button, Icon } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import { UserContext } from "../../util/functions/UserContext";
import { config } from "../../util/functions/constants";
import ModalWrapper from "../../shared/ModalWrapper";
import IndividualTimeModalContent from "./IndividualTimeModalContent";

export default function IndividualTimeModal(props) {
  const [open, setOpen] = useState(false);
  const { user: currentUser } = useContext(UserContext);

  const handleDelete = function (id) {
    //used to be e
    let body = new FormData();
    body.append("id", id);

    SecureFetch(config.url.API_DELETE_TIME_LOG, {
      method: "POST",
      body: body,
    })
      .catch(() => {
        alert("There was an error deleting the time log.");
      })
      .finally(() => {
        props.resetKey();
        onClose();
      });
  };

  const deleteButton =
    props.userId === currentUser.user &&
    props.delete === 1 &&
    !currentUser.view_only &&
    currentUser.mockUser.view_only !== "TRUE" ? (
      <Button
        content="Delete"
        labelPosition="right"
        icon="x"
        negative
        onClick={() => handleDelete(props.id)}
      />
    ) : null;

  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  return (
    <ModalWrapper
      closeOnDimmerClick={false}
      open={open}
      onClose={onClose}
      trigger={
        <div onClick={onOpen}>
          {props.trigger || (
            <Button icon>
              <Icon name="eye" />
            </Button>
          )}
        </div>
      }
      title={`Time Submission For ${props.user}`}
    >
      <IndividualTimeModalContent
        timeLog={props.timeLog}
        semesterName={props.semesterName}
        projectName={props.projectName}
        user={props.user}
        userId={props.userId}
        deleteButton={deleteButton}
        onClose={onClose}
      />
    </ModalWrapper>
  );
}
