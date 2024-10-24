import DatabaseTableEditor from "../../../shared/editors/DatabaseTableEditor";
import {
  ACTION_TARGETS,
  config,
  DROPDOWN_ITEMS,
} from "../../../util/functions/constants";
import {
  createSemesterDropdownOptions,
  humanFileSize,
  SEMESTER_DROPDOWN_NULL_VALUE,
} from "../../../util/functions/utils";
import { useState } from "react";

const short_desc = "short_desc";
const file_types = "file_types";
const action_target = "action_target";
const file_size = "file_size";

export default function ActionPanel(props) {
  const [open, setOpen] = useState(false);

  let initialState = {
    action_id: props.actionData?.action_id || "",
    action_title: props.actionData?.action_title || "",
    semester: props.actionData?.semester || "",
    action_target: props.actionData?.action_target || "",
    date_deleted: props.actionData?.date_deleted || "",
    short_desc: props.actionData?.short_desc || "",
    start_date: props.actionData?.start_date || "",
    due_date: props.actionData?.due_date || "",
    page_html: props.actionData?.page_html || "",
    file_types: props.actionData?.file_types || "",
    file_size: props.actionData?.file_size
      ? humanFileSize(props.actionData?.file_size, false, 0)
      : "",
  };

  let submissionModalMessages = props.create
    ? {
        SUCCESS: "The action has been created.",
        FAIL: "We were unable to create your action.",
      }
    : {
        SUCCESS: "The action has been Edited.",
        FAIL: "We were unable to receive your edits.",
      };
  let semesterMap = {};

  for (let i = 0; i < props.semesterData.length; i++) {
    const semester = props.semesterData[i];
    semesterMap[semester.semester_id] = semester.name;
  }

  let submitRoute = props.create
    ? config.url.API_POST_CREATE_ACTION
    : config.url.API_POST_EDIT_ACTION;

  let formFieldArray = [
    {
      type: "input",
      label: "Action Title",
      placeHolder: "Action Title",
      name: "action_title",
    },
    {
      type: "dropdown",
      label: "Semester",
      placeHolder: "Semester",
      name: "semester",
      options: createSemesterDropdownOptions(props.semesterData),
      nullValue: SEMESTER_DROPDOWN_NULL_VALUE,
      loading: props.semesterData.loading,
    },
    {
      type: "dropdown",
      label: "Action Target",
      placeHolder: "Action Target",
      name: action_target,
      options: DROPDOWN_ITEMS.actionTarget,
    },
    {
      type: "input",
      label: "Short Desc (Not used for announcements)",
      placeHolder: "Short Desc",
      name: short_desc,
    },
    {
      type: "date",
      label: "Start Date",
      placeHolder: "Start Date",
      name: "start_date",
    },
    {
      type: "date",
      label: "Due Date / Announcement End Date",
      placeHolder: "Due Date / Announcement End Date",
      name: "due_date",
    },
    // PLANNING: When the action is a peer-eval, we would replace textArea with our fourm buider
    // Or add a taggle to switch bettwen the html and the form builder
    {
      type: "textArea",
      label: "Page Html",
      placeHolder: "Page Html",
      name: "page_html",
    },
    {
      type: "input",
      label:
        "Upload Files (No spaces and ensure . prefix is added - Example: .png,.pdf,.txt) (Not used for announcements)",
      placeHolder: "CSV format please - No filetypes = no files uploaded",
      name: file_types,
    },
    {
      type: "input",
      label:
        "File Upload Limit (Default 15 MB) (Number and then either KB, MB, or GB after - Example: 500 KB, 10 MB, 1 GB) (Server limit currently 1GB) (Not used for announcements)",
      placeHolder: "File Upload Limit",
      name: file_size,
    },
    {
      type: "activeCheckbox",
      label: "Active",
      placeHolder: "Active",
      name: "date_deleted",
    },
  ];

  //Processing to be done before data is sent to the backend.
  const preChange = (formData, name, value) => {
    if (
      name === action_target &&
      [
        ACTION_TARGETS.coach_announcement,
        ACTION_TARGETS.student_announcement,
      ].includes(value)
    ) {
      formData[short_desc] = "";
      formData[file_types] = "";
      formData[name] = value;
    } else if (
      [
        ACTION_TARGETS.coach_announcement,
        ACTION_TARGETS.student_announcement,
      ].includes(formData[action_target]) &&
      [short_desc, file_types].includes(name)
    ) {
      return formData;
    }
  };

  if (props.isOpenCallback) {
    return (
      <DatabaseTableEditor
        initialState={initialState}
        submissionModalMessages={submissionModalMessages}
        submitRoute={submitRoute}
        formFieldArray={formFieldArray}
        semesterData={props.semesterData}
        header={props.header}
        create={!!props.create}
        button={props.buttonIcon || (!!props.create ? "plus" : "edit")}
        trigger={props.trigger}
        isOpenCallback={props.isOpenCallback}
        onClose={() => {
          setOpen(false);
          props.isOpenCallback(false);
          }}
        onOpen={() => {
          setOpen(true);
          props.isOpenCallback(true);
          }}
        open={open}
        preChange={preChange}
        preSubmit={(data) => {
          if (data.semester === SEMESTER_DROPDOWN_NULL_VALUE) {
            data.semester = "";
          }
          return data;
        }}
      />
    );
  } else {
    return (
      <DatabaseTableEditor
        initialState={initialState}
        submissionModalMessages={submissionModalMessages}
        submitRoute={submitRoute}
        formFieldArray={formFieldArray}
        semesterData={props.semesterData}
        header={props.header}
        create={!!props.create}
        button={props.buttonIcon || (!!props.create ? "plus" : "edit")}
        trigger={props.trigger}
        preChange={preChange}
        preSubmit={(data) => {
          if (data.semester === SEMESTER_DROPDOWN_NULL_VALUE) {
            data.semester = "";
          }
          return data;
        }}
      />
    );
  }
}
