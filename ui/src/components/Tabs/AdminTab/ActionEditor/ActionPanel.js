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
import { useMemo, useState } from "react";
import { Message } from "semantic-ui-react";

const short_desc = "short_desc";
const file_types = "file_types";
const action_target = "action_target";
const file_size = "file_size";
const page_html = "page_html";
const start_date = "start_date";

const TYPE_HELP = {
  individual:
    "Assigns the same action to each student in the semester group, with completion tracking (red/green) for the team as a whole. Individual students can submit actions again even if they’ve previously done so. Only coaches, admins, and the submitting student can see submitted actions. Other team members can see action status and submission time/date (but not the submitted action).",
  team:
    "Assigns the same action to each team in the semester group.  Completion (green) requires submission by any team member. Student team members can submit actions even if they’ve previously done so or another team member has done so.  Only coaches, admins, and the submitting student’s team can see submitted actions.  All users can see action status and submission time/date.",
  coach:
    "Assigns the same action to each coah. Only coaches, admins, and the submitting student’s team can see submitted actions.  All users can see action status and submission time/date.",
  peer_evaluation:
    "Peer Evaluation — Create an action by entering a clear title, selecting semester/year, setting start and due dates, then building questions (table ratings, mood ratings, feedback, peer feedback) with the question builder, and copy the generated HTML into the page when finished.",
  student_announcement:
    "Announcement visible to students; no file uploads. Provide title, dates, and message content.",
  coach_announcement:
    "Announcement visible to coaches; no file uploads. Provide title, dates, and message content.",
  break_period:
    "Write a description and select the date range.",
};
const HTML_HELP = {
  individual:
    "",
  team:
    "",
  coach:
    "",
  peer_evaluation:
    "This page uses the peer-evaluation question set. Keep the intro instructions concise. Do not remove the submission form markup below. If you need to change questions, use the Question Builder instead of editing raw HTML.",
  student_announcement:
    "",
  coach_announcement:
    "",
  break_period:
    "",
};


export default function ActionPanel(props) {
  const [open, setOpen] = useState(true);
  const [errors, setErrors] = useState([]); // track action form errors

  let initialState = useMemo(() => ({
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
  }), [props.actionData]);

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

  const [selectedType, setSelectedType] = useState(initialState.action_target || "");

  let submitRoute = props.create
    ? config.url.API_POST_CREATE_ACTION
    : config.url.API_POST_EDIT_ACTION;

  let formFieldArray = [
    {
      type: "dropdown",
      label: "Type",
      placeHolder: "Action Target",
      name: action_target,
      options: DROPDOWN_ITEMS.actionTarget,
      required: true,
    }];
    if (selectedType) {
      formFieldArray.push({
        type: "note",
        name: "type_help",
        content: (
          <Message info size="tiny">
            <p style={{ marginTop: 6 }}>
              {TYPE_HELP[selectedType] ?? "This action type has no description yet."}
            </p>
          </Message>
        ),
      });
    }
    formFieldArray.push(
    {
      type: "input",
      label: "Action Title",
      placeHolder: "Action Title",
      name: "action_title",
      required: true,
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
      type: "input",
      label:
        "Short Description (allows HTML styling for bold and italics (<b>,<i>,<strong>,<em>)",
      placeHolder: "Short Desc",
      name: short_desc,
      required: true,
    },
    {
      type: "date",
      label: "Start Date",
      placeHolder: "Start Date",
      name: "start_date",
      required: true,
    }, 
    );
    if (
    selectedType === ACTION_TARGETS.coach_announcement ||
    selectedType === ACTION_TARGETS.student_announcement ||
    selectedType === ACTION_TARGETS.break_period
) {
  // Announcement or break period — only End Date
  formFieldArray.push({
    type: "date",
    label: "Announcement End Date",
    placeHolder: "End Date",
    name: "due_date",
    required: true,
  });
} else {
  // Other actions — Due Dates
  formFieldArray.push(
    {
      type: "date",
      label: "Due Date",
      placeHolder: "Due Date",
      name: "due_date",
      required: true,
    }
  );
}
if (selectedType !== ACTION_TARGETS.break_period) {
  formFieldArray.push({
    type: "note",
    name: "peer_eval_note",
    content: (
      <Message info>
        <Message.Header>Read before editing</Message.Header>
        <p style={{ marginTop: 6 }}>
              {HTML_HELP[selectedType] ?? "This action type has no description yet."}
            </p>
      </Message>
    ),
  });
}
// if (selectedType === ACTION_TARGETS.peer_evaluation) {
//   // Peer evaluation — add note about form builder
//   formFieldArray.push(
//     {
//     type: "note",
//     label: "Note: For peer evaluations, the HTML editor will be replaced with a form builder in the future.",
//     }
//   );
// }
// Now continue adding the rest of the fields INSIDE the array
formFieldArray.push(
    // PLANNING: When the action is a peer-eval, we would replace textArea with our fourm buider
    // Or add a taggle to switch bettwen the html and the form builder
    {
      type: "textArea",
      label: "Html",
      placeHolder: "Page Html",
      name: "page_html",
      required: true,
    },
    {
      type: "input",
      label:
        "Upload Files (No spaces and ensure . prefix is added - Example: .png,.pdf,.txt)",
      placeHolder: "CSV format please - No filetypes = no files uploaded",
      name: file_types,
    },
    {
      type: "input",
      label:
        "File Upload Limit (Default 15 MB) (Number and then either KB, MB, or GB after - Example: 500 KB, 10 MB, 1 GB) (Server limit currently 1GB)",
      placeHolder: "File Upload Limit",
      name: file_size,
    },
    {
      type: "activeCheckbox",
      label: "Active",
      placeHolder: "Active",
      name: "date_deleted",
    },
);

  // validation for the action form
  const validateForm = (data) => {
    const errorsFound = [];

    // check for action title
    if (!data.action_title?.trim()) {
      errorsFound.push({
        name: "action_title",
        message: "Please provide the Action Title",
      });
    }

    // check for action target
    if (!data.action_target?.trim()) {
      errorsFound.push({
        name: "action_target",
        message: "Please select the Action Target",
      });
    }

    if (
      data.action_target !== "peer_evaluation" &&
      data.action_target !== "student_announcement" &&
      data.action_target !== "coach_announcement"
    ) {
      // check for short description
      if (!data.short_desc?.trim()) {
        errorsFound.push({
          name: "short_desc",
          message: "Please provide a Short Description (Short Desc)",
        });
      }
    }

    // check for page_html
    if (data.action_target !== "break_period") {
      if (!data.page_html?.trim()) {
        errorsFound.push({
          name: "page_html",
          message: "Please provide the Page Html",
        });
      }
    }

    // date validations
    if (!data.start_date) {
      errorsFound.push({
        name: "start_date",
        message: "Please provide the Start Date",
      });
    }

    if (!data.due_date) {
      errorsFound.push({
        name: "due_date",
        message: "Please provide the Due Date",
      });
    }

    if (data.start_date && data.due_date) {
      if (data.start_date > data.due_date) {
        errorsFound.push({
          name: "dates",
          message: "Start Date must be before Due Date",
          elements: ["start_date", "due_date"], // display same message for both dates
        });
      }
    }

    // check whether Active checkbox is checked or not.
    // if (data.date_deleted === false) {
    //   errorsFound.push({
    //     name: "date_deleted",
    //     message: "Please check the Active box",
    //   });
    // }
    return errorsFound; // no errors found
  };

  const preSubmit = (data) => {
    const validationErrors = validateForm(data);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
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
    if (name === action_target) {
      setSelectedType(value);
    }
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
