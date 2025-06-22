import React from "react";
import { config } from "../../util/functions/constants";
import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";
import TimeTableEditor from "./TimeTableEditor";

export default function TimeLogPanel(props) {
  let initialState = {
    time_log_id: "",
    date: "",
    time_amount: "",
    time_amount_hours: 0,
    time_amount_mins: 0,
    comment: "",
  };

  let submissionModalMessages = {
    SUCCESS: "The time log has been added.",
    FAIL: "We were unable to receive your time logging.",
  };

  let submitRoute = config.url.API_POST_CREATE_TIME_LOG;

  let formFieldArray = [
    {
      type: "date",
      label: "Date of Work",
      placeholder: "Date of Work",
      name: "date",
    },
    {
      type: "hoursInput",
      label: "Time Spent",
      placeholder: "Hours",
      name: "time_amount_hours",
    },
    {
      type: "minutesInput",
      label: "",
      placeholder: "Minutes",
      name: "time_amount_mins",
    },
    {
      type: "textArea",
      label: "Comment",
      placeholder: "Comment",
      name: "comment",
    },
  ];

  return (
    <TimeTableEditor
      callback={props.callback}
      initialState={initialState}
      submissionModalMessages={submissionModalMessages}
      header={props.header}
      submitRoute={submitRoute}
      formFieldArray={formFieldArray}
      create={initialState.time_log_id === ""}
      button="calendar plus"
      viewOnly={props.viewOnly}
    />
  );
}
