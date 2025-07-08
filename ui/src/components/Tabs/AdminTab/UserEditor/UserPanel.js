import React, { useState, useEffect } from "react";
import DatabaseTableEditor from "../../../shared/editors/DatabaseTableEditor";
import { config, DROPDOWN_ITEMS } from "../../../util/functions/constants";

export default function UserPanel(props) {
  const [errors, setErrors] = useState([]);

  let initialState = {
    system_id: props.userData?.system_id || "",
    fname: props.userData?.fname || "",
    lname: props.userData?.lname || "",
    email: props.userData?.email || "",
    type: props.userData?.type || "",
    semester_group: props.userData?.semester_group || "",
    project: props.userData?.project || "",
    active: props.userData?.active || "",
    viewOnly: props.userData?.viewOnly || "",
  };

  let submissionModalMessages = {
    SUCCESS: "The user has been updated.",
    FAIL: "Error updating the user.",
    SUBMISSON_ERROR: "There were invalid inputs. Please try again.",
  };

  let submitRoute = config.url.API_POST_EDIT_USER;

  if (initialState.system_id === "") {
    submitRoute = config.url.API_POST_CREATE_USER;
  }

  let semesterMap = {}; //create a map of semesters
  for (let i = 0; i < props.semesterData.length; i++) {
    const semester = props.semesterData[i];
    semesterMap[semester.semester_id] = semester.name;
  }

  // helper function; get all current users'
  const getUsersId = () => {
    // Ensure we have arrays to work with
    const userData = Array.isArray(props.userData) ? props.userData : [];
    const studentData = Array.isArray(props.studentData)
      ? props.studentData
      : [];

    // get system_ids directly from arrays
    const studentsID = studentData
      .map((student) => student?.system_id)
      .filter(Boolean);
    const coachAdminID = userData
      .map((user) => user?.system_id)
      .filter(Boolean);

    const usersId = [...studentsID, ...coachAdminID]; // all users ID
    console.log(usersId);
    return usersId;
  };

  let formFieldArray = [
    {
      type: "input",
      label: "User ID",
      placeHolder: "User ID",
      name: "system_id",
    },
    {
      type: "input",
      label: "First Name",
      placeHolder: "First Name",
      name: "fname",
    },
    {
      type: "input",
      label: "Last Name",
      placeHolder: "Last Name",
      name: "lname",
    },
    {
      type: "input",
      label: "Email",
      placeHolder: "Email",
      name: "email",
    },
    {
      type: "dropdown",
      label: "User Type",
      placeHolder: "Type",
      name: "type",
      options: DROPDOWN_ITEMS.userTypes,
    },
    {
      type: "dropdown",
      label: "Semester",
      placeHolder: "Semester",
      name: "semester_group",
      options: Object.keys(semesterMap).map((semester_id, idx) => {
        return { key: idx, text: semesterMap[semester_id], value: semester_id };
      }),
      loading: props.semesterData?.loading,
    },
    {
      type: "activeCheckbox",
      label: "Active",
      placeHolder: "Active",
      name: "active",
    },
    {
      type: "checkbox",
      label: "View Only",
      placeHolder: "View Only",
      name: "viewOnly",
    },
  ];

  // input validation
  const validateForm = (data) => {
    const errorsFound = [];

    // USER ID
    if (!data.system_id?.trim()) {
      errorsFound.push({
        name: "system_id",
        message: "User ID must be provided",
      });
    } else if (data.system_id.trim().length > 50) {
      errorsFound.push({
        name: "system_id",
        message: `User ID must be less than 50 characters [currently: ${data.system_id.trim().length} characters]`,
      });
    } else {
      const userIds = getUsersId();
      if (userIds.includes(data.system_id.trim())) {
        // check for unique user ID
        errorsFound.push({
          name: "system_id",
          message:
            "User ID is already taken. Please choose a different User ID",
        });
      }
    }

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
    }

    // User Type
    if (!data.type) {
      errorsFound.push({
        name: "type",
        message: "Please select the User Type",
      });
    }

    // Semester
    if (data.type !== "admin" && data.type !== "coach") {
      // only check for student type
      if (!data.semester_group) {
        errorsFound.push({
          name: "semester_group",
          message: "Please select a Semester",
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
      submitRoute={submitRoute}
      formFieldArray={formFieldArray}
      semesterData={props.semesterData}
      header={props.header}
      create={initialState.system_id === ""}
      button="plus"
      callback={props.callback}
      preSubmit={preSubmit}
      errors={errors}
    />
  );
}
