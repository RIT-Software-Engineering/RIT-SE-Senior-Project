import React, { useContext, useState, useEffect } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { Dropdown, Icon, Label, Message, Modal } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import PhoneInput from "react-phone-number-input/input";
import us from "react-phone-number-input/locale/en";
import { UserContext } from "../../util/functions/UserContext";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", CLOSED: false };
const { differenceInWeeks } = require("date-fns");
export default function TimeTableEditor(props) {
  let initialState = props.initialState;
  let submissionModalMessages = props.submissionModalMessages;
  let submitRoute = props.submitRoute;
  let formFieldArray = props.formFieldArray;
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(
    MODAL_STATUS.CLOSED,
  );
  const [formData, setFormData] = useState(initialState);
  const [error1, setError1] = useState([]);
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
      default:
        return;
    }
  };

  const closeSubmissionModal = () => {
    switch (submissionModalOpen) {
      case MODAL_STATUS.SUCCESS:
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        break;
      case MODAL_STATUS.FAIL:
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        break;
      default:
        console.error(`MODAL_STATUS of '${submissionModalOpen}' not handled`);
    }
  };

  const handleSubmit = async function (e) {
    setError1([]);
    const dataToSubmit = !!props.preSubmit
      ? props.preSubmit(formData)
      : formData;
    let invalid = false;

    let body = new FormData();
    if ("changed_fields" in dataToSubmit) {
      if (typeof dataToSubmit["changed_fields"] === "object") {
        dataToSubmit["changed_fields"] = JSON.stringify(
          dataToSubmit["changed_fields"],
        );
      }
    }
    if (
      !dataToSubmit["date"] ||
      differenceInWeeks(new Date(), new Date(dataToSubmit["date"])) >= 2
    ) {
      if (
        !error1.includes(
          "You must enter a Date of Work within the past 14 days.",
        )
      ) {
        setError1([
          ...error1,
          "You must enter a Date of Work within the past 14 days.",
        ]);
      }
      invalid = true;
    }

    if (isNaN(dataToSubmit["time_amount_hours"])) {
      if (!error1.includes("You must enter a valid Time in hours.")) {
        setError1([...error1, "You must enter a valid Time in hours."]);
      }
      invalid = true;
    }

    if (isNaN(dataToSubmit["time_amount_mins"])) {
      if (!error1.includes("You must enter a valid Time in minutes.")) {
        setError1([...error1, "You must enter a valid Time in minutes."]);
      }
      invalid = true;
    }

    if (
      dataToSubmit["time_amount_hours"] < 1 ||
      dataToSubmit["time_amount_hours"] > 10
    ) {
      if (
        !error1.includes("You need to enter a Time ranging from 1-10 hours.")
      ) {
        setError1([
          ...error1,
          "You need to enter a Time ranging from 1-10 hours.",
        ]);
      }
      invalid = true;
    }

    if (
      dataToSubmit["time_amount_mins"] < 0 ||
      dataToSubmit["time_amount_mins"] > 59
    ) {
      if (
        !error1.includes("You need to enter a Time ranging from 0-59 minutes.")
      ) {
        setError1([
          ...error1,
          "You need to enter a Time ranging from 0-59 minutes.",
        ]);
      }
      invalid = true;
    }

    if (dataToSubmit["comment"].length > 300) {
      if (
        !error1.includes(
          "You must enter a Date of Work within the past 14 days.",
        )
      ) {
        setError1([
          ...error1,
          "You cannot enter a comment exceeding 300 characters.",
        ]);
      }
      invalid = true;
    }

    if (dataToSubmit["comment"].length === 0) {
      if (!error1.includes("You must enter a comment.")) {
        setError1([...error1, "You must enter a comment."]);
      }
      invalid = true;
    }

    if (!invalid) {
      setOpen(false);
      //calculate combined hours and minutes to one field
      let time_float = (
        parseFloat(dataToSubmit["time_amount_hours"]) +
        parseFloat(dataToSubmit["time_amount_mins"]) / 60
      ).toFixed(2);
      dataToSubmit["time_amount"] = String(time_float);

      Object.keys(dataToSubmit).forEach((key) => {
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
        })
        .catch((error) => {
          setSubmissionModalOpen(MODAL_STATUS.FAIL);
        });
      props.callback();
    }
  };

  const handleChange = (e, { name, value, checked, isActiveField }) => {
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
          break;
        case "hoursInput":
          fieldComponents.push(
            <Form.Field key={field.name}>
              <Form.Group>
                <Form.Input
                  label={field.label}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={field.disabled}
                />
                <p>
                  <br></br>
                  <br></br>Hours
                </p>
              </Form.Group>
            </Form.Field>,
          );
          break;
        case "minutesInput":
          fieldComponents.push(
            <Form.Field key={field.name}>
              <Form.Group>
                <Form.Input
                  label={field.label}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={field.disabled}
                />
                <p>
                  <br></br>Minutes
                </p>
              </Form.Group>
            </Form.Field>,
          );
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
            <Form.Field key={field.name}>
              <Form.Input
                label={field.label}
                type="date"
                placeholder={field.placeholder || "yyyy-mm-dd"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
              />
            </Form.Field>,
          );
          break;
        case "textArea":
          fieldComponents.push(
            <Form.Field key={field.name}>
              <Form.TextArea
                placeholder={field.placeholder}
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                style={{ minHeight: 200 }}
                onChange={handleChange}
                disabled={field.disabled}
              />
            </Form.Field>,
          );
          break;
        case "dropdown":
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
          break;
        case "checkbox":
          fieldComponents.push(
            <Form.Field key={field["name"]}>
              <label>{field.label}</label>
              <Form.Checkbox
                label={field["label"]}
                checked={!!formData[field["name"]]}
                name={field["name"]}
                onChange={handleChange}
                disabled={field.disabled}
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

  let trigger = (
    <Button>
      {" "}
      <Icon name={props.button} />
      Log Project Time
    </Button>
  );
  if (props.trigger) {
    trigger = props.trigger;
  }

  return (
    <>
      <Modal
        className={"sticky"}
        trigger={trigger}
        onOpen={() => {
          setOpen(true);
        }}
        open={open}
      >
        <Modal.Header>{props.header}</Modal.Header>
        <Modal.Content>
          <Form>{fieldComponents}</Form>
          {props.childComponents}
          {error1.length !== 0 ? (
            <Message error header="Invalid Submission" list={error1} />
          ) : (
            <></>
          )}
        </Modal.Content>

        <Modal.Actions>
          <Button
            content={
              user.isMock
                ? `Submitting ${user.mockUser.fname} ${user.mockUser.lname} as ${user.fname} ${user.lname}`
                : "Submit"
                //"Submit"
            }
            labelPosition="right"
            icon="check"
            positive
            onClick={() => handleSubmit()}
          />
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>

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
