import React, { useEffect, useState } from 'react';
import {Form, Button, Accordion} from 'semantic-ui-react';
import { config } from '../../util/functions/constants';
import { SecureFetch } from '../../util/functions/secureFetch';

export default function OverviewEditor(){

    const [html, setHtml] = useState("")
    const [path, setPath] = useState("") //Choose a path to upload the html data to, possible remove if uploading to db.

    useEffect(() => {
        //secure fetch whatever is stored inside the overview html file.
    })

    //Send changed html inside the text area to the respective file or database.
    const uploadHtml = (event) => {
        event.preventDefault();
        if(html === ""){
            alert("Must contain text to submit")
            return
        }
        const body = new FormData();
        body.append("overviewHtml", html);
        SecureFetch(config.url.API_POST_EDIT_OVERVIEW, {
            method: "post",
            body: body,
        })
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                alert("didn't work bucko " + err);
            })
    }

    const Overview = () => {
        return (
            <>
                <Form.Field>
                    <Form.TextArea
                        placeholder={"If you see this text, that means there is nothing being displayed in the Overview."}
                        label={"Overview Html"}
                        name={"overviewValueKey"}
                        value={html}
                        style={{ minHeight: 200 }}
                        onChange={e => setHtml(e.target.value)}
                    />
                </Form.Field>
                <Button type="submit">Update Overview</Button>
            </>
        )
    }

    return (
        <Form
            onSubmit={uploadHtml}
        >
            <div>
                <Accordion
                    fluid
                    styled
                    panels={[
                        {
                            key: "overviewEditor",
                            title: "Overview Editor",
                            content: { content: Overview() },
                        },
                    ]}
                />
            </div>
        </Form>
    )
}




