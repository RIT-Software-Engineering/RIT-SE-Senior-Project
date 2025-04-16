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
    active: props.userData?.active || "",
  };

  let submissionModalMessages = {
    SUCCESS: "The user has been updated.",
    FAIL: "Error updating the user.",
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
    const coachAdminArray = Object.entries(props.userData); // coach & admins types
    const studentsArray = Object.entries(props.studentData); // student types

    // get system_ids
    const studentsID = studentsArray.map((student) => student[1]?.system_id);
    const coachAdminID = coachAdminArray.map((user) => user[1]?.system_id);

    const usersId = [...studentsID, ...coachAdminID]; // all users ID
    console.log(usersId);
    return usersId;
  };

  useEffect(() => {
    getUsersId();
  }, []);

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
  ];

  // input validation
  const validateForm = (data) => {
    const errorsFound = [];

    if (!data.system_id?.trim()) {
      // Semester Name
      errorsFound.push({
        name: "name",
        message: "User ID must be provided",
      });
    }
    if (data.system_id) {
      console.log("ok");
    }

    return data;
  };

  return (
    console.log(initialState),
    (
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
      />
    )
  );
}
