import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  Message,
  Modal,
  Table,
} from "semantic-ui-react";

import { SecureFetch } from "../../../util/functions/secureFetch";
import { config } from "../../../util/functions/constants";

export default function DuplicateSemesterPanel(props) {
  const [sourceSemester, setSourceSemester] = useState("");
  const [targetSemester, setTargetSemester] = useState("");
  const [offsetDays, setOffsetDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [actions, setActions] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);

  const duplicateSemester = () => {
    if (!sourceSemester || !targetSemester) {
      setStatus({
        type: "error",
        text: "Select both semesters.",
      });
      return;
    }

    if (sourceSemester === targetSemester) {
      setStatus({
        type: "error",
        text: "Source and Target semesters cannot be the same.",
      });
      return;
    }

    setLoading(true);

    SecureFetch(config.url.API_POST_DUPLICATE_ACTIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceSemester,
        targetSemester,
        offsetDays: Number(offsetDays),
        actionIds: selectedActions,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setStatus({
          type: "success",
          text: `Copied ${data.copied} actions.`,
        });

        props.callback();
        props.onClose();
      })
      .catch((err) => {
        console.error(err);
        setStatus({
          type: "error",
          text: "Failed to duplicate actions.",
        });
      })
      .finally(() => setLoading(false));
  };

  const semesterOptions = props.semesterData.map((semester) => ({
    key: semester.semester_id,
    value: semester.semester_id,
    text: semester.name,
  }));

  return (
    <>
      <Modal open={props.open} onClose={props.onClose} size="small">
        <Modal.Header>
          <i className="copy outline icon" />
          Copy Semester Actions
        </Modal.Header>
        <Modal.Content>
          <p style={{ color: "#888", marginBottom: "1.5rem" }}>
            Copy actions and announcements from one semester into another with
            an optional date offset.
          </p>
          {status && (
            <Message
              positive={status.type === "success"}
              negative={status.type === "error"}
              content={status.text}
            />
          )}
          <Form>
            <Form.Group widths="equal">
              <Form.Field>
                <label>Source Semester</label>
                <Dropdown
                  fluid
                  selection
                  options={semesterOptions}
                  value={sourceSemester}
                  onChange={(e, { value }) => {
                    setSourceSemester(value);

                    SecureFetch(
                      `${config.url.API_GET_SEMESTER_ACTIONS}?semester=${value}`,
                    )
                      .then((r) => r.json())
                      .then((data) => {
                        setActions(data);

                        setSelectedActions(data.map((a) => a.action_id));
                      });
                  }}
                />
              </Form.Field>
              <Form.Field>
                <label>Target Semester</label>
                <Dropdown
                  fluid
                  selection
                  options={semesterOptions}
                  value={targetSemester}
                  onChange={(e, { value }) => setTargetSemester(value)}
                />
              </Form.Field>
            </Form.Group>
            <Form.Field width={6}>
              <label>Date Offset (Days)</label>
              <Input
                type="number"
                value={offsetDays}
                onChange={(e) => setOffsetDays(e.target.value)}
              />
            </Form.Field>
          </Form>
          <Table celled selectable compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing>
                  <Checkbox
                    checked={
                      selectedActions.length === actions.length &&
                      actions.length > 0
                    }
                    onChange={(e, data) => {
                      if (data.checked)
                        setSelectedActions(actions.map((a) => a.action_id));
                      else setSelectedActions([]);
                    }}
                  />
                </Table.HeaderCell>

                <Table.HeaderCell>Action</Table.HeaderCell>

                <Table.HeaderCell>Start Date</Table.HeaderCell>

                <Table.HeaderCell>End Date</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {actions.map((action) => (
                <Table.Row key={action.action_id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedActions.includes(action.action_id)}
                      onChange={(e, data) => {
                        if (data.checked) {
                          setSelectedActions([
                            ...selectedActions,
                            action.action_id,
                          ]);
                        } else {
                          setSelectedActions(
                            selectedActions.filter(
                              (id) => id !== action.action_id,
                            ),
                          );
                        }
                      }}
                    />
                  </Table.Cell>

                  <Table.Cell>{action.action_title}</Table.Cell>

                  <Table.Cell>{action.start_date}</Table.Cell>

                  <Table.Cell>{action.end_date}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button icon="cancel" content="Cancel" onClick={props.onClose} />
          <Button
            primary
            icon="copy"
            content="Copy Actions"
            loading={loading}
            onClick={duplicateSemester}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}
