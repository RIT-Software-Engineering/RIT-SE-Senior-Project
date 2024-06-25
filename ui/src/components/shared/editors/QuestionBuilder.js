import React, {useEffect, useState} from 'react';
import ReactCodeMirror from "@uiw/react-codemirror";
import {Button, Grid, Modal} from "semantic-ui-react";
import { QuestionComponentsMap} from "../../util/components/PeerEvalComponents";
import ParsedInnerHTML from "../../util/components/ParsedInnerHtml";
import {eclipse} from "@uiw/codemirror-theme-eclipse";
import {html} from "@codemirror/lang-html";
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
            <Modal.Header closeOnDimmerClick={false}> Live Form Builder</Modal.Header>
            <Grid>
                <Grid.Column width={8}>
                    <ReactCodeMirror
                        theme={eclipse}
                        onChange={handleChange}
                        value={inhtml}
                        extensions={[html({autoCloseTags:true})]}
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    {/*{ console.warn(inhtml) }*/}
                    <div >
                        <ParsedInnerHTML html={inhtml} components={QuestionComponentsMap} />
                    </div>
                </Grid.Column>
            </Grid>

            <Modal.Actions>
                <Button onClick={props.onClose}>Close</Button>
            </Modal.Actions>
        </Modal>
    );
}
