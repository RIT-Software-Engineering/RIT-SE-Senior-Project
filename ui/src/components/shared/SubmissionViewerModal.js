import React from 'react'
import { config } from "../util/constants";
import { Button, Divider, Icon, Modal } from 'semantic-ui-react';
import { formatDateTime } from '../util/utils';

export default function SubmissionViewerModal(props) {
    const formData = JSON.parse(props.action?.form_data);
    return (
        <Modal
            trigger={
                props.trigger || <Button icon>
                    <Icon name="eye" />
                </Button>
            }
            header={"Submission"}
            actions={[{ content: "Done", key: 0 }]}
            content={{
                content: <div>
                    <h5>Action:</h5> <p>{props.action.action_title}</p>
                    <h5>Submission Type:</h5> <p>{props.action.action_target}</p>
                    <h5>Submitted By:</h5> <p>{props.action.system_id}</p>
                    <h5>Submitted At:</h5> <p>{formatDateTime(props.action.submission_datetime)}</p>
                    <Divider />
                    <h3>Submission</h3>
                    {Object.keys(formData)?.map((key) => {
                        return (
                            <div key={key}>
                                <h5>{key}:</h5> <p>{formData[key]}</p>
                            </div>
                        );
                    })}
                    {props.action.files?.split(",").map((file) => {
                        return <div key={file}><a href={`${config.url.BASE_URL}/#`} >{file}</a><br /></div>;
                    })}
                </div>
            }}
        />
    );
}
