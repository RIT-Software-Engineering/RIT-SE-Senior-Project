import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Message,
  Modal,
} from "semantic-ui-react";

import { SecureFetch } from "../../../util/functions/secureFetch";
import { config } from "../../../util/functions/constants";

export default function DuplicateSemesterPanel(props) {
  const [sourceSemester, setSourceSemester] = useState("");
  const [targetSemester, setTargetSemester] = useState("");
  const [offsetDays, setOffsetDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState(false);

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

    SecureFetch(config.url.API_POST_DUPLICATE_SEMESTER_ACTIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceSemester,
        targetSemester,
        offsetDays: Number(offsetDays),
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
        setOpen(false);
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
      <Button
        primary
        onClick={() => {
          setStatus(null);
          setOpen(true);
        }}
      ></Button>

      <Modal open={open} onClose={() => setOpen(false)} size="small">
        <Modal.Header>Copy Semester Actions</Modal.Header>
        <Modal.Content>
          {status && (
            <Message
              positive={status.type === "success"}
              negative={status.type === "error"}
              content={status.text}
            />
          )}
          <Form>
            <Form.Field>
              <label>Source Semester</label>
              <Dropdown
                fluid
                selection
                options={semesterOptions}
                value={sourceSemester}
                onChange={(e, { value }) => setSourceSemester(value)}
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

            <Form.Field>
              <label>Offset Days</label>

              <Input
                type="number"
                value={offsetDays}
                onChange={(e) => setOffsetDays(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button primary loading={loading} onClick={duplicateSemester}>
            Copy Selected Actions
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
