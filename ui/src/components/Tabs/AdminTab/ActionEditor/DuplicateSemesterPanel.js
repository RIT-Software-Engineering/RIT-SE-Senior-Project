import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Form,
  Header,
  Input,
  Segment,
} from "semantic-ui-react";

import { SecureFetch } from "../../../util/functions/secureFetch";
import { config } from "../../../util/functions/constants";

export default function DuplicateSemesterPanel(props) {
  const [sourceSemester, setSourceSemester] = useState("");
  const [targetSemester, setTargetSemester] = useState("");
  const [offsetDays, setOffsetDays] = useState(0);
  const [loading, setLoading] = useState(false);

  const duplicateSemester = () => {
    if (!sourceSemester || !targetSemester) {
      alert("Select both semesters.");
      return;
    }

    if (sourceSemester === targetSemester) {
      alert("Source and Target semesters cannot be the same.");
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
        alert(`Copied ${data.copied} actions.`);
        props.callback();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to duplicate actions.");
      })
      .finally(() => setLoading(false));
  };

  const semesterOptions = props.semesterData.map((semester) => ({
    key: semester.semester_id,
    value: semester.semester_id,
    text: semester.name,
  }));

  return (
    <Segment>
      <Header>Duplicate Semester Actions</Header>

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

        <Button primary loading={loading} onClick={duplicateSemester}>
          Duplicate
        </Button>
      </Form>
    </Segment>
  );
}
