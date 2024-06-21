import React, {useEffect, useState} from 'react';
import ReactCodeMirror from "@uiw/react-codemirror";
import {Button, Grid, Modal} from "semantic-ui-react";


export default function QuestionBuilder(props) {
    const [inhtml,setInhtml] = useState("");

    useEffect(() => {
        setInhtml(props.currentCode);
    }, [props.currentCode]);
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
                onChange={props.onChange}
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