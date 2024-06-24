import React, {useEffect, useState} from 'react';
import ReactCodeMirror from "@uiw/react-codemirror";
import {Button, Grid, Modal} from "semantic-ui-react";
import { QuestionComponentsMap} from "../../util/components/PeerEvalComponents";
import ParsedInnerHTML from "../../util/components/ParsedInnerHtml";

export default function QuestionBuilder(props) {
    const [inhtml, setInhtml] = useState("");

    useEffect(() => {
        setInhtml(props.currentCode);
    }, [props.currentCode])

    function handleChange(editor, data, value) {
        setInhtml(value);
        props.onChange(value);
    }

    return (
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
                        options={{
                            theme: "light",
                            mode: "html"
                        }}
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    <div ></div>
                </Grid.Column>
            </Grid>

            <Modal.Actions>
                <Button onClick={props.onClose}>Close</Button>
            </Modal.Actions>
        </Modal>
    );
}
