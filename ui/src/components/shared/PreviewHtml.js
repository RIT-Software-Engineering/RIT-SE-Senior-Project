import React from 'react'
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {Form, Icon, Input, Modal} from "semantic-ui-react";
import {formatDateNoOffset} from "../util/utils";
import {ACTION_TARGETS} from "../util/constants";
import Announcements from "./Announcements";
export default function PreviewHtml(props){

    const submissionTypeMap = {
        [ACTION_TARGETS.individual]: "Individual",
        [ACTION_TARGETS.team]: "Team",
        [ACTION_TARGETS.coach]: "Coach",
        [ACTION_TARGETS.admin]: "Admin",
    }

    function modalContent(props) {
        const isStudentAnnouncement = props.action.action_target === ACTION_TARGETS.student_announcement;
        const isCoachAnnouncement = props.action.action_target === ACTION_TARGETS.coach_announcement;

        if(isStudentAnnouncement || isCoachAnnouncement){
            return (
                <Announcements announcements={[props.action]} semesterName={props.semesterName}/>
            )
        }

         return(
            <div>
                {preActionContent()}
                <br/>
                <div className="content" dangerouslySetInnerHTML={{__html: props.action.page_html}}/>
                <br/>
                {fileUpload(props.action.file_types)}
            </div>
         )
    }

    function preActionContent() {
        return <>
            <p>{props.action?.short_desc}</p>
            <p>Starts: {formatDateNoOffset(props.action?.start_date)}</p>
            <p>Due: {formatDateNoOffset(props.action?.due_date)}</p>
            <p>Project: <i>project name here</i></p>
            <p>Submission Type: {submissionTypeMap[props.action?.action_target]}</p>
            <p><b>Submission list here</b></p>
        </>
    }

    function fileUpload(fileTypes) {
        return fileTypes && <Form>
            <Form.Field required>
                <label className="file-submission-required">File Submission (Accepted: {fileTypes.split(",").join(", ")})</label>
                <Input fluid required type="file" accept={fileTypes} multiple />
            </Form.Field>
        </Form>;
    }

    return (
        <Modal
            trigger={<Button icon={<Icon name="eye" />} />}
            header={props.header}
            content={{
                content:
                    modalContent(props)
            }}
            actions={[
                {
                    key: "Close",
                    content: "Close",
                }
            ]}
        />
    )
}