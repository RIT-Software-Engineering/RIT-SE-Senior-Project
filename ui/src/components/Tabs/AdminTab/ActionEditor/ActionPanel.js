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
import InnerHTML from "dangerously-set-html-content";


const short_desc = "short_desc";
const file_types = "file_types";
const action_target = "action_target";
const file_size = "file_size";
const page_html = "page_html";
const start_date = "start_date";

const TYPE_HELP = {
  individual:`
    Assigns the same action to each student in the semester group. Completion (green) requires submission by every team member. Student team members can submit actions even if they've previously done so or another team member has submitted. Only coaches, admins, and the submitting student’s team can view submitted actions. All users can see action status and submission time/date.
  <br><br>
  <b>How to fill this out:</b>
  <ol>
    <li>Give this action a <b>Title</b> and select the <b>Year/Semester</b> where it should appear. Note: Choosing No Semester will hide the action on the dashboard. Instead, it will show in admin under <b>No Semester</b>.</li>
    <li>Enter a <b>Short Description</b> that appears under the Action Title when clicked on the dashboard.</li>
    <li>Set a <b>Start Date</b> (when the action opens) and a <b>Due Date</b> (when it should be completed) You will see a red “days late” indicator next to each team member's submission once the due date has passed..</li>
    <li>Scroll down for additional instructions on filling out the <b>HTML Field</b>.</li>
    <li>Please note if you add a file type in <b>File Uploads</b>, a file must be uploaded for the action to be marked complete. Additionally, using a comma between file types will act as an <b>Or</b> condition.</li>
  </ol>
  <b>Important:</b> If you do not require a form to be filled out (which you would create in the HTML Field), you must request at least one file upload instead.
`,
  team:
    `Assigns the same action to each team in the semester group. Completion (green) requires submission by any team member. Student team members can submit actions even if they've previously done so or another team member has submitted. Only coaches, admins, and the submitting student’s team can view submitted actions. All users can see action status and submission time/date.
  <br><br>
  <b>How to fill this out:</b>
  <ol>
    <li>Give this action a <b>Title</b> and select the <b>Year/Semester</b> where it should appear. Note: Choosing No Semester will hide the action on the dashboard. Instead, it will show in admin under <b>No Semester</b>.</li>
    <li>Enter a <b>Short Description</b> that appears under the Action Title when clicked on the dashboard.</li>
    <li>Set a <b>Start Date</b> (when the action opens) and a <b>Due Date</b> (when it should be completed) You will see a red “days late” indicator next to each team member's submission once the due date has passed..</li>
    <li>Scroll down for additional instructions on filling out the <b>HTML Field</b>.</li>
    <li>Please note if you add a file type in <b>File Uploads</b>, a file must be uploaded for the action to be marked complete. Additionally, using a comma between file types will act as an <b>Or</b> condition.</li>

  </ol>
  <b>Important:</b> If you do not require a form to be filled out (which you would create in the HTML Field), you must request at least one file upload instead.
`,
  coach:`
  Assigns the same action to each coach in the semester group. Completion (green) requires submission by any coach for the corresponding team. Only coaches, admins can view submitted actions.
  <br><br>
  <b>How to fill this out:</b>
  <ol>
    <li>Give this action a <b>Title</b> and select the <b>Year/Semester</b> where it should appear. Note: Choosing <b>No Semester</b> will hide the action on the dashboard. Instead, it will show in admin under <b>No Semester</b>.</li>
    <li>Enter a <b>Short Description</b> that appears under the Action Title when clicked on the dashboard.</li>
    <li>Set a <b>Start Date</b> (when the action opens) and a <b>Due Date</b> (when it should be completed) You will see a red “days late” indicator next to each team member's submission once the due date has passed..</li>
    <li>Scroll down for additional instructions on filling out the <b>HTML Field</b>.</li>
    <li>Please note if you add a file type in <b>File Uploads</b>, a file must be uploaded for the action to be marked complete. Additionally, using a comma between file types will act as an <b>Or</b> condition.</li>

  </ol>
  <b>Important:</b> If you do not require a form to be filled out (which you would create in the HTML Field), you must request at least one file upload instead.
`,
  peer_evaluation:`
  Assigns a peer-evaluation activity. Students complete a structured form; submissions are visible to coaches and admins. All users can see action status and submission time/date.
  <br><br>
  <b>How to fill this out:</b>
  <ol>
    <li>Give this action a <b>Title</b> and select the <b>Year/Semester</b> where it should appear. Note: Choosing <b>No Semester</b> will hide the action on the dashboard.</li>
    <li>Set a <b>Start Date</b> (when the evaluation opens) and a <b>Due Date</b> (when it should be completed) You will see a red “days late” indicator next to each team member's submission once the due date has passed..</li>
    <li>Use the <b>Question Builder</b> to create items (e.g., table ratings, mood ratings, feedback, peer feedback), then copy the generated HTML into the <b>HTML Field</b>.</li>
  </ol>
`,
  student_announcement:`
  Announcement visible to students. No submissions are required; this is informational only.
  <br><br>
  <b>How to fill this out:</b>
  <ol>
    <li>Provide a clear <b>Title</b> and select the <b>Year/Semester</b> where it should appear. Note: Choosing <b>No Semester</b> will hide the announcement on the dashboard. Instead, it will show in admin under <b>No Semester</b>.</li>
    <li>Set a <b>Start Date</b> (when it becomes visible) and an <b>End Date</b> (when it should stop showing).</li>
    <li>Enter the announcement content in the <b>HTML Field</b> (you can use basic HTML for formatting).</li>
  </ol>
`,
  coach_announcement:`
  Announcement visible to coaches. No submissions are required; this is informational only.
  <br><br>
  <b>How to fill this out:</b>
  <ol>
    <li>Provide a clear <b>Title</b> and select the <b>Year/Semester</b> where it should appear. Note: Choosing <b>No Semester</b> will hide the announcement on the dashboard. Instead, it will show in admin under <b>No Semester</b>.</li>
    <li>Set a <b>Start Date</b> (when it becomes visible) and an <b>End Date</b> (when it should stop showing).</li>
    <li>Enter the announcement content in the <b>HTML Field</b> (you can use basic HTML for formatting).</li>
  </ol>
`,
  break_period:`
  Blocks out a break period where actions are paused/limited. Displays informational text during the specified range.
  <br><br>
  <b>How to fill this out:</b>
  <ol>
    <li>Give this entry a <b>Title</b> and select the <b>Year/Semester</b> where it should appear. Note: Choosing <b>No Semester</b> will hide it on the dashboard. Instead, it will show in admin under <b>No Semester</b>.</li>
    <li>Enter a <b>Short Description</b> that appears under the Action Title when clicked on the dashboard.</li>
    <li>Set the <b>Start Date</b> (when the break begins) and the <b>End Date</b> (when the break messaging should stop showing).</li>
  </ol>
`,
};
const HTML_HELP = {
    individual: `
    <h4 style="margin:0 0 .5rem 0;">Individual action: writing instructions & building a simple form</h4>
    <p>
      Use this area to describe the action and (optionally) include a small HTML form students will fill out
      <i>instead of</i> uploading files. If you don't include a form, you must request at least one file upload below.
    </p>
    <b>Example form</b> (copy/paste and then edit labels/fields):
    <pre style="overflow:auto; padding:.75rem; border:1px solid #ddd; border-radius:8px;">
  &lt;h2&gt;Submit Project Proposal&lt;/h2&gt;
  &lt;form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data"&gt;
    &lt;ul&gt;
      &lt;li&gt;Project title and team members&lt;/li&gt;
      &lt;li&gt;Background and motivation&lt;/li&gt;
      &lt;li&gt;Project goals and objectives&lt;/li&gt;
      &lt;div class="required field"&gt;
        &lt;label for="Team_Members"&gt;Team Members&lt;/label&gt;
        &lt;input required name="Team_Members" type="text" placeholder="List all team members"&gt;
      &lt;/div&gt;
        &lt;div class="required field"&gt;
          &lt;label&gt;Will you be using the project name as your team name?&lt;/label&gt;
          &lt;div style="display:flex; gap:1rem; align-items:center; margin-top:0.5rem;"&gt;
            &lt;div&gt;
              &lt;input type="radio" id="Yes" name="Same_Project_Name" value="Yes" required&gt;
              &lt;label for="Yes"&gt;Yes&lt;/label&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;input type="radio" id="No" name="Same_Project_Name" value="No" required&gt;
              &lt;label for="No"&gt;No&lt;/label&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;li&gt;Decide on a professional team name if it's not the project name(clever is OK, keep it appropriate).&lt;/li&gt;
      &lt;div&gt; &lt;!-- Optional field (no 'required' attribute) --&gt; 
        &lt;label for="Team_Name"&gt;Team Name&lt;/label&gt;
        &lt;input required name="Team_Name" type="text"&gt;
      &lt;/div&gt;
    &lt;/ul&gt;
  &lt;/form&gt;</pre>
    <p style="margin-top:.75rem;">
      <b>Tip:</b> The <code>required</code> attribute on an input and/or wrapping it in
      <code> class="required field"</code> makes that question mandatory before submission.
      Remove either/both if the question should be optional.
    </p>
  `,
  team: `
    <h4 style="margin:0 0 .5rem 0;">Team action: describing deliverables &amp; collecting team responses</h4>
    <p>
      Use this section to describe what the entire team must complete. You can include optional HTML inputs if
      teams need to record values instead of uploading a document.
    </p>
        <b>Example form</b> (copy/paste and then edit labels/fields):
    <pre style="overflow:auto; padding:.75rem; border:1px solid #ddd; border-radius:8px;">
  &lt;h2&gt;Week 1 Artifacts, Tasks, and Deliverables&lt;/h2&gt;
  &lt;form class="ui form" action="/db/submitAction" method="POST" enctype="multipart/form-data"&gt;
    &lt;ul&gt;
      &lt;li&gt;Hold a project kick-off meeting with your sponsor this week or next week.&lt;/li&gt;
      &lt;li&gt;Gather enough detail to write the project synopsis (due in a future action).&lt;/li&gt;
      &lt;li&gt;Complete a team social event (off-campus if possible).&lt;/li&gt;
      &lt;div class="required field"&gt; &lt;!-- Marked 'required' to enforce submission --&gt; 
        &lt;label for="Social_Event"&gt;Social Event - time, date, and place&lt;/label&gt;
        &lt;input required name="Social_Event" type="text"&gt;
      &lt;/div&gt;
        &lt;div class="required field"&gt;
          &lt;label&gt;Will you be using the project name as your team name?&lt;/label&gt;
          &lt;div style="display:flex; gap:1rem; align-items:center; margin-top:0.5rem;"&gt;
            &lt;div&gt;
              &lt;input type="radio" id="Yes" name="Same_Project_Name" value="Yes" required&gt;
              &lt;label for="Yes"&gt;Yes&lt;/label&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;input type="radio" id="No" name="Same_Project_Name" value="No" required&gt;
              &lt;label for="No"&gt;No&lt;/label&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;li&gt;Decide on a professional team name if not using the project name(clever is OK, keep it appropriate).&lt;/li&gt;
      &lt;div&gt; &lt;!-- Optional field (no 'required' attribute) --&gt; 
        &lt;label for="Team_Name"&gt;Team Name&lt;/label&gt;
        &lt;input required name="Team_Name" type="text"&gt;
      &lt;/div&gt;
    &lt;/ul&gt;
  &lt;/form&gt;</pre>

    <p><b>Tip:</b> Keep questions short and use textareas for longer team responses.</p>
  `,

  coach: `
    <h4 style="margin:0 0 .5rem 0;">Coach action: providing feedback or logging reviews</h4>
    <p>
      Use this field for actions coaches must complete. Include HTML inputs if coaches need to submit specific notes instead of or along uploading files.
    </p>
    <b>Example form</b>:
    <pre style="overflow:auto; padding:.75rem; border:1px solid #ddd; border-radius:8px;">
&lt;form class="ui form" action="/db/submitAction" method="POST"&gt;
  &lt;h3&gt;Team Review Summary&lt;/h3&gt;
  &lt;div class="required field"&gt; &lt;!-- Required overall score --&gt;
    &lt;div class="required field"&gt;
          &lt;label&gt;Overall Score&lt;/label&gt;
          &lt;div style="display:flex; gap:1rem; align-items:center; margin-top:0.5rem;"&gt;
            &lt;div&gt;
              &lt;input type="radio" id="1" name="Score" value="1" required&gt;
              &lt;label for="1"&gt;1&lt;/label&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;input type="radio" id="2" name="Score" value="2" required&gt;
              &lt;label for="2"&gt;2&lt;/label&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;input type="radio" id="3" name="Score" value="3" required&gt;
              &lt;label for="3"&gt;3&lt;/label&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
  &lt;/div&gt;
  &lt;div&gt; &lt;!-- Optional written feedback --&gt;
    &lt;label for="Feedback"&gt;Comments / Notes&lt;/label&gt;
    &lt;textarea name="Feedback"&gt;&lt;/textarea&gt;
  &lt;/div&gt;
&lt;/form&gt;</pre>
  `,

  peer_evaluation: `
    <h4 style="margin:0 0 .5rem 0;">Peer Evaluation</h4>
    <p>
      This page uses the peer-evaluation question set. You normally won't edit the HTML directly unless it is necessary.
      Instead, use the <b>Question Builder</b> tool to generate your peer-eval form automatically.
      Reminder: You can make a field required by wrapping it in <code>class="required field"</code> attribute to the input or removing it to make it optional.
    </p>
  `,

  student_announcement: `
    <h4 style="margin:0 0 .5rem 0;">Student Announcement</h4>
    <p>
      Use this field to share information or reminders with students. No submissions or uploads are needed.
      You can use basic HTML to format the announcement.
    </p>

    <b>Example layout</b>:
    <pre style="overflow:auto; padding:.75rem; border:1px solid #ddd; border-radius:8px;">
&lt;div&gt;
  &lt;h2&gt;Reminder: Midterm Demos Next Week&lt;/h2&gt;
  &lt;p&gt;Your team will present on &lt;b&gt;Wednesday&lt;/b&gt; during lab. Make sure to bring a working prototype!&lt;/p&gt;
  &lt;ul&gt;
    &lt;li&gt;Prepare a 5-minute overview.&lt;/li&gt;
    &lt;li&gt;Include slides with progress updates.&lt;/li&gt;
    &lt;li&gt;Arrive 10 minutes early to set up.&lt;/li&gt;
  &lt;/ul&gt;
&lt;/div&gt;
    </pre>
  `,

  coach_announcement: `
    <h4 style="margin:0 0 .5rem 0;">Coach Announcement</h4>
    <p>
      Use this field to post information or reminders for coaches. No submissions or uploads are required.
      HTML tags like &lt;b&gt;, &lt;i&gt;, and lists are supported for clarity.
    </p>

    <b>Example layout</b>:
    <pre style="overflow:auto; padding:.75rem; border:1px solid #ddd; border-radius:8px;">
&lt;div&gt;
  &lt;h2&gt;Weekly Meeting Agenda&lt;/h2&gt;
  &lt;p&gt;Topics for discussion during this week's coach sync:&lt;/p&gt;
  &lt;ul&gt;
    &lt;li&gt;Review of team check-ins&lt;/li&gt;
    &lt;li&gt;Midterm evaluation timeline&lt;/li&gt;
    &lt;li&gt;Student support updates&lt;/li&gt;
  &lt;/ul&gt;
  &lt;p&gt;Thank you for supporting your teams!&lt;/p&gt;
&lt;/div&gt;
    </pre>
  `,
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
  const isEdit = !props.create;

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
      disabled: isEdit,
    }];
    if (selectedType) {
      formFieldArray.push({
        type: "note",
        name: "type_help",
        content: (
          <Message info>
            <div
              style={{ marginTop: 6 }}
              dangerouslySetInnerHTML={{
                __html:
                  TYPE_HELP[selectedType] ??
                  "This action type has no description yet.",
              }}
            />
          </Message>
        ),
      });
    }
    console.log('selectedType =', selectedType, 'ACTION_TARGETS =', ACTION_TARGETS);
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
      selectedType === (ACTION_TARGETS.break_period || 'break_period')
    ) {
      formFieldArray.push({
        type: "date",
        label: "End Date",
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
// I can remove if
if (selectedType === ACTION_TARGETS.individual ||
    selectedType === ACTION_TARGETS.team ||
    selectedType === ACTION_TARGETS.coach ||
    selectedType === ACTION_TARGETS.coach_announcement ||
    selectedType === ACTION_TARGETS.student_announcement || 
    selectedType === ACTION_TARGETS.peer_evaluation
  ) {
  formFieldArray.push({
    type: "note",
    name: "peer_eval_note",
    content: (
      <Message info >
    <Message.Header>Instructions</Message.Header>
    <div
      style={{ marginTop: 6 }}
      dangerouslySetInnerHTML={{
        __html: HTML_HELP[selectedType] ?? "This action type has no description yet.",
      }}
    />
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
      label: "HTML",
      placeHolder: "Page Html",
      name: "page_html",
      required: true,
    },
    {
      type: "input",
      label:
        "Upload Files (No spaces and ensure . prefix is added - Example: .png,.pdf,.txt, .doc, .docx)",
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

    if (isEdit) data.action_target = initialState.action_target;
    return data;

  };

  //Processing to be done before data is sent to the backend.
  const preChange = (formData, name, value) => {
    if (name === action_target) {
      if (isEdit) return formData; // cannot change type when editing
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
        preview={{
     enabled: true,
     title: "Action/Announcement Preview",
     render: (data) => (
       <div className="ui container">
         {/* Optional header area */}
         <div className="ui segment">
           <h3 style={{ marginTop: 0 }}>{data.action_title || "Untitled"}</h3>
           {data.short_desc && (
             <p style={{ opacity: 0.8 }}>{data.short_desc}</p>
           )}
           {/* Show which type and dates for clarity */}
           <div className="ui horizontal list" style={{ marginTop: 8 }}>
             <div className="item"><strong>Type:</strong>&nbsp;{data.action_target || "—"}</div>
             {data.start_date && (
               <div className="item"><strong>Start:</strong>&nbsp;{data.start_date}</div>
             )}
             {data.due_date && (
               <div className="item"><strong>Due:</strong>&nbsp;{data.due_date}</div>
             )}
             {data.announcement_end_date && (
               <div className="item"><strong>End:</strong>&nbsp;{data.announcement_end_date}</div>
             )}
           </div>
         </div>

         {/* Render the HTML exactly as it will appear */}
         <div className="ui segment">
           <InnerHTML html={data.page_html || "<p><i>No HTML content yet.</i></p>"} />
         </div>
       </div>
     ),
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
        preSubmit={preSubmit}
        callback={props.callback}
        errors={errors}
      />
    );
  }
}
