import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import ReactCodeMirror from "@uiw/react-codemirror";
import {html} from "@codemirror/lang-html";
import React from "react";
import {eclipseInit} from "@uiw/codemirror-theme-eclipse";

const modifiedEclipse = eclipseInit({settings: {caret: "#000000"}})

export default function HTMLEditor(props) {
    const field = props.field;
    const formData = props.formData;

    return (
        <Form.TextArea
            label={field.label}
            as={ReactCodeMirror}
            theme={modifiedEclipse}
            onChange={props.handleChange}
            value={formData[field.name]}
            maxHeight={"700px"}
            extensions={[html({autoCloseTags: true})]}
            style={{
                border: "1px solid #d4d4d5",
                borderRadius: "5px",
                padding: "10px",
                minHeight: "200px",
            }}
        />
    );
}