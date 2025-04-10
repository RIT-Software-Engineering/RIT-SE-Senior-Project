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
const page_html = "page_html";
const start_date = "start_date";

export default function ActionPanel(props) {
  const [open, setOpen] = useState(true);
  const [errors, setErrors] = useState([]); // track action form errors

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
        SUBMISSON_ERROR: "There were invalid inputs. Please try again.",
      }
    : {
        SUCCESS: "The action has been Edited.",
        FAIL: "We were unable to receive your edits.",
        SUBMISSON_ERROR: "There were invalid inputs. Please try again.",
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
      label:
        "Short Desc (allows HTML styling for bold and italics (<b>,<i>,<strong>,<em>) (Not used for announcements);",
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

  // validation for the action form
  const validateForm = (data) => {
    const errorsFound = [];

    if (
      data.action_target !== "peer_evaluation" &&
      data.action_target !== "student_announcement" &&
      data.action_target !== "coach_announcement"
    ) {
      // check for short description
      if (!data.short_desc?.trim()) {
        errorsFound.push({
          name: "short_desc",
          message: "Please provide a short description (short_desc)",
        });
      }
    }

    // check for page_html
    if (!data.page_html?.trim()) {
      errorsFound.push({
        name: "page_html",
        message: "Please provide the page HTML (page_html)",
      });
    }

    // date validation only if both start and due date are given.
    if (data.start_date && data.due_date) {
      if (data.start_date > data.due_date) {
        errorsFound.push({
          name: "date_start",
          message: "Start Date must be before Due Date",
        });
      }
    }

    // check whether Active checkbox is checked or not.
    if (data.date_deleted === false) {
      errorsFound.push({
        name: "date_deleted",
        message: "Please check the Active box",
      });
    }
    return errorsFound; // no errors found
  };

  const preSubmit = (data) => {
    const validationErrors = validateForm(data);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      console.log("The current error is:", validationErrors);
      return null;
    }

    setErrors([]);
    if (data.semester === SEMESTER_DROPDOWN_NULL_VALUE) {
      data.semester = "";
    }
    return data;
  };

  //Processing to be done before data is sent to the backend.
  const preChange = (formData, name, value) => {
    if (
      name === action_target &&
      [
        ACTION_TARGETS.coach_announcement,
        ACTION_TARGETS.student_announcement,
        ACTION_TARGETS.peer_evaluation,
      ].includes(value)
    ) {
      formData[short_desc] = "";
      formData[file_types] = "";
      formData[file_size] = "";
      formData[name] = value;
    } else if (
      [
        ACTION_TARGETS.coach_announcement,
        ACTION_TARGETS.student_announcement,
        ACTION_TARGETS.peer_evaluation,
      ].includes(formData[action_target]) &&
      [short_desc, file_types, file_size].includes(name)
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
        preSubmit={preSubmit}
        callback={props.callback}
        errors={errors}
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
        preSubmit={preSubmit}
        callback={props.callback}
        errors={errors}
      />
    );
  }
}
