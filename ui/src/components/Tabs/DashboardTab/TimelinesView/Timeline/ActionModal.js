import React, { useContext, useRef, useState, useEffect } from "react";
import {
  Button,
  Form,
  Icon,
  Input,
  Loader,
  Message,
  MessageHeader,
  MessageList,
  Modal,
} from "semantic-ui-react";
import {
  ACTION_TARGETS,
  config,
  DEFAULT_UPLOAD_LIMIT,
  USERTYPES,
} from "../../../../util/functions/constants";
import { SecureFetch } from "../../../../util/functions/secureFetch";
import {
  formatDateTime,
  humanFileSize,
} from "../../../../util/functions/utils";
import { UserContext } from "../../../../util/functions/UserContext";
import InnerHTML from "dangerously-set-html-content";
import ParsedInnerHTML from "../../../../util/components/ParsedInnerHtml";
import CoachFeedBack from "../../../../util/components/CoachFeedBack";
import { QuestionComponentsMap } from "../../../../util/components/PeerEvalComponents";
import "./../../../../../css/utils/helpers.css";

const MODAL_STATUS = {
  SUCCESS: "success",
  FAIL: "fail",
  SUBMITTING: "submitting",
  CLOSED: false,
};

const camelCaseToSentence = (string = "") =>
  string.replaceAll(/([A-Z])/g, (word) => ` ${word}`).trimStart();

export default function ActionModal(props) {
  console.log("ActionModal rendered");
  const { user } = useContext(UserContext);
  const [open, setOpen] = React.useState(props.open || false);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(
    MODAL_STATUS.CLOSED,
  );
  useEffect(() => {
    setOpen(props.open || false);
    if (props.open) {
      props.isOpenCallback?.(true);
      fetchStudentNames();
      setFormTouched(false);
      setReadyToMark(false);
      setTimeout(() => setReadyToMark(true), 250);
    }
  }, [props.open]);
  const [submissionModalResponse, setSubmissionModalResponse] = useState(
    "We were unable to receive your submission.",
  );
  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState(new Set());
  const filesRef = useRef();
  const [studentOptions, setStudentOptions] = useState([]);
  const [formTouched, setFormTouched] = useState(false);
  const [readyToMark, setReadyToMark] = useState(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState(null);
  const isPeerEval = props.action_target === ACTION_TARGETS.peer_evaluation;

  const fetchStudentNames = () => {
    if (user.role === USERTYPES.STUDENT) {
      let url = config.url.API_GET_PROJECT_STUDENT_NAMES;
      SecureFetch(`${url}?project_id=${props.projectId}`)
        .then((response) => response.json())
        .then((data) => {
          const combinedNames = data.map(
            (student) => `${student.fname} ${student.lname}`,
          );
          setStudentOptions(combinedNames);
        })
        .catch((err) => {
          console.error("Failed to get students", err);
        });
    } else {
      setStudentOptions(["Student 1", "Student 2", "Student 3", "Student 4"]);
    }
  };

  function translateStudentPeerEvalData(formData) {
    const translation = {
      CoachFeedback: {},
      Students: {},
      Submitter: user.isMock
        ? `${user.mockUser.fname} ${user.mockUser.lname}`
        : `${user.fname} ${user.lname}`,
    };

    for (const key in formData) {
      let [category, header, student] = key.split("-");
      let value = formData[key];
      const isFeedback = category === "Feedback";
      const isSwitch = category === "Scale";
      const scale = 5 / 3;

      header = camelCaseToSentence(header);
      value = isFeedback ? value.trim() : parseInt(value);

      if (isFeedback && student === "Anon") {
        translation.CoachFeedback[header] = value;
        continue;
      }

      if (!translation.Students[student]) {
        translation.Students[student] = { Feedback: {}, Ratings: {} };
      }

      const hasRatings =
        translation.Students[student].Ratings[header] !== undefined;

      if (isFeedback) {
        translation.Students[student].Feedback[header] = value;
      } else if (isSwitch) {
        if (!hasRatings) {
          translation.Students[student].Ratings[header] = scale;
        } else {
          const old = translation.Students[student].Ratings[header];
          translation.Students[student].Ratings[header] = Math.floor(
            old * scale,
          );
        }
      } else {
        if (
          hasRatings &&
          translation.Students[student].Ratings[header] === scale
        ) {
          translation.Students[student].Ratings[header] *= value;
        } else {
          translation.Students[student].Ratings[header] = value;
        }
      }
    }

    return translation;
  }

  const markFormAsTouched = () => {
    if (readyToMark) {
      setFormTouched(true);
    }
  };

  function translateCoachPeerEvalFeedbackData(formData) {
    const translation = { Submitter: "COACH", Students: {} };

    for (const key in formData) {
      let [category, header, student] = key.split("-");
      console.log(student);
      if (student === undefined) {
        console.error(`Incorrect Name Formatting ${key}. Not Parsable`);
        continue;
      }

      let value = formData[key];

      if (!translation.Students[student]) {
        translation.Students[student] = {
          Feedback: "",
          UsedAI: false,
          AverageRatings: {},
          SelfRating: {},
        };
      }

      const StudentData = translation.Students[student];

      switch (category) {
        case "CoachFeedback":
          StudentData.Feedback = value;
          break;
        case "AverageFeedback":
          StudentData.AverageRatings[header] = value;
          break;
        case "UsedAI":
          StudentData.UsedAI = value === "2";
          break;
        case "SelfFeedback":
          StudentData.SelfRating[header] = value;
          break;
        default:
          break;
      }
    }

    return translation;
  }

  function openUnsavedModal(onDiscard) {
    setPendingCloseAction(() => onDiscard);
    setUnsavedModalOpen(true);
  }

  const generateModalFields = () => {
    switch (submissionModalOpen) {
      case MODAL_STATUS.SUCCESS:
        return {
          header: "Success",
          content: submissionModalResponse,
          actions: [
            { header: "Success!", content: "Close", positive: true, key: 0 },
          ],
        };
      case MODAL_STATUS.FAIL:
        return {
          header: "There was an issue...",
          content: submissionModalResponse,
          actions: [
            {
              header: "There was an issue",
              content: "Cancel",
              positive: true,
              key: 0,
            },
          ],
        };
      case MODAL_STATUS.SUBMITTING:
        return {
          header: "Submitting...",
          content: submissionModalResponse,
          actions: [
            {
              header: "Submitting the action",
              content: "Cancel",
              positive: true,
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
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        break;
      case MODAL_STATUS.FAIL:
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        break;
      case MODAL_STATUS.SUBMITTING:
        setErrors([]);
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        break;
      default:
        console.error(`MODAL_STATUS of '${submissionModalOpen}' not handled`);
    }
    setOpen(false);
    props.isOpenCallback(false);
  };

  async function onActionSubmit(id, file_types) {
    let form = document.forms.item(0);
    if (form !== null && form !== undefined) {
      let body = new FormData();
      body.append("action_template", props.action_id);
      body.append("project", props.projectId);

      let formData = {};
      const formDataInputs = document.forms[0].elements;

      const isRequiredAndEmpty = (input) =>
        formDataInputs[input]?.required &&
        formDataInputs[input]?.name &&
        (!formDataInputs[input]?.value ||
          !formDataInputs[formDataInputs[input].name]?.value ||
          (formDataInputs[input]?.name.startsWith("Table") &&
            formDataInputs[input]?.value === "0"));

      let errors = [];
      let errorsSet = new Set();
      let errorFields = new Set();

      for (let x = 0; x < formDataInputs.length; x++) {
        if (isPeerEval) {
          const input = formDataInputs[x],
            inputName = formDataInputs[x].name,
            inputType = formDataInputs[x].type;

          if (inputType === "radio") {
            if (input.checked) {
              formData[inputName] = String(parseInt(input.value) + 1);
            }
          } else {
            formData[inputName] = String(input?.value);
          }

          const [questionType, questionName, studentName] =
            inputName.split("-");
          const questionSetKey = questionType + questionName;
          const isEmpty = isRequiredAndEmpty(x);
          const hasDoneError = errorsSet.has(questionSetKey);

          if (!isEmpty) continue;

          switch (questionType) {
            case "Feedback":
            case "Mood":
              errorFields.add(inputName);
              break;
            case "Table":
              errorFields.add(questionName);
              break;
            default:
              errorFields.add(inputName);
              break;
          }

          if (hasDoneError) continue;

          if (questionType === "Table") {
            errors.push(
              `'${camelCaseToSentence(questionName)}' column is required to be filled out.`,
            );
            errorsSet.add(questionSetKey);
          } else if (questionType === "Feedback") {
            if (studentName === "Anon") {
              errors.push(
                `'${camelCaseToSentence(questionName)}' feedback is required.`,
              );
            } else {
              errors.push(
                `'${camelCaseToSentence(questionName)}' feedback is required for all students.`,
              );
              errorsSet.add(questionSetKey);
            }
          } else if (questionType === "Mood") {
            errors.push(
              `'${camelCaseToSentence(questionName)}' question is required to be answered.`,
            );
            errorsSet.add(questionSetKey);
          } else {
            errors.push(
              `'${camelCaseToSentence(questionName)}' feedback is required to be given for all students.`,
            );
            errorsSet.add(questionSetKey);
          }

          continue;
        } else {
          if (!formDataInputs[x].name) continue;
          if (isRequiredAndEmpty(x) && !errorsSet.has(formDataInputs[x].name)) {
            errors.push(`"${formDataInputs[x].name}" is required`);
            errorsSet.add(formDataInputs[x].name);
          }
          formData[formDataInputs[x].name] =
            formDataInputs[formDataInputs[x].name]?.value;
        }
      }

      if (isPeerEval) {
        for (let x = 0; x < formDataInputs.length; x++) {
          const input = formDataInputs[x];
          if (input.type === "radio" && input.checked) {
            formData[input.name] = input.value;
          }
        }
      }

      const formFiles = filesRef.current?.inputRef?.current?.files || [];
      if (file_types && formFiles.length === 0)
        errors.push("You must upload files");

      if (errors.length > 0) {
        setErrors(errors);
        setErrorFields(errorFields);
        return;
      }

      if (isPeerEval) {
        if (user.role === USERTYPES.STUDENT) {
          formData = translateStudentPeerEvalData(formData);
        } else if (user.role === USERTYPES.COACH) {
          formData = translateCoachPeerEvalFeedbackData(formData);
        }
      }

      body.append("form_data", JSON.stringify(formData));
      for (let i = 0; i < formFiles?.length || 0; i++) {
        body.append("attachments", formFiles[i]);
      }

      setSubmissionModalResponse(
        <div className={"content"}>
          <Loader
            className={"workaround"}
            indeterminate
            active
            inverted
            inline={"centered"}
          >
            Uploading Files
          </Loader>
        </div>,
      );
      setSubmissionModalOpen(MODAL_STATUS.SUBMITTING);

      SecureFetch(config.url.API_POST_SUBMIT_ACTION, {
        method: "post",
        body: body,
      })
        .then((response) => {
          if (response.status === 200) {
            setSubmissionModalResponse("Your submission has been received.");
            setSubmissionModalOpen(MODAL_STATUS.SUCCESS);
            props.isOpenCallback(false);
          } else {
            response.text().then((data) => {
              setSubmissionModalResponse(
                data || "We were unable to receive your submission.",
              );
            });
            setSubmissionModalOpen(MODAL_STATUS.FAIL);
          }
          props.reloadTimelineActions();
        })
        .catch((error) => {
          console.error(error);
          setSubmissionModalResponse(
            "We were unable to receive your submission.",
          );
          setSubmissionModalOpen(MODAL_STATUS.FAIL);
        });
    }
  }

  function fileUpload(fileTypes, fileSize) {
    return (
      fileTypes && (
        <Form>
          <Form.Field required>
            <label className="file-submission-required">
              File Submission (Accepted: {fileTypes.split(",").join(", ")}) (Max
              size of each file:{" "}
              {humanFileSize(fileSize || DEFAULT_UPLOAD_LIMIT, false, 0)})
            </label>
            <Input
              fluid
              required
              ref={filesRef}
              type="file"
              accept={fileTypes}
              multiple
              onChange={markFormAsTouched}
            />
          </Form.Field>
        </Form>
      )
    );
  }

  function onActionCancel() {
    if (formTouched && !props.viewOnly) {
      openUnsavedModal(() => {
        setErrors([]);
        setFormTouched(false);
        setOpen(false);
        props.isOpenCallback(false);
      });
    } else {
      setErrors([]);
      setOpen(false);
      props.isOpenCallback(false);
      setFormTouched(false);
    }
  }

  const submitButton =
    props?.state === "grey" ? (
      ` This action can be submitted on ${formatDateTime(props.start_date)}`
    ) : (
      <Button
        className="offset-outline"
        content={
          user.isMock
            ? `Submitting ${user.mockUser.fname} ${user.mockUser.lname} as ${user.fname} ${user.lname}`
            : "Submit"
        }
        labelPosition="right"
        icon="checkmark"
        onClick={() => {
          onActionSubmit(props.id, props.file_types);
        }}
        positive
      />
    );

  const renderSubmitButton = () => {
    if (user.view_only || user.mockUser.view_only === "TRUE")
      return " View Only Role";
    switch (props.action_target) {
      case ACTION_TARGETS.admin:
        return user.role === USERTYPES.ADMIN
          ? submitButton
          : " Admin Actions are Available Only to Admins";
      case ACTION_TARGETS.coach:
        return user.role === USERTYPES.COACH
          ? submitButton
          : " Coach Actions are Available Only to Coaches";
      case ACTION_TARGETS.individual:
        return user.role === USERTYPES.STUDENT
          ? submitButton
          : " Individual Actions are Available Only to Students";
      default:
        return submitButton;
    }
  };

  const unsavedChangesModal = (
    <Modal
      open={unsavedModalOpen}
      size="tiny"
      className="unsaved-modal"
      closeOnDimmerClick={false}
      closeOnEscape={false}
      closeIcon
      onClose={() => setUnsavedModalOpen(false)}
    >
      <Modal.Header>Unsaved Changes</Modal.Header>
      <Modal.Content>
        You have unsaved work. Are you sure you want to close without
        submitting?
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
          Discard Work
        </Button>
      </Modal.Actions>
    </Modal>
  );

  if (isPeerEval && user.role === USERTYPES.COACH) {
    return (
      <>
        <Modal
          closeOnDimmerClick={true}
          closeOnEscape={false}
          closeIcon={true}
          className={"sticky"}
          onClose={() => {
            console.log("modal open");
            setOpen(true);
            props.isOpenCallback(true);
            fetchStudentNames();
            setFormTouched(false);
            setReadyToMark(false);
            setTimeout(() => {
              if (formTouched && !props.viewOnly) {
                openUnsavedModal(() => {
                  setErrors([]);
                  setFormTouched(false);
                  setOpen(false);
                  props.isOpenCallback(false);
                });
              } else {
                setOpen(false);
                props.isOpenCallback(false);
                setFormTouched(false);
              }
            }, 0);
          }}
          onOpen={() => {
            console.log("ACTION MODAL OPEN");
            setOpen(true);
            props.isOpenCallback(true);
            setFormTouched(false);
            setReadyToMark(false);
            setTimeout(() => setReadyToMark(true), 250);
          }}
          open={open}
          trigger={
            props.trigger || (
              <Button
                ref={props.ref}
                fluid
                className="view-action-button"
                onClick={() => console.log("trigger clicked")}
              >
                View Action
              </Button>
            )
          }
        >
          <Modal.Header>{props.action_title}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {props.preActionContent}
              <br />
              <div
                className="content"
                onChange={markFormAsTouched}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!readyToMark) return;
                  const target = e.target;
                  if (
                    target.type === "radio" ||
                    target.closest("label[for]") ||
                    target.tagName === "LABEL" ||
                    target.classList.contains("icon")
                  ) {
                    markFormAsTouched();
                  }
                }}
                onInput={markFormAsTouched}
              >
                <CoachFeedBack
                  team={props.projectId}
                  action_id={props.action_id}
                />
                {errors.length > 0 && (
                  <div className="submission-errors">
                    <br />
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
                  </div>
                )}
              </div>
            </Modal.Description>
            <Modal
              closeOnDimmerClick={true}
              closeIcon={true}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              open={!!submissionModalOpen}
              {...generateModalFields()}
              onClose={() => closeSubmissionModal()}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              className="offset-outline"
              color="grey"
              onClick={onActionCancel}
            >
              Cancel
            </Button>
            {renderSubmitButton()}
          </Modal.Actions>
        </Modal>
        {unsavedChangesModal}
      </>
    );
  } else {
    return (
      <>
        <Modal
          closeOnDimmerClick={true}
          closeOnEscape={false}
          closeIcon={true}
          className={"sticky"}
          onClose={() => {
            console.log("modal open");
            setOpen(true);
            props.isOpenCallback(true);
            fetchStudentNames();
            setFormTouched(false);
            setReadyToMark(false);
            setTimeout(() => setReadyToMark(true), 250);
            setTimeout(() => {
              if (formTouched && !props.viewOnly) {
                openUnsavedModal(() => {
                  setErrors([]);
                  setFormTouched(false);
                  setOpen(false);
                  props.isOpenCallback(false);
                });
              } else {
                setOpen(false);
                props.isOpenCallback(false);
                setFormTouched(false);
              }
            }, 0);
          }}
          onOpen={() => {
            console.log("ACTION MODAL OPEN");
            setOpen(true);
            props.isOpenCallback(true);
            fetchStudentNames();
            setFormTouched(false);
            setReadyToMark(false);
            setTimeout(() => setReadyToMark(true), 250);
          }}
          open={open}
          trigger={
            props.trigger || (
              <Button
                ref={props.ref}
                fluid
                className="view-action-button"
                onClick={() => console.log("trigger clicked")}
              >
                View Action
              </Button>
            )
          }
        >
          <Modal.Header>{props.action_title}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {props.preActionContent}
              <br />
              <div
                className="content"
                onChange={markFormAsTouched}
                onClick={(e) => {
                  if (!readyToMark) return;
                  const target = e.target;
                  if (
                    target.type === "radio" ||
                    target.closest("label[for]") ||
                    target.tagName === "LABEL" ||
                    target.classList.contains("icon")
                  ) {
                    markFormAsTouched();
                  }
                }}
                onInput={markFormAsTouched}
              >
                {isPeerEval ? (
                  <ParsedInnerHTML
                    html={props.page_html}
                    components={QuestionComponentsMap}
                    studentsList={studentOptions}
                    errorFields={errorFields}
                    submitter={
                      user.isMock
                        ? `${user.mockUser.fname} ${user.mockUser.lname}`
                        : `${user.fname} ${user.lname}`
                    }
                  />
                ) : (
                  <InnerHTML html={props.page_html} />
                )}
              </div>
              <br />
              {fileUpload(props.file_types, props.file_size)}
              {errors.length > 0 && (
                <div className="submission-errors">
                  <br />
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
                </div>
              )}
            </Modal.Description>
            <Modal
              closeOnDimmerClick={true}
              closeIcon={true}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              open={!!submissionModalOpen}
              {...generateModalFields()}
              onClose={() => closeSubmissionModal()}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              className="offset-outline"
              color="grey"
              onClick={onActionCancel}
            >
              Cancel
            </Button>
            {renderSubmitButton()}
          </Modal.Actions>
        </Modal>
        {unsavedChangesModal}
      </>
    );
  }
}
