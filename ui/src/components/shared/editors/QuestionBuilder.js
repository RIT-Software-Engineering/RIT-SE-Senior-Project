import React, {useEffect, useState} from 'react';
import ReactCodeMirror from "@uiw/react-codemirror";
import {Button, Grid, Modal } from "semantic-ui-react";
import { QuestionComponentsMap } from "../../util/components/PeerEvalComponents";
import ParsedInnerHTML from "../../util/components/ParsedInnerHtml";
import {html} from "@codemirror/lang-html";
import {eclipse} from "@uiw/codemirror-theme-eclipse";
export default function QuestionBuilder(props) {
    const [inhtml, setInhtml] = useState("");

    useEffect(() => {
        setInhtml(props.currentCode);
    }, [props.currentCode])

    function handleChange(value, data) {
        setInhtml(value);
        props.onChange(value);
    }

    return (
        <Modal
            closeOnDimmerClick={false}
            open={props.isOpen}
            className={"sticky"}
        >
            <Modal.Header closeOnDimmerClick={false}> Question Builder</Modal.Header>
            <Grid>

            </Grid>
            <Modal.Actions>
                <Button onClick={props.onClose}>Close</Button>
            </Modal.Actions>
        </Modal>
    );
}
