import React, { useState, useEffect } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { Dropdown, Header, Label, Modal, Message, MessageHeader, Icon, MessageList } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import PhoneInput from "react-phone-number-input/input";
import us from "react-phone-number-input/locale/en";
import { Dropdown as SemanticDropdown } from "semantic-ui-react";
import ReactCodeMirror, {
  oneDark,
  oneDarkHighlightStyle,
} from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { eclipseInit } from "@uiw/codemirror-theme-eclipse";
import QuestionBuilder from "./QuestionBuilder";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", SUBMISSION_ERROR: "submission_error", CLOSED: false };

const modifiedEclipse = eclipseInit({ settings: { caret: "#000000" } });

export default function DatabaseTableEditor(props) {
  let initialState = props.initialState;
  let submissionModalMessages = props.submissionModalMessages;
  let submitRoute = props.submitRoute;
  let formFieldArray = props.formFieldArray;
  let date = new Date();


  const [submissionModalOpen, setSubmissionModalOpen] = useState(
    MODAL_STATUS.CLOSED,
  );
  const [formData, setFormData] = useState(initialState);
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState(new Set());

  // Update initial state if provided initial state is changed
  useEffect(() => {
    setFormData(initialState);
  }, [initialState]);

  const generateModalFields = () => {
    switch (submissionModalOpen) {
      case MODAL_STATUS.SUCCESS:
        return {
          header: "Success",
          content: submissionModalMessages["SUCCESS"],
          actions: [
            { header: "Success!", content: "Close", positive: true, key: 0 },
          ],
        };
      case MODAL_STATUS.FAIL:
        return {
          header: "There was an issue...",
          content: submissionModalMessages["FAIL"],
          actions: [
            {
              header: "There was an issue",
              content: "Cancel",
              positive: true,
              key: 0,
            },
          ],
        };
      
      case MODAL_STATUS.SUBMISSION_ERROR:
        return{
          header: "Invalid Submission",
          content: submissionModalMessages["SUBMISSON_ERROR"],
          actions: [
            {
              content: "Cancel", 
              positive: false, 
              onClick: (event) => {handleCancel(event);}
            },
            {
              header: "Submission Error",
              content: "Try again",
              positive: true,
              onClick: (event) => {
                setSubmissionModalOpen(MODAL_STATUS.CLOSED);
                setOpen(true);
              },
              key: 0,
            }
          ]
        };
      default:
        return;
    }
  };

  const closeSubmissionModal = () => {
    switch (submissionModalOpen) {
      case MODAL_STATUS.SUCCESS:
        setErrors([]);
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        if (props.reload) {
          props.reloadData();
        }
        break;
      case MODAL_STATUS.FAIL:
        setErrors([]);
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        break;
      case MODAL_STATUS.SUBMISSION_ERROR:
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        break;
      default:
        console.error(`MODAL_STATUS of '${submissionModalOpen}' not handled`);
    }
  };

  function handleCancel() {
    setErrors([]);
    setErrorFields(new Set());
    setFormData(initialState);
    setOpen(false);
  }

  const handleSubmit = async function (e) {
    e.preventDefault();
    let errors = [];

    // Error Handling 

    // Don't track short_desc if certain action targets are chosen.
    if (formData.action_target !== "peer_evaluation" && formData.action_target !== "student_announcement" && formData.action_target !== "coach_announcement"){
      // check for short_desc
      if (formData.short_desc === ""){
        errors.push("Please provide a short description (short_desc)")
        errorFields.add("short_desc");
      }
    }

     // check for page_html
     if (formData.page_html === ""){
      errors.push("Please provide the HTML (page_html)")
      errorFields.add("page_html");
    }
    // date validation only if both start and due date are given.
    if (formData.start_date && formData.due_date){
      if (formData.start_date > formData.due_date){
        errors.push("The Start Date must be before the Due Date");
        errorFields.add("start_date");
        errorFields.add("due_date");
      }
    }
    // check whether Active checkbox is checked or not.
    if (formData.date_deleted === false){
      errors.push("Please check the Active box");
      errorFields.add("date_deleted");
    }

    if (errors.length > 0) {
      setErrors(errors);
      setSubmissionModalOpen(MODAL_STATUS.SUBMISSION_ERROR);
      return;
    }

    const dataToSubmit = !!props.preSubmit
      ? props.preSubmit(formData)
      : formData;

    let body = new FormData();
    //console.log(submitRoute);
    if ("changed_fields" in dataToSubmit) {
      if (typeof dataToSubmit["changed_fields"] === "object") {
        dataToSubmit["changed_fields"] = JSON.stringify(
          dataToSubmit["changed_fields"],
        );
      }
    }
    Object.keys(dataToSubmit).forEach((key) => {
      if (key === "dataOnSubmit") {
        dataToSubmit[key] = dataToSubmit[key] + date.toLocaleDateString();
      }
      body.append(key, dataToSubmit[key]);
    });
    SecureFetch(submitRoute, {
      method: "post",
      body: body,
    })
      .then((response) => {
        if (response.status === 200) {
          setSubmissionModalOpen(MODAL_STATUS.SUCCESS);
        } else {
          setSubmissionModalOpen(MODAL_STATUS.FAIL);
        }
        if (props.callback) {
          props.callback();
        }
      })
      .catch((error) => {
        setSubmissionModalOpen(Modal.STATUS.FAIL);
      });
  };

  // PLANNING: Replicate this idea in the student view of editing
  // So that the fourm saves the data in the same way as the admin view when closed and reoened
  const handleChange = (e, { name, value, checked, isActiveField }) => {

    setErrorFields(prevErrorFields => {
      const newErrorFields = new Set(prevErrorFields);
      
      if (value !== "") {
        if ((name === "start_date" || name === "due_date")){
          newErrorFields.delete("start_date");
          newErrorFields.delete("due_date");
        }
        newErrorFields.delete(name);
      } else {
        newErrorFields.add(name);
      }
      
      return newErrorFields;
    });
    if (props.viewOnly) {
      return;
    }
    if (checked !== undefined) {
      if (isActiveField) {
        // The active field either stores an empty string or a datetime.
        // The datetime is set by the server if the active field is set to 'false'.
        value = checked ? "" : false;
      } else {
        value = checked;
      }
    }
    const newFormData =
      props.preChange &&
      props.preChange(formData, name, value, checked, isActiveField, e);
    if (newFormData) {
      setFormData(newFormData);
    } else {
      let changedMap = {
        ...formData["changed_fields"],
        [name]: [initialState[name], value],
      };
      setFormData({
        ...formData,
        ["changed_fields"]: changedMap,
        [name]: value,
      });
    }
  };

  function handleUpload(event, name) {
    let value = event.target.files[0];
    const newFormData =
      props.preChange && props.preChange(formData, name, value);

    if (newFormData) {
      setFormData(newFormData);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  /**
   * This is how the edit table for any form of editing is made and filled with the initial state.
   * The initial state is renamed to 'formData', and field(aka formFieldArray, the fields that are populated from
   * other editor.js files, will contain the name of the column being queried from the db.
   * */
  let fieldComponents = [];
  for (let i = 0; i < formFieldArray.length; i++) {
    let field = formFieldArray[i];

    if (!field.hidden) {
      switch (field.type) {
        case "input":
          if (formData.action_target === "peer_evaluation" || formData.action_target === "coach_announcement" || formData.action_target === "student_announcement") { // hide input fields if peer_eval / announcements are chosen.
            // display the Action Title input
            if (field.name === 'action_title'){
              fieldComponents.push(
                <Form.Field key={field.name}>
                <Form.Input
                  label={field.label}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={field.disabled}
                  required
                />
              </Form.Field>,
              );
            }
          }
          else{
            fieldComponents.push(
              <Form.Field key={field.name}>
                <Form.Input
                  label={field.label}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={field.disabled}
                  required
                  error={errorFields.has(field.name)}
                />
              </Form.Field>,
            );
          }
          break;
        case "phoneInput":
          fieldComponents.push(
            <Form.Field key={field.name}>
              <label>{field.label}</label>
              <PhoneInput
                onChange={(value) => {
                  handleChange(null, { name: field.name, value: value });
                }}
                value={formData[field.name]}
                labels={us}
                placeholder={field.placeholder}
              />
            </Form.Field>,
          );
          break;
        case "date":
          fieldComponents.push(
            <Form.Field key={field.name} required>
              <Form.Input
                label={field.label}
                type="date"
                placeholder={field.placeholder || "yyyy-mm-dd"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
                error={errorFields.has(field.name)}
                required
              />
            </Form.Field>,
          );
          break;
        case "textArea":
          if (formData.action_target === "peer_evaluation") {
            fieldComponents.push(
              <QuestionBuilder
                field={field}
                data={formData}
                onChange={handleChange}
                value={formData[field.name]}
              />,
            );
          } else {
            fieldComponents.push(
              <Form.Field key={field.name} required>
                <label>{field.label}</label>
                <Form.TextArea
                  label={field.label}
                  as={ReactCodeMirror}
                  theme={modifiedEclipse}
                  onChange={(value) =>
                    handleChange(null, { name: field.name, value: value })
                  }
                  value={formData[field.name]}
                  maxHeight={"700px"}
                  extensions={[html({ autoCloseTags: true })]}
                  style={{
                    border: "1px solid #d4d4d5",
                    borderRadius: "5px",
                    padding: "10px",
                    minHeight: "200px",
                    backgroundColor: errorFields.has(field.name) ? "#fa8c8c" : "",
                  }}
                  required
                />
              </Form.Field>,
            );
          }
          break;
        // TODO: Add a new type for the forum builder
        case "dropdown":
          if (
            (formData.type === "coach" || formData.type === "admin") &&
            (field.label === "Semester/Project" || field.label === "Semester")
          ) {
          } else {
            fieldComponents.push(
              <Form.Field
                key={field.name}
                disabled={field.loading || field.disabled}
              >
                <label>{field.label}</label>
                <Dropdown
                  selection
                  options={field.options}
                  loading={field.loading}
                  disabled={field.loading || field.disabled}
                  value={formData[field.name] || field.nullValue}
                  name={field.name}
                  onChange={handleChange}
                />
              </Form.Field>,
            );
          }
          break;
        case "checkbox":
          if (field.disabled) {
            fieldComponents.push(
              <Form.Field key={field["name"]}>
                <label style={{ color: "lightgray" }}>{field.label}</label>
                <Form.Checkbox
                  label={field["label"]}
                  checked={!!formData[field["name"]]}
                  name={field["name"]}
                  onChange={handleChange}
                  disabled={true}
                />
              </Form.Field>,
            );
            break;
          }
          fieldComponents.push(
            <Form.Field key={field["name"]}>
              <label>{field.label}</label>
              <Form.Checkbox
                label={field["label"]}
                checked={!!formData[field["name"]]}
                name={field["name"]}
                onChange={handleChange}
                disabled={false}
              />
            </Form.Field>,
          );
          break;
        case "files":
          fieldComponents.push(
            <Form.Field key={field["name"]}>
              <label>{field.label}</label>
              {formData[field["name"]].length > 0 ? (
                formData[field["name"]].map((file) => {
                  return (
                    <React.Fragment key={file.link}>
                      <a target="_blank" rel="noreferrer" href={file.link}>
                        {file.title}
                      </a>
                      <br />
                    </React.Fragment>
                  );
                })
              ) : (
                <p>No Attachments</p>
              )}
            </Form.Field>,
          );
          break;
        case "upload":
          if (field.disabled) {
            fieldComponents.push(
              <Form.Field key={field["name"]}>
                <label style={{ color: "lightgray" }}>{field.label}</label>
                <input
                  type="file"
                  onChange={(event) => handleUpload(event, field.name)}
                  accept={field.accept}
                  disabled={true}
                />
              </Form.Field>,
            );
          } else {
            fieldComponents.push(
              <Form.Field key={field["name"]}>
                <label>{field.label}</label>
                <input
                  type="file"
                  onChange={(event) => handleUpload(event, field.name)}
                  accept={field.accept}
                  disabled={false}
                />
              </Form.Field>,
            );
          }
          break;
        case "multiSelectDropdown":
          fieldComponents.push(
            <Form.Field
              key={field.name}
              disabled={field.loading || field.disabled}
            >
              <label>{field.label}</label>
              <Dropdown
                multiple
                search
                selection
                placeholder={field.name}
                options={field.options}
                loading={field.loading}
                disabled={field.loading || field.disabled}
                value={formData[field.name]}
                name={field.name}
                onChange={handleChange}
              />
            </Form.Field>,
          );
          break;
        case "searchDropdown":
          fieldComponents.push(
            <Form.Field
              key={field.name}
              disabled={field.loading || field.disabled}
            >
              <label>{field.label}</label>
              <Dropdown
                search
                selection
                placeholder={field.name}
                options={field.options}
                loading={field.loading}
                disabled={field.loading || field.disabled}
                value={formData[field.name]}
                name={field.name}
                onChange={handleChange}
              />
            </Form.Field>,
          );
          break;
        case "activeCheckbox":
          fieldComponents.push(
            <Form.Field key={field["name"]}>
              {formData[field["name"]] !== "" && (
                <Label>
                  Deactivated at: {formData[field["name"]] || "now"}
                </Label>
              )}
              <Form.Checkbox
                label={field["label"]}
                checked={formData[field["name"]] === ""}
                name={field["name"]}
                onChange={(e, { name, value, checked }) =>
                  handleChange(e, {
                    name,
                    value,
                    checked,
                    isActiveField: true,
                  })
                }
                disabled={field.disabled}
              />
            </Form.Field>,
          );
          break;
        default:
          console.warn(`Found unknown field type: "${field.type}"`);
          break;
      }
    }
  }

  const modalActions = () => {
    let mock = false;

    if (props.initialState.hasOwnProperty("mockUser")) {
      if (Object.entries(props.initialState.mockUser).length !== 0) {
        mock = true;
      }
    }
    if (props.viewOnly) {
      return [
        {
          key: "Close",
          content: "Close",
        },
      ];
    }
    return [
      {
        key: "cancel",
        content: "Cancel",
        onClick: (event) => handleCancel(event),
        positive: true,
        style: { backgroundColor: "grey" },
      },
      {
        key: "submit",

        content: mock
          ? `Submitting ${props.initialState.mockUser.fname} ${props.initialState.mockUser.lname} as ${props.initialState.user.fname} ${props.initialState.user.lname}`
          : "Submit",
        onClick: (event) => handleSubmit(event),
        positive: true,
      },
    ];
  };
  let trigger = <Button content={props.content} icon={props.button} />;
  if (props.trigger) {
    trigger = props.trigger;
  }

  if (props.isOpenCallback) {
    return (
      <>
        <Modal
          closeOnDimmerClick={false}
          className={"sticky"}
          trigger={trigger}
          onClose={() => {
            console.log("OnClose triggered");
            setOpen(false);
            props.isOpenCallback(false);
          }}
          onOpen={() => {
            console.log("onOpen triggered");
            setOpen(true);
            props.isOpenCallback(true);
          }}          
          open={open}
          header={props.header}
          content={{
            content: (
              <>
                {errors.length > 0 && (
                  <div className="submission-errors">
                    <Message error>
                      <MessageHeader>
                        <Icon name="warning circle" /> Errors:
                      </MessageHeader>
                      <MessageList>
                        {errors.map((err) => (
                          <li key={err}>{err}</li>
                        ))}
                      </MessageList>
                    </Message>
                    <br/>
                  </div>
                  )}
                <Form>{fieldComponents}</Form>
                {props.childComponents}
                {props.body}
              </>
            ),
          }}
          actions={modalActions()}
        />
        <Modal
          className={"sticky"}
          size="tiny"
          open={!!submissionModalOpen}
          {...generateModalFields()}
          onClose={() => closeSubmissionModal()}
        />
      </>
    );
  } else {
    return (
      <>
        <Modal
          closeOnDimmerClick={false}
          className={"sticky"}
          trigger={trigger}
          onClose={() => {
            setOpen(false)
          }}
          onOpen={() => {
            setOpen(true)
          }}
          open={open}
          header={props.header}
          content={{
            content: (
              <>
                {errors.length > 0 && (
                <div className="submission-errors">
                  <Message error>
                    <MessageHeader>
                      <Icon name="warning circle" /> Errors:
                    </MessageHeader>
                    <MessageList>
                      {errors.map((err) => (
                        <li key={err}>{err}</li>
                      ))}
                    </MessageList>
                  </Message>
                  <br/>
                </div>)}
                <Form>{fieldComponents}</Form>
                {props.childComponents}
                {props.body}
              </>
            ),
          }}
          actions={modalActions()}
        />
        <Modal
          className={"sticky"}
          size="tiny"
          open={!!submissionModalOpen}
          {...generateModalFields()}
          onClose={() => closeSubmissionModal()}
        />
      </>
    );
  }
}
