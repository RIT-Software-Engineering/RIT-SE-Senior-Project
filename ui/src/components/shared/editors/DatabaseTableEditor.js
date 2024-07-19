import React, { useState, useEffect } from "react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { Dropdown, Label, Modal } from "semantic-ui-react";
import { SecureFetch } from "../../util/functions/secureFetch";
import PhoneInput from "react-phone-number-input/input";
import us from "react-phone-number-input/locale/en";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", CLOSED: false };

export default function DatabaseTableEditor(props) {
  let initialState = props.initialState;
  let submissionModalMessages = props.submissionModalMessages;
  let submitRoute = props.submitRoute;
  let formFieldArray = props.formFieldArray;
  let date = new Date();

  const [submissionModalOpen, setSubmissionModalOpen] = useState(
    MODAL_STATUS.CLOSED
  );
  const [formData, setFormData] = useState(initialState);
  const [open, setOpen] = React.useState(false);
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
        if (props.reload) {
          props.reloadData();
        }
        break;
      case MODAL_STATUS.FAIL:
        setSubmissionModalOpen(MODAL_STATUS.CLOSED);
        break;
      default:
        console.error(`MODAL_STATUS of '${submissionModalOpen}' not handled`);
    }
  };

  function handleCancel() {
    setFormData(initialState);
  }

  const handleSubmit = async function (e) {
    const dataToSubmit = !!props.preSubmit
      ? props.preSubmit(formData)
      : formData;

    let body = new FormData();

    if ("changed_fields" in dataToSubmit) {
      if (typeof dataToSubmit["changed_fields"] === "object") {
        dataToSubmit["changed_fields"] = JSON.stringify(
          dataToSubmit["changed_fields"]
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
        setSubmissionModalOpen(MODAL_STATUS.FAIL);
      });
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
                required
              />
            </Form.Field>
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
            </Form.Field>
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
                required
              />
            </Form.Field>
          );
          break;
        case "textArea":
          fieldComponents.push(
            <Form.Field key={field.name} required>
              <Form.TextArea
                placeholder={field.placeholder}
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                style={{ minHeight: 200 }}
                onChange={handleChange}
                disabled={field.disabled}
                required
              />
            </Form.Field>
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
            </Form.Field>
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
            </Form.Field>
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
            </Form.Field>
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
            </Form.Field>
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
            </Form.Field>
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
            </Form.Field>
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
          className={"sticky"}
          trigger={trigger}
          onClose={() => {
            setOpen(false);
            props.isOpenCallback(false);
            }}
          onOpen={() => {
              setOpen(true);
              props.isOpenCallback(true);
              }}
          open={open}
          header={props.header}
          content={{
            content: (
              <>
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
          className={"sticky"}
          trigger={trigger}
          header={props.header}
          content={{
            content: (
              <>
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
