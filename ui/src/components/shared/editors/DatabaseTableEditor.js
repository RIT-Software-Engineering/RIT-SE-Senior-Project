import React, { useState, useEffect, useRef } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";

import {
  Dropdown,
  Label,
  Modal,
  Message,
  MessageHeader,
  MessageList,
  Icon,
} from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import PhoneInput from "react-phone-number-input/input";
import us from "react-phone-number-input/locale/en";
import ReactCodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { eclipseInit } from "@uiw/codemirror-theme-eclipse";
import QuestionBuilder from "./QuestionBuilder";

const MODAL_STATUS = {
  SUCCESS: "success",
  FAIL: "fail",
  SUBMISSION_ERROR: "submission_error",
  CLOSED: false,
};

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
  const [errors, setErrors] = useState(props.errors);
  const [errorSubmitted, setErrorSubmitted] = useState(false);
  const ignoreNextChangeRef = useRef(false);
  const [showPreview, setShowPreview] = useState(false);
  const formRef = useRef(null);
  const [formTouched, setFormTouched] = useState(false);
  const [readyToMark, setReadyToMark] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState(null);

  useEffect(() => {
    setFormData(initialState);
  }, [initialState]);
  useEffect(() => {
    setErrors(props.errors);
  }, [props.errors]);

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
        return {
          header: "Invalid Submission",
          content: submissionModalMessages["SUBMISSION_ERROR"],
          actions: [
            {
              content: "Cancel",
              positive: false,
              onClick: (event) => {
                handleCancel(event);
              },
            },
            {
              header: "Submission Error",
              content: "Try again",
              positive: true,
              onClick: (event) => {
                setSubmissionModalOpen(MODAL_STATUS.CLOSED);
                setFormData(formRef.current || initialState);
                setOpen(true);
              },
              key: 0,
            },
          ],
        };
      default:
        return;
    }
  };

  const closeSubmissionModal = () => {
    switch (submissionModalOpen) {
      case MODAL_STATUS.SUCCESS:
        setErrors([]);
        setFormTouched(false);
        setReadyToMark(false);
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        setOpen(false);
        if (props.callback) props.callback(true);
        if (props.reload) props.reloadData();
        break;
      case MODAL_STATUS.FAIL:
        setErrors([]);
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        if (props.callback) props.callback(false);
        break;
      case MODAL_STATUS.SUBMISSION_ERROR:
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        break;
      default:
        console.error(`MODAL_STATUS of '${submissionModalOpen}' not handled`);
    }
  };

  function hasError(fieldName) {
    return errors?.some(
      (error) =>
        error.name === fieldName ||
        (error.elements && error.elements.includes(fieldName)),
    );
  }

  function handleCancel() {
    if (formTouched && !props.viewOnly) {
      setPendingCloseAction(() => () => {
        setErrors([]);
        setFormData(initialState);
        formRef.current = null;
        setFormTouched(false);
        setOpen(false);
        // ✅ FIX 1: Only call isOpenCallback if it exists
        props.isOpenCallback?.(false);
      });
      setUnsavedModalOpen(true);
      return;
    }
    setErrors([]);
    setFormData(initialState);
    formRef.current = null;
    setFormTouched(false);
    setOpen(false);
    // ✅ FIX 1: Only call isOpenCallback if it exists
    props.isOpenCallback?.(false);
  }

  const markFormAsTouched = () => {
    if (ignoreNextChangeRef.current) {
      ignoreNextChangeRef.current = false;
      return;
    }
    if (!props.viewOnly && readyToMark) {
      setFormTouched(true);
    }
  };

  const handleChange = (e, { name, value, checked, isActiveField }) => {
    const field = formFieldArray.find((f) => f.name === name);
    if (field && field.disabled) return;
    markFormAsTouched();

    if (errorSubmitted) {
      setErrors((prevErrors) => {
        let newErrors = [...prevErrors];
        if (
          (name === "action_target" &&
            (value === "peer_evaluation" ||
              value === "coach_announcement" ||
              value === "student_announcement")) ||
          (name === "type" && (value === "admin" || value === "coach"))
        ) {
          newErrors = newErrors.filter((error) => error.name !== "short_desc");
        } else if (name === "action_target" && value === "break_period") {
          newErrors = newErrors.filter((error) => error.name !== "page_html");
        }
        newErrors = newErrors.filter(
          (error) =>
            error.name !== name &&
            (!error.elements || !error.elements.includes(name)),
        );
        return newErrors;
      });
    }

    if (props.viewOnly) return;
    if (checked !== undefined) {
      value = isActiveField ? (checked ? "" : false) : checked;
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
      setFormData({ ...formData, changed_fields: changedMap, [name]: value });
    }
  };

  function handleUpload(event, name) {
    markFormAsTouched();
    let value = event.target.files[0];
    const newFormData =
      props.preChange && props.preChange(formData, name, value);
    if (newFormData) {
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  const handleSubmit = async function (e) {
    e.preventDefault();

    let cleanedFormData = { ...formData };
    if (cleanedFormData.file_types) {
      cleanedFormData.file_types = cleanedFormData.file_types.replace(
        /\s+/g,
        "",
      );
    }

    const dataToSubmit = !!props.preSubmit
      ? props.preSubmit(cleanedFormData)
      : cleanedFormData;

    if (dataToSubmit === null) {
      formRef.current = cleanedFormData;
      setErrorSubmitted(true);
      setSubmissionModalOpen(MODAL_STATUS.SUBMISSION_ERROR);
      return;
    }

    setErrorSubmitted(false);
    let body = new FormData();
    if ("changed_fields" in dataToSubmit) {
      if (typeof dataToSubmit["changed_fields"] === "object") {
        dataToSubmit["changed_fields"] = JSON.stringify(
          dataToSubmit["changed_fields"],
        );
      }
    }
    Object.keys(dataToSubmit).forEach((key) => {
      if (key === "dataOnSubmit")
        dataToSubmit[key] = dataToSubmit[key] + date.toLocaleDateString();
      body.append(key, dataToSubmit[key]);
    });

    SecureFetch(submitRoute, { method: "post", body: body })
      .then((response) => {
        if (response.status === 200) {
          ignoreNextChangeRef.current = true;
          setFormTouched(false);
          setReadyToMark(false);
          setJustSaved(true);
          setSubmissionModalOpen(MODAL_STATUS.SUCCESS);
          formRef.current = null;
        } else {
          setSubmissionModalOpen(MODAL_STATUS.FAIL);
          formRef.current = null;
        }
      })
      .catch((error) => {
        console.error(error);
        setSubmissionModalOpen(MODAL_STATUS.FAIL);
      });
  };

  let fieldComponents = [];
  const requiresTypeFirst = formFieldArray.some(
    (f) => f.name === "action_target",
  );
  for (let i = 0; i < formFieldArray.length; i++) {
    let field = formFieldArray[i];
    if (
      requiresTypeFirst &&
      !formData.action_target &&
      field.name !== "action_target"
    )
      continue;
    if (!field.hidden) {
      switch (field.type) {
        case "input":
          if (
            (formData.action_target === "peer_evaluation" ||
              formData.action_target === "coach_announcement" ||
              formData.action_target === "student_announcement") &&
            (field.name === "file_types" ||
              field.name === "file_size" ||
              field.name === "short_desc")
          ) {
            break;
          } else if (
            formData.action_target === "break_period" &&
            (field.name === "file_types" || field.name === "file_size")
          ) {
            break;
          } else {
            if (field.name === "file_types" || field.name === "file_size") {
              fieldComponents.push(
                <Form.Field key={field.name}>
                  <Form.Input
                    label={field.label}
                    placeholder={field.placeholder}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={field.disabled}
                  />
                </Form.Field>,
              );
            } else {
              fieldComponents.push(
                <Form.Field
                  key={field.name}
                  required={field.required}
                  error={hasError(field.name)}
                >
                  <Form.Input
                    label={field.label}
                    placeholder={field.placeholder}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={field.disabled}
                    required={field.required}
                    error={hasError(field.name)}
                  />
                </Form.Field>,
              );
            }
          }
          break;
        case "phoneInput":
          fieldComponents.push(
            <Form.Field key={field.name} required={field.required}>
              <label>{field.label}</label>
              <PhoneInput
                onChange={(value) => {
                  handleChange(null, { name: field.name, value });
                }}
                value={formData[field.name]}
                labels={us}
                placeholder={field.placeholder}
                error={hasError(field.name)}
              />
            </Form.Field>,
          );
          break;
        case "date":
          fieldComponents.push(
            <Form.Field key={field.name} required={field.required}>
              <Form.Input
                label={field.label}
                type="date"
                placeholder={field.placeholder || "yyyy-mm-dd"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
                required={field.required}
                error={hasError(field.name)}
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
          } else if (formData.action_target !== "break_period") {
            fieldComponents.push(
              <Form.Field key={field.name} required={field.required}>
                <label style={{ color: field.disabled ? "lightgray" : "" }}>
                  {field.label}
                </label>
                <Form.TextArea
                  label={field.label}
                  as={ReactCodeMirror}
                  theme={modifiedEclipse}
                  onChange={
                    field.disabled
                      ? undefined
                      : (value) =>
                          handleChange(null, { name: field.name, value })
                  }
                  value={formData[field.name]}
                  maxHeight={"700px"}
                  extensions={[html({ autoCloseTags: true })]}
                  style={{
                    border: "1px solid #d4d4d5",
                    borderRadius: "5px",
                    padding: "10px",
                    minHeight: "200px",
                    backgroundColor: hasError(field.name) ? "#fab9b4" : "",
                    opacity: field.disabled ? 0.6 : 1,
                    pointerEvents: field.disabled ? "none" : "auto",
                  }}
                  required={field.required}
                  readOnly={field.disabled}
                />
              </Form.Field>,
            );
          }
          break;
        case "dropdown":
          if (field.name === "action_target") {
            fieldComponents.push(
              <Form.Field
                key={field.name}
                disabled={field.loading || field.disabled}
                required={field.required}
                error={hasError(field.name)}
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
            break;
          } else if (field.name === "semester_group") {
            const isRequired = formData.type === "student";
            fieldComponents.push(
              <Form.Field
                key={field.name}
                disabled={field.loading || field.disabled}
                required={isRequired}
                error={hasError(field.name)}
              >
                <label>{field.label}</label>
                <Dropdown
                  selection
                  options={field.options}
                  loading={field.loading}
                  disabled={field.loading || field.disabled}
                  value={formData[field.name] ?? field.nullValue}
                  name={field.name}
                  onChange={handleChange}
                />
              </Form.Field>,
            );
            break;
          } else {
            fieldComponents.push(
              <Form.Field
                key={field.name}
                disabled={field.loading || field.disabled}
                required={field.required}
                error={hasError(field.name)}
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
                formData[field["name"]].map((file) => (
                  <React.Fragment key={file.link}>
                    <a target="_blank" rel="noreferrer" href={file.link}>
                      {file.title}
                    </a>
                    <br />
                  </React.Fragment>
                ))
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
              <Form.Field
                key={field["name"]}
                required={field.required}
                error={hasError(field.name)}
              >
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
        case "note":
          if (field.content) {
            fieldComponents.push(
              <Form.Field key={field.name}>{field.content}</Form.Field>,
            );
          }
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
                  handleChange(e, { name, value, checked, isActiveField: true })
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

  const isProjectLocked = formFieldArray.some(
    (field) => field.name === "synopsis" && field.disabled,
  );

  const modalActions = () => {
    let mock = false;
    if (props.initialState.hasOwnProperty("mockUser")) {
      if (Object.entries(props.initialState.mockUser).length !== 0) mock = true;
    }
    if (props.viewOnly) return [{ key: "Close", content: "Close" }];
    if (isProjectLocked)
      return [
        {
          key: "cancel",
          content: "Cancel",
          onClick: (event) => handleCancel(event),
          color: "grey",
        },
      ];

    return [
      {
        key: "cancel",
        content: "Cancel",
        onClick: (event) => handleCancel(event),
        color: "grey",
      },
      ...(props.preview?.enabled && !!formData.action_target
        ? [
            {
              key: "preview",
              content: "Preview",
              icon: "eye",
              labelPosition: "right",
              onClick: openPreview,
            },
          ]
        : []),
      {
        key: "submit",
        content: mock
          ? `Submitting ${props.initialState.mockUser.fname} ${props.initialState.mockUser.lname} as ${props.initialState.user.fname} ${props.initialState.user.lname}`
          : "Submit",
        onClick: (event) => handleSubmit(event),
        labelPosition: "right",
        icon: "check",
        positive: true,
      },
    ];
  };

  let trigger = <Button content={props.content} icon={props.button} />;
  if (props.trigger) trigger = props.trigger;

  const suppressParentCloseRef = useRef(false);

  const openPreview = (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    suppressParentCloseRef.current = true;
    setShowPreview(true);
  };

  const closePreview = (e) => {
    e?.stopPropagation?.();
    setShowPreview(false);
    setTimeout(() => {
      suppressParentCloseRef.current = false;
    }, 300);
  };

  // ✅ FIX 2: Shared Unsaved Changes modal — rendered OUTSIDE both branches
  const unsavedChangesModal = (
    <Modal
      open={unsavedModalOpen}
      size="tiny"
      className="unsaved-modal"
      onClose={() => setUnsavedModalOpen(false)}
      closeOnDimmerClick={false}
      closeIcon
    >
      <Modal.Header>Unsaved Changes</Modal.Header>
      <Modal.Content>
        You have unsaved changes. Are you sure you want to close without saving?
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setUnsavedModalOpen(false)}>Keep Working</Button>
        <Button
          negative
          onClick={() => {
            setUnsavedModalOpen(false);
            pendingCloseAction?.();
          }}
        >
          Discard Changes
        </Button>
      </Modal.Actions>
    </Modal>
  );

  if (props.isOpenCallback) {
    return (
      <>
        <Modal
          closeOnDimmerClick={false}
          closeOnEscape={false}
          className={"sticky"}
          closeIcon={true}
          trigger={trigger}
          onClose={() => {
            if (justSaved) {
              setFormTouched(false);
              setJustSaved(false);
              setOpen(false);
              props.isOpenCallback(false); // ✅ safe here — we ARE in the isOpenCallback branch
              return;
            }
            if (formTouched && !props.viewOnly) {
              setOpen(false);
              setPendingCloseAction(() => () => {
                setErrors([]);
                setFormData(initialState);
                formRef.current = null;
                setFormTouched(false);
                setOpen(false);
                props.isOpenCallback(false); // ✅ safe here
              });
              setUnsavedModalOpen(true);
              return;
            }
            setOpen(false);
            props.isOpenCallback(false); // ✅ safe here
          }}
          onOpen={() => {
            setOpen(true);
            props.isOpenCallback(true);
            setFormTouched(false);
            setReadyToMark(false);
            setTimeout(() => setReadyToMark(true), 250);
            setJustSaved(false);
          }}
          open={open}
          header={props.header}
          content={{
            content: (
              <>
                {errors?.length > 0 && (
                  <div className="submission-errors">
                    <Message error>
                      <MessageHeader>
                        <Icon name="warning circle" /> Errors:
                      </MessageHeader>
                      <MessageList>
                        {errors.map((err) => (
                          <li key={err.name}>{err.message}</li>
                        ))}
                      </MessageList>
                    </Message>
                    <br />
                  </div>
                )}
                <Form onChange={markFormAsTouched}>{fieldComponents}</Form>
                {props.childComponents}
                {props.body}
              </>
            ),
          }}
          actions={modalActions()}
        />
        <Modal
          className={"stacked"}
          closeOnDimmerClick={false}
          size="tiny"
          open={!!submissionModalOpen}
          {...generateModalFields()}
          onClose={() => {
            suppressParentCloseRef.current = true;
            closeSubmissionModal();
            setTimeout(() => {
              suppressParentCloseRef.current = false;
            }, 100);
          }}
          dimmer="false"
          mountNode={document.body}
        />
        {props.preview?.enabled && (
          <Modal
            className="stacked"
            open={showPreview}
            size="large"
            onClose={closePreview}
            closeOnEscape
            closeOnDimmerClick={false}
            dimmer={false}
            mountNode={document.body}
            header={props.preview.title ?? "Preview"}
            style={{
              position: "fixed",
              top: "50%",
              left: "20%",
              transform: "translate(-50%,-50%)",
              margin: 0,
              zIndex: 2000,
            }}
            content={{
              content: (
                <div
                  style={{
                    padding: "1rem",
                    maxHeight: "70vh",
                    overflowY: "auto",
                  }}
                >
                  {props.preview.render?.(formData)}
                </div>
              ),
            }}
            actions={[
              {
                key: "close",
                content: "Close",
                onClick: (e) => {
                  e.stopPropagation();
                  closePreview(e);
                },
              },
            ]}
          />
        )}
        {/* ✅ FIX 2: Shared unsaved modal renders in both branches */}
        {unsavedChangesModal}
      </>
    );
  } else {
    return (
      <>
        <Modal
          closeOnDimmerClick={false}
          closeOnEscape={false}
          className={"sticky"}
          closeIcon={true}
          trigger={trigger}
          onClose={() => {
            if (justSaved) {
              setFormTouched(false);
              setJustSaved(false);
              setOpen(false);
              // ✅ FIX 1: NO props.isOpenCallback here — it doesn't exist in this branch
              return;
            }
            if (formTouched && !props.viewOnly) {
              setOpen(false);
              setPendingCloseAction(() => () => {
                setErrors([]);
                setFormData(initialState);
                formRef.current = null;
                setFormTouched(false);
                setOpen(false);
                // ✅ FIX 1: NO props.isOpenCallback here
              });
              setUnsavedModalOpen(true);
              return;
            }
            setOpen(false);
            // ✅ FIX 1: NO props.isOpenCallback here
          }}
          onOpen={() => {
            setOpen(true);
            setFormTouched(false);
            setReadyToMark(false);
            setTimeout(() => setReadyToMark(true), 250);
            setJustSaved(false);
          }}
          open={open}
          header={props.header}
          content={{
            content: (
              <>
                {errors?.length > 0 && (
                  <div className="submission-errors">
                    <Message error>
                      <MessageHeader>
                        <Icon name="warning circle" /> Errors:
                      </MessageHeader>
                      <MessageList>
                        {errors.map((err) => (
                          <li key={err.name}>{err.message}</li>
                        ))}
                      </MessageList>
                    </Message>
                    <br />
                  </div>
                )}
                <Form onChange={markFormAsTouched}>{fieldComponents}</Form>
                {props.childComponents}
                {props.body}
              </>
            ),
          }}
          actions={modalActions()}
        />
        {props.preview?.enabled && (
          <Modal
            open={showPreview}
            size="large"
            onClose={closePreview}
            closeOnEscape
            closeOnDimmerClick={false}
            header={props.preview.title ?? "Preview"}
            content={{
              content: (
                <div
                  style={{
                    padding: "1rem",
                    maxHeight: "70vh",
                    overflowY: "auto",
                  }}
                >
                  {props.preview.render?.(formData)}
                </div>
              ),
            }}
            actions={[
              {
                key: "close",
                content: "Close",
                onClick: (e) => {
                  e.stopPropagation();
                  closePreview(e);
                },
              },
            ]}
          />
        )}
        <Modal
          className={"stacked"}
          closeOnDimmerClick={false}
          closeIcon={true}
          size="tiny"
          open={!!submissionModalOpen}
          {...generateModalFields()}
          onClose={() => {
            closeSubmissionModal();
            setFormTouched(false);
          }}
        />
        {/* ✅ FIX 2: Shared unsaved modal renders in both branches */}
        {unsavedChangesModal}
      </>
    );
  }
}
