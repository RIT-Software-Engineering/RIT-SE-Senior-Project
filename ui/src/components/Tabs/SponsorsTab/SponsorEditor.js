import DatabaseTableEditor from "../../shared/editors/DatabaseTableEditor";
import { config } from "../../util/functions/constants";
import SponsorNoteEditor from "./SponsorNoteEditor";
import { Modal } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import Proposals from "../ProjectsTab/Proposals";
import { SecureFetch } from "../../util/functions/secureFetch";
import { formatPhoneNumber } from "react-phone-number-input/input";

export default function SponsorEditor(props) {
  const [sponsorProjectData, setSponsorProjectData] = useState([]);
  const [semesterData, setSemestersData] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    SecureFetch(
      `${config.url.API_GET_SPONSOR_PROJECTS}/?sponsor_id=${props?.sponsor?.sponsor_id || ""}`,
    )
      .then((response) => response.json())
      .then((projects) => {
        setSponsorProjectData(projects);
      })
      .catch((error) => {
        alert("Failed to get sponsor projects data " + error);
      });
    SecureFetch(config.url.API_GET_SEMESTERS)
      .then((response) => response.json())
      .then((semestersData) => {
        setSemestersData(semestersData);
      })
      .catch((error) => {
        console.error("Failed to get semestersData data" + error);
      });
  }, [props?.sponsor?.sponsor_id]);

  let initialState = {
    sponsor_id: props?.sponsor?.sponsor_id || "",
    fname: props?.sponsor?.fname || "",
    lname: props?.sponsor?.lname || "",
    company: props?.sponsor?.company || "",
    division: props?.sponsor?.division || "",
    email: props?.sponsor?.email || "",
    phone: props?.sponsor?.phone || "",
    association: props?.sponsor?.association || "",
    type: props?.sponsor?.type || "",
    inActive: props?.sponsor?.inActive || "",
    doNotEmail: props?.sponsor?.doNotEmail || "",
    changed_fields: {},
  };

  let submissionModalMessages = {
    SUCCESS: "The sponsor info has been updated.",
    FAIL: "We were unable to receive your update to the sponsor's info.",
  };

  //submit route for if editing a sponsor
  let submitRoute = config.url.API_POST_EDIT_SPONSOR;

  // validation for the sponsor form
  const validateForm = (data) => {
    const errorsFound = [];

    // First Name
    if (!data.fname?.trim()) {
      errorsFound.push({
        name: "fname",
        message: "First Name must be provided",
      });
    } else if (data.fname.trim().length > 50) {
      errorsFound.push({
        name: "fname",
        message: `First Name must be less than 50 characters [currently: ${data.fname.trim().length} characters]`,
      });
    }

    // Last Name
    if (!data.lname?.trim()) {
      errorsFound.push({
        name: "lname",
        message: "Last Name must be provided",
      });
    } else if (data.lname.trim().length > 50) {
      errorsFound.push({
        name: "lname",
        message: `Last Name must be less than 50 characters [currently: ${data.lname.trim().length} characters]`,
      });
    }

    // Company
    if (!data.company?.trim()) {
      errorsFound.push({
        name: "company",
        message: "Sponsor's Company must be provided",
      });
    } else if (data.company.trim().length > 100) {
      errorsFound.push({
        name: "company",
        message: `Sponsor's Company must be less than 100 characters [currently: ${data.company.trim().length} characters]`,
      });
    }

    // Division (optional but length validation if provided)
    if (data.division && data.division.trim().length > 100) {
      errorsFound.push({
        name: "division",
        message: `Sponsor's Division must be less than 100 characters [currently: ${data.division.trim().length} characters]`,
      });
    }

    // Email
    if (!data.email?.trim()) {
      errorsFound.push({
        name: "email",
        message: "Email must be provided",
      });
    } else if (data.email.trim().length > 50) {
      errorsFound.push({
        name: "email",
        message: `Email must be less than 50 characters [currently: ${data.email.trim().length} characters]`,
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errorsFound.push({
        name: "email",
        message: "Please enter a valid email address",
      });
    }

    // Type
    if (!data.type?.trim()) {
      errorsFound.push({
        name: "type",
        message: "Type must be provided",
      });
    } else if (data.type.trim().length > 50) {
      errorsFound.push({
        name: "type",
        message: `Type must be less than 50 characters [currently: ${data.type.trim().length} characters]`,
      });
    }

    // Phone (optional but format validation if provided)
    if (
      data.phone &&
      data.phone.trim() &&
      !/^\+?[\d\s\-\(\)]+$/.test(data.phone.trim())
    ) {
      errorsFound.push({
        name: "phone",
        message: "Please enter a valid phone number",
      });
    }

    // Association (optional but length validation if provided)
    if (data.association && data.association.trim().length > 100) {
      errorsFound.push({
        name: "association",
        message: `Association must be less than 100 characters [currently: ${data.association.trim().length} characters]`,
      });
    }

    return errorsFound;
  };

  const preSubmit = (data) => {
    // Format phone number if provided
    if (data.phone) {
      data.phone = formatPhoneNumber(data.phone);
    }

    const validationErrors = validateForm(data);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return null;
    }

    setErrors([]);
    return data;
  };

  let formFieldArray = [
    {
      type: "input",
      label: "First Name",
      placeHolder: "First Name",
      name: "fname",
      disabled: false,
      required: true,
    },
    {
      type: "input",
      label: "Last Name",
      placeHolder: "Last Name",
      name: "lname",
      disabled: false,
      required: true,
    },
    {
      type: "input",
      label: "Sponsor's Company",
      placeHolder: "Sponsor's Company",
      name: "company",
      disabled: false,
      required: true,
    },
    {
      type: "input",
      label: "Sponsor's Division",
      placeHolder: "Sponsor's Division",
      name: "division",
      disabled: false,
      required: false,
    },
    {
      type: "input",
      label: "Email",
      placeHolder: "Email",
      name: "email",
      disabled: false,
      required: true,
    },
    {
      type: "phoneInput",
      label: "Phone Number",
      placeHolder: "Phone Number",
      name: "phone",
      disabled: false,
      required: false,
    },
    {
      type: "input",
      label: "Association",
      placeHolder: "Association",
      name: "association",
      disabled: false,
      required: false,
    },
    {
      type: "input",
      label: "Type",
      placeHolder: "Type",
      name: "type",
      disabled: false,
      required: true,
    },
    {
      type: "checkbox",
      label: "inActive",
      placeHolder: "inActive",
      name: "inActive",
      disabled: false,
    },
    {
      type: "checkbox",
      label: "doNotEmail",
      placeHolder: "doNotEmail",
      name: "doNotEmail",
      disabled: false,
    },
  ];

  let noteEditor = (
    <SponsorNoteEditor
      sponsor_id={props?.sponsor?.sponsor_id || ""}
      viewOnly={props.viewOnly}
    />
  );

  let trigger = <Button icon={"edit"} />;

  // This is for if you are making a new sponsor
  // Changes the submit route, trigger button
  if (initialState.sponsor_id === "") {
    submitRoute = config.url.API_POST_CREATE_SPONSOR;
    trigger = <Button icon={"plus"} />;
    noteEditor = <></>;
    submissionModalMessages = {
      SUCCESS: "The sponsor has been created.",
      FAIL: "We were unable to create the sponsor.",
    };
  }

  //Editor component if we are editing or viewing a specific sponsor.
  let editor = (
    <DatabaseTableEditor
      preSubmit={preSubmit}
      initialState={initialState}
      submissionModalMessages={submissionModalMessages}
      submitRoute={submitRoute}
      formFieldArray={formFieldArray}
      header={props.header}
      trigger={trigger}
      errors={errors}
      childComponents={[
        <Proposals
          noAccordion
          viewOnly
          proposalData={sponsorProjectData}
          semesterData={semesterData}
        />,
        noteEditor,
      ]}
      callback={props.callback}
    />
  );

  //The three blocks below are for building the sponsor summary view
  const modalActions = () => {
    return [
      {
        key: "Close",
        content: "Close",
      },
    ];
  };

  let name = `${initialState.fname} ${initialState.lname}`;
  let compAndDiv = `${initialState.company} `;
  if (initialState.division !== null && initialState.division !== "") {
    compAndDiv += "(" + initialState?.division + ")";
  }

  const generateSponsorSummary = () => {
    return (
      <div>
        <h3>Sponsor Info</h3>
        <b>Name:</b> {name} <br />
        <b>Company and Division:</b> {compAndDiv} <br />
        <b>Email:</b> {initialState.email} <br />
        <b>Phone:</b> {initialState.phone} <br />
        <b>Association:</b> {initialState.association} <br />
        <b>Type:</b> {initialState.type} <br />
      </div>
    );
  };

  //This is a different editor view if the page we are on is the sponsor summary view
  if (props.summaryView) {
    trigger = <Button icon={"eye"} />;

    editor = (
      <Modal
        closeOnDimmerClick={false}
        className={"sticky"}
        closeIcon={true}
        trigger={trigger}
        header={"Sponsor Summary View"}
        content={{
          content: (
            <div>
              {generateSponsorSummary()}
              {
                <Proposals
                  noAccordion
                  viewOnly
                  proposalData={sponsorProjectData}
                  semesterData={semesterData}
                />
              }
              {noteEditor}
            </div>
          ),
        }}
        actions={modalActions()}
      />
    );
  }

  return editor;
}
