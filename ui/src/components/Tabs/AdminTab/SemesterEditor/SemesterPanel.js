import React, { useState, useEffect } from "react";
import { config } from "../../../util/functions/constants";
import DatabaseTableEditor from "../../../shared/editors/DatabaseTableEditor";

export default function SemesterPanel(props) {
  const [errors, setErrors] = useState([]);

  let initialState = {
    semester_id: props.semester?.semester_id || "",
    name: props.semester?.name || "",
    dept: props.semester?.dept || "",
    start_date: props.semester?.start_date || "",
    end_date: props.semester?.end_date || "",
  };

  let submissionModalMessages = {
    SUCCESS: "The semester has been updated.",
    FAIL: "We were unable to receive your update to the semester.",
    SUBMISSON_ERROR: "There were invalid inputs. Please try again.",
  };

  let submitRoute =
    initialState.semester_id === ""
      ? config.url.API_POST_CREATE_SEMESTER
      : config.url.API_POST_EDIT_SEMESTER;

  let formFieldArray = [
    {
      type: "input",
      label: "Semester Name",
      placeHolder: "Semester Name",
      name: "name",
    },
    {
      type: "input",
      label: "Department",
      placeHolder: "Department",
      name: "dept",
    },
    {
      type: "date",
      label: "Start Date",
      placeHolder: "Start Date",
      name: "start_date",
    },
    {
      type: "date",
      label: "End Date",
      placeHolder: "End Date",
      name: "end_date",
    },
  ];

  // helper function for validating semester names
  const getSemesterNames = () => {
    // TODO: need to fetch the specific semester for editing a semester... to handle the unique semester name.
    const semesters = Object.entries(props.semester);
    const semesterNames = semesters.map((sem) => sem[1]?.name);

    console.log("SEMESTERS", semesterNames);
    return semesterNames;
  };

  // input validation

  const validateForm = (data) => {
    const errorsFound = [];

    // Semester Name
    if (!data.name?.trim()) {
      errorsFound.push({
        name: "name",
        message: "Semester Name must be provided",
      });
    } else {
      const semesterNames = getSemesterNames();
      if (semesterNames.includes(data.name.trim())) {
        errorsFound.push({
          name: "name",
          message: "Semester Name is taken. Please choose a different name.",
        });
      }
    }

    // Department
    if (!data.dept?.trim()) {
      errorsFound.push({
        name: "dept",
        message: "The Department must be provided",
      });
    }
    // date validations
    if (!data.start_date) {
      // Start Date
      errorsFound.push({
        name: "start_date",
        message: "Please provide the Start Date",
      });
    }

    if (!data.end_date) {
      // End Date
      errorsFound.push({
        name: "end_date",
        message: "Please provide the End Date",
      });
    }
    // Start Date is after Due Date
    if (data.start_date && data.end_date) {
      if (data.start_date > data.end_date) {
        errorsFound.push({
          name: "dates",
          message: "Start Date must be before End Date",
          elements: ["start_date", "end_date"], // display same message for both dates
        });
      }
    }

    return errorsFound;
  };

  const preSubmit = (data) => {
    const validationErrors = validateForm(data);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return null;
    }

    setErrors([]);
    return data;
  };

  return (
    <DatabaseTableEditor
      initialState={initialState}
      submissionModalMessages={submissionModalMessages}
      header={props.header}
      submitRoute={submitRoute}
      formFieldArray={formFieldArray}
      create={initialState.semester_id === ""}
      button={initialState.semester_id === "" ? "plus" : "edit"}
      callback={props.callback}
      preSubmit={preSubmit}
      errors={errors}
    />
  );
}
