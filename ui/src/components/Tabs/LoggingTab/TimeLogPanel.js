import React from "react";
import { config } from "../../util/functions/constants";
import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";

export default function TimeLogPanel(props) {
  let initialState = {
    time_log_id: "",
    date: "",
    time_amount: "",
    comment: "",
    mockUser: props.mockUser,
    mockId: props.mockUser.system_id,
    user: props.user,
    userId: props.user.user,
    semester: props.user.semester_group,
    project: props.project,
  };

  let submissionModalMessages = {
    SUCCESS: "The time log has been added.",
    FAIL: "We were unable to receive your time logging.",
  };

  let submitRoute = config.url.API_POST_CREATE_TIME_LOG;

  let formFieldArray = [
    {
      type: "date",
      label:
        "Date of Work (Time must be entered within 7 days of date of work.)",
      placeHolder: "Date of Work",
      name: "date",
    },
    {
      type: "input",
      label: "Time (hrs)",
      placeHolder: "Time",
      name: "time_amount",
    },
    {
      type: "textArea",
      label: "Comment",
      placeHolder: "Comment",
      name: "comment",
    },
  ];

  return (
    <DatabaseTableEditor
      initialState={initialState}
      submissionModalMessages={submissionModalMessages}
      header={props.header}
      submitRoute={submitRoute}
      formFieldArray={formFieldArray}
      create={initialState.time_log_id === ""}
      button="calendar plus"
      content=" Log Project Time"
      reload={true}
      reloadData={props.reloadData}
    />
  );
}
