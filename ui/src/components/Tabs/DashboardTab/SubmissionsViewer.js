import React, { useContext, useState } from "react";

import {
  Button,
  Divider,
  Icon,
  Label,
  Modal,
  ModalActions,
  Segment,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { formatDate, formatDateTime } from "../../util/functions/utils";
import { SecureFetch } from "../../util/functions/secureFetch";
import InnerHTML from "dangerously-set-html-content";
import { UserContext } from "../../util/functions/UserContext";
import { config } from "../../util/functions/constants";

const { isSameWeek, addDays } = require("date-fns");

export default function SubmissionsViewer(props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const onClose = (page) => {
    setOpen(false);
  };

  const getTotalTime = (week, name) => {
    let filteredTimeLogs = props.timeLog
      // Is not deleted
      .filter((timeLog) => timeLog.active !== 0)
      // Is from User
      .filter((timeLog) => name === timeLog.name)
      // Is in week range
      .filter((timeLog) => isSameWeek(week, new Date(timeLog.work_date)));

    let total = filteredTimeLogs.reduce(
      (total, log) => total + log.time_amount,
      0,
    );

    if (total == 0 || parseFloat(total) / parseInt(total) == 1) {
      return total;
    }
    return total.toFixed(2);
  };

  return (
    <Modal
      size={"fullscreen"}
      className={"sticky"}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
      trigger={
        <div>
          {props.trigger || (
            <Button icon style={{ width: "200px"}}>
              View All Submissions
            </Button>
          )}
        </div>
      }
    >
      <Modal.Header style={{ textAlign: "center" }}>
        All Submissions For {props.projectName}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Segment style={{ overflow: "auto", maxWidth: "100%" }}>
            <Table celled>

              
            </Table>
          </Segment>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => onClose()}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
}
