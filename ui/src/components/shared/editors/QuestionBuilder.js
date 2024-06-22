import React, {useEffect, useState} from 'react';
import ReactCodeMirror from "@uiw/react-codemirror";
import {Button, Grid, Modal} from "semantic-ui-react";
import {QuestionComponentsMap, QuestionFeedback, QuestionMoodRating, QuestionPeerFeedback, QuestionTable } from "./PeerEvalComponents";


export default function QuestionBuilder(props) {
    const [inhtml,setInhtml] = useState("");

    const hiddenImports=`
    import React from 'react'
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {Form, Icon, Input, Modal} from "semantic-ui-react";
import {formatDateNoOffset, humanFileSize} from "../functions/utils";
import {ACTION_TARGETS, DEFAULT_UPLOAD_LIMIT} from "../functions/constants";
import Announcements from "../../Tabs/DashboardTab/TimelinesView/Announcements";
import {QuestionComponentsMap, QuestionFeedback, QuestionMoodRating, QuestionPeerFeedback, QuestionTable } from "./PeerEvalComponents";
import ParsedInnerHTML from "./ParsedInnerHtml";
    `
    useEffect(() => {
        setInhtml(props.currentCode);
    }, [props.currentCode]);

    function handleChange(event) {
        props.onChange(event);
    }
    return(
        <Modal
            closeOnDimmerClick={false}
            open={props.isOpen}
            className={"sticky"}
        >
            <Modal.Header closeOnDimmerClick={false}> Live Form Builder</Modal.Header>
            <Grid>
                <Grid.Column width={8}>
                    <ReactCodeMirror
                        onChange={handleChange}
                        value={inhtml}
                        options={{theme:"light",
                            mode:"html"}}
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    <div
                        dangerouslySetInnerHTML={{__html: inhtml}}
                        style={{border: "1px solid #ddd", padding: "10px", minHeight: "200px"}}
                    />
                </Grid.Column>
            </Grid>

            <Modal.Actions>
                <Button onClick={props.OnClose}>Close</Button></Modal.Actions>
        </Modal>
    )
}