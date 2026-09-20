import React from "react";
import { config } from "../../util/functions/constants";
import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";

export default function TimeLogPanel(props) {
  let initialState = {
    active: props.timelog?.active || "",
    time_log_id: props.timelog?.time_log_id || "",
    user: props.user,
    mockUser: props.mockUser,
    dataOnSubmit: props.dataOnSubmit,
  };

  let submissionModalMessages = {
    SUCCESS: "The time log has been removed.",
    FAIL: "We were unable to delete the log.",
  };

  let submitRoute = config.url.API_DELETE_TIME_LOG;

  let formFieldArray = [];

  return (
    <DatabaseTableEditor
      initialState={initialState}
      submissionModalMessages={submissionModalMessages}
      header={props.header}
      submitRoute={submitRoute}
      formFieldArray={formFieldArray}
      create={initialState.time_log_id === ""}
      button="trash"
      body={props.body}
      reload={true}
      reloadData={props.reloadData}
    />
  );
}
