import React, { useState, useEffect } from "react";
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

const actionTypeMap = {
  individual: "Individual",
  team: "Team",
  coach: "Coach",
  admin: "Admin",
  student_announcement: "Student Announcement",
  coach_announcement: "Coach Announcement",
  peer_evaluation: "Peer Evaluation",
  break_period: "Break Period",
};

export default function DuplicateSemesterPanel(props) {
  const [sourceSemester, setSourceSemester] = useState("");
  const [targetSemester, setTargetSemester] = useState("");
  const [offsetDays, setOffsetDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [actions, setActions] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };

  const duplicateSemester = () => {
    const selectedActionObjects = actions.filter((action) =>
      selectedActions.includes(action.action_id),
    );

    setLoading(true);

    SecureFetch(config.url.API_POST_DUPLICATE_ACTIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actions: JSON.stringify(selectedActionObjects),
        source_semester: sourceSemester,
        target_semester: targetSemester,
        day_offset: Number(offsetDays),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.text();
      })
      .then(() => {
        setStatus({
          type: "success",
          text: `Copied ${selectedActionObjects.length} actions successfully.`,
        });
        props.callback();
        setTimeout(() => {
          props.onClose();
          setStatus(null);
          setSourceSemester("");
          setTargetSemester("");
          setOffsetDays(0);
          setActions([]);
          setSelectedActions([]);
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setStatus({
          type: "error",
          text: "Failed to duplicate actions. Please try again.",
        });
      })
      .finally(() => setLoading(false));
  };

  const semesterOptions = props.semesterData.map((semester) => ({
    key: semester.semester_id,
    value: semester.semester_id,
    text: semester.name,
  }));

  const targetOptions = semesterOptions.filter(
    (option) => option.value !== sourceSemester,
  );

  const sourceSemesterData = props.semesterData.find(
    (s) => s.semester_id === sourceSemester,
  );

  const targetSemesterData = props.semesterData.find(
    (s) => s.semester_id === targetSemester,
  );

  // Auto-calculate offset when both semesters are selected
  useEffect(() => {
    if (sourceSemesterData && targetSemesterData && Number(offsetDays) === 0) {
      const msPerDay = 24 * 60 * 60 * 1000;
      const sourceDate = new Date(sourceSemesterData.start_date);
      const targetDate = new Date(targetSemesterData.start_date);
      const diff = Math.round((targetDate - sourceDate) / msPerDay);
      setOffsetDays(diff);
    }
  }, [sourceSemesterData, targetSemesterData, offsetDays]);

  const isValid =
    !!sourceSemester &&
    !!targetSemester &&
    sourceSemester !== targetSemester &&
    selectedActions.length > 0 &&
    !loading;

  // Preview the new date based on offset (client-side preview only)
  const previewDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setDate(d.getDate() + Number(offsetDays));
    return d.toISOString().split("T")[0];
  };

  return (
    <Modal open={props.open} onClose={props.onClose} size="large" closeIcon>
      <Modal.Header>
        <i className="copy outline icon" />
        Copy Action / Announcement / Peer Eval / Break Period
      </Modal.Header>
      <Modal.Content>
        <p style={{ color: "#888", marginBottom: "1.5rem" }}>
          Copy actions, announcements, peer evaluations, and break periods from
          one semester into another with an optional date offset.
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
                  setStatus(null);
                  setOffsetDays(0);
                  setActions([]);
                  setSelectedActions([]);
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
                options={targetOptions}
                value={targetSemester}
                onChange={(e, { value }) => {
                  setTargetSemester(value);
                  setStatus(null);
                  setOffsetDays(0);
                }}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field width={6}>
            <label>Date Offset (Days)</label>
            <Input
              type="number"
              step={1}
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
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Start Date</Table.HeaderCell>
              <Table.HeaderCell>End Date</Table.HeaderCell>
              <Table.HeaderCell>New Start</Table.HeaderCell>
              <Table.HeaderCell>New End</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {actions.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={7} textAlign="center" disabled>
                  {sourceSemester
                    ? "No actions found for this semester."
                    : "Select a source semester to load actions."}
                </Table.Cell>
              </Table.Row>
            ) : (
              actions.map((action) => {
                const newStartDate = previewDate(action.start_date);
                const newEndDate = previewDate(action.due_date);
                return (
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
                    <Table.Cell>
                      {actionTypeMap[action.action_target] ||
                        action.action_target}
                    </Table.Cell>
                    <Table.Cell>{formatDate(action.start_date)}</Table.Cell>
                    <Table.Cell>{formatDate(action.due_date)}</Table.Cell>
                    <Table.Cell>{formatDate(newStartDate)}</Table.Cell>
                    <Table.Cell>{formatDate(newEndDate)}</Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon="cancel"
          content="Cancel"
          disabled={loading}
          onClick={props.onClose}
        />
        <Button
          primary
          icon="eye"
          content="Preview"
          disabled={!isValid}
          onClick={() => setPreviewOpen(true)}
        />
      </Modal.Actions>

      {/* Preview confirmation modal */}
      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        size="large"
        closeIcon
      >
        <Modal.Header>Preview Semester Copy</Modal.Header>
        <Modal.Content>
          <Table celled compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Current Start</Table.HeaderCell>
                <Table.HeaderCell>New Start</Table.HeaderCell>
                <Table.HeaderCell>Current End</Table.HeaderCell>
                <Table.HeaderCell>New End</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {actions
                .filter((a) => selectedActions.includes(a.action_id))
                .map((action) => (
                  <Table.Row key={action.action_id}>
                    <Table.Cell>{action.action_title}</Table.Cell>
                    <Table.Cell>{formatDate(action.start_date)}</Table.Cell>
                    <Table.Cell>
                      {formatDate(previewDate(action.start_date))}
                    </Table.Cell>
                    <Table.Cell>{formatDate(action.due_date)}</Table.Cell>
                    <Table.Cell>
                      {formatDate(previewDate(action.due_date))}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel" onClick={() => setPreviewOpen(false)} />
          <Button
            primary
            content="Confirm Copy"
            loading={loading}
            onClick={() => {
              setPreviewOpen(false);
              duplicateSemester();
            }}
          />
        </Modal.Actions>
      </Modal>
    </Modal>
  );
}
