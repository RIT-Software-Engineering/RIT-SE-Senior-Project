import React, { useState, useEffect } from "react";

import { formatDate } from "../../util/functions/utils";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";

export default function SubmissionsData(props) {
    const [due, setDue] = useState();
    const [late, setLate] = useState(false);
    const [day, setDay] = useState(0);
    const [submission, setSubmission] = useState({});
    const [files, setFiles] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    const loadSubmissions = () => {
        SecureFetch(
            `${config.url.API_GET_SUBMISSIONS}?action_id=${props.action?.action_id}`,
        )
            .then((response) => response.json())
            .then((submissions) => {
                if (submissions.length > 0) {
                    // const formData = JSON.parse(submission[0].form_data.toString());
                    // const fileData = submission[0].files?.split(",");
                    // setSubmission(formData);
                    // setFiles(fileData);
                    // setNoSubmission(formData.length === 0 && files.length === 0);
                    
                    let actionSubmissions = [];
                    for(let i=0; i<submissions.length; i++) {
                        let submissionsData = [];
                        let formData = JSON.parse(submissions[i].form_data.toString());
                        let fileData = submissions[i].files?.split(",");
                        let logId = submissions[i].action_log_id;
                        let dueDate = new Date(submissions[i].due_date);
                        dueDate.setDate(dueDate.getDate()+1);
                        submissionsData.push([formData, fileData, logId, dueDate]);
                        actionSubmissions.push(submissionsData);
                    }
                    setSubmissions(actionSubmissions);
                }
            })
            .catch((error) => {
                alert("Failed to get action log data " + error);
            });
            // console.log("submissions pog", submissions);
    }
        


            // .then((dueDate) => {
            // let dueDateTime = new Date(dueDate[0].due_date);
            // dueDateTime.setDate(dueDateTime.getDate()+1);
            // setDue(dueDateTime);
            // let submitDate = new Date(
            //     props.log.submission_datetime.split(" ")[0].toString(),
            // );
            // setLate(dueDateTime < submitDate);
            // if (dueDateTime < submitDate) {
            //     daysLate(dueDateTime, submitDate);
            // }
            // })
            // .catch((error) => {
            //     alert("Failed to get due and submission data " + error);
            // });

    const daysLate = (due, submitted) => {
        const dueDate = formatDate(due);
        const submitDate = formatDate(submitted);
        const diffInMs = new Date(submitDate) - new Date(dueDate);
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        setDay(diffInDays);
    };

    // return (
    //     <div>
    //         {` (Due ${formatDate(due)})`}<br />
    //         {late && ` ${day} days late`}
    //     </div>
    // );

    loadSubmissions();

    return submissions;
}