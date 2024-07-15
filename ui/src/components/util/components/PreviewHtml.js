import React from 'react'
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {Form, Icon, Input, Modal} from "semantic-ui-react";
import {formatDateNoOffset, humanFileSize} from "../functions/utils";
import {ACTION_TARGETS, DEFAULT_UPLOAD_LIMIT} from "../functions/constants";
import Announcements from "../../Tabs/DashboardTab/TimelinesView/Announcements";
export default function PreviewHtml(props){

    const [open, setOpen] = React.useState(false);

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
                {fileUpload(props.action.file_types, props.action.file_size)}
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

    function fileUpload(fileTypes, fileSize) {
        return fileTypes && <Form>
            <Form.Field required>
                <label className="file-submission-required">File Submission (Accepted: {fileTypes.split(",").join(", ")})
                    (Max size of each file: {humanFileSize((fileSize || DEFAULT_UPLOAD_LIMIT), false, 0)})
                </label>
                <Input fluid required type="file" accept={fileTypes} multiple />
            </Form.Field>
        </Form>;
    }

    return (
        <Modal
            className={"sticky"}
            trigger={
                props.trigger || (<Button icon={<Icon name="eye" />}/>)}
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