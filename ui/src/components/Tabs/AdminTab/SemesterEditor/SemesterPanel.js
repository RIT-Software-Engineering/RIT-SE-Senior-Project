import React, { useState } from "react";
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
      required: true,
    },
    {
      type: "input",
      label: "Department",
      placeHolder: "Department",
      name: "dept",
      required: true,
    },
    {
      type: "date",
      label: "Start Date",
      placeHolder: "Start Date",
      name: "start_date",
      required: true,
    },
    {
      type: "date",
      label: "End Date",
      placeHolder: "End Date",
      name: "end_date",
      required: true,
    },
  ];

  // helper function for validating semester names
  const getSemesterNames = () => {
    const currentSemId = props.semester?.semester_id;
    const semesterNames = props.semesterData
      ?.filter((sem) => sem?.semester_id !== currentSemId)
      .map((sem) => sem?.name); // check all other semesters for unique names

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
    } else if (data.name.trim().length > 50) {
      // check length
      errorsFound.push({
        name: "name",
        message: `Semester Name must be less than 50 characters [currently: ${data.name.trim().length} characters]`,
      });
    } else {
      const semesterNames = getSemesterNames();
      if (semesterNames.includes(data.name.trim())) {
        // checking unique semester names
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
    } else if (data.dept.trim().length > 50) {
      // check length
      errorsFound.push({
        name: "dept",
        message: `Department must be less than 50 characters [currently: ${data.dept.trim().length} characters]`,
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
