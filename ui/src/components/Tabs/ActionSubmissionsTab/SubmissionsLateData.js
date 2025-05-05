import React, { useState, useEffect } from "react";

import { formatDate } from "../../util/functions/utils";
import { SecureFetch } from "../../util/functions/secureFetch";
import { config } from "../../util/functions/constants";

export default function SubmissionsLateData(props) {
    const [due, setDue] = useState();
    const [late, setLate] = useState(false);
    const [day, setDay] = useState(0);

    const loadLateSubmission = () => {
        SecureFetch(
            `${config.url.API_GET_LATE_SUBMISSION}?log_id=${props.log?.action_log_id}`,
        )
            .then((response) => response.json())
            .then((dueDate) => {
            let dueDateTime = new Date(dueDate[0].due_date);
            dueDateTime.setDate(dueDateTime.getDate()+1);
            setDue(dueDateTime);
            let submitDate = new Date(
                props.log.submission_datetime.split(" ")[0].toString(),
            );
            setLate(dueDateTime < submitDate);
            if (dueDateTime < submitDate) {
                daysLate(dueDateTime, submitDate);
            }
            })
            .catch((error) => {
                alert("Failed to get due and submission data " + error);
            });
    }

    useEffect(() => {
        loadLateSubmission();
    }, []);

    const daysLate = (due, submitted) => {
        const dueDate = formatDate(due);
        const submitDate = formatDate(submitted);
        const diffInMs = new Date(submitDate) - new Date(dueDate);
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        setDay(diffInDays);
    };

    return (
        <div>
            {` (Due ${formatDate(due)})`}<br />
            {late && ` ${day} days late`}
        </div>
    );
}