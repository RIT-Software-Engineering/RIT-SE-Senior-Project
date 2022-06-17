import React, { useRef, useState } from 'react';
import { Accordion, Form, Button } from 'semantic-ui-react';
import { config } from '../../../util/functions/constants';
import { SecureFetch } from '../../../util/functions/secureFetch';
import FileRemover from "./FileRemover";
import OverviewEditor from "./OverviewEditor"

const fileUploadPaths = ["archive", "coach", "site", "student", "publicContent"];

export default function FileEditor() {

    const fileInput = useRef(null);
    const [path, setPath] = useState(fileUploadPaths[0]);
    const [response, setResponse] = useState(null);

    const uploadFiles = (event) => {
        event.preventDefault();

        if (fileInput.current.files.length === 0) {
            alert("No files to upload");
            return;
        }

        const body = new FormData();

        body.append("path", path);

        for (let i = 0; i < fileInput.current.files.length; i++) {
            body.append("files", fileInput.current.files[i]);
        }

        SecureFetch(config.url.API_POST_UPLOAD_FILES, {
            method: "post",
            body: body,
        })
            .then((response) => response.json())
            .then(response => {
                setResponse(response);
            })
            .catch((err) => {
                setResponse({ msg: "Failure:", error: err });
            })
    }


    const uploadFilesDisplay = () => {
        return (
            <div>
                <Form.Field>
                    <label>Select path to upload</label>
                    <select value={path} onChange={(e) => { setPath(e.target.value); setResponse(null); }}>
                        {fileUploadPaths.map((uploadPath, idx) => <option value={uploadPath} key={idx}>{uploadPath}</option>)}
                    </select>
                </Form.Field>
                <Form.Field>
                    <label>Select files to upload</label>
                    <input
                        type="file"
                        multiple
                        ref={fileInput}
                        onChange={() => { setResponse(null) }}
                    />
                </Form.Field>
                <Form.Field>
                    {response && <>
                        <label>{response.msg}</label>
                        {response.filesUploaded && response.filesUploaded.map((file, idx) => {
                            return <div key={idx}><a href={file} target="_blank" rel="noreferrer">{file}</a><br /></div>
                        })}
                        {response.error && JSON.stringify(response.error)}
                    </>}
                </Form.Field>
                <Button type="submit">Upload Files</Button>
            </div>
        )
    }

    return (
        <Accordion
            fluid
            styled
            panels={[{
                key: "fileEditor",
                title: "Content Editor",
                content: {
                    content: <>
                        <Form
                            onSubmit={uploadFiles}
                        >
                         <div>
                             <Accordion
                                 fluid
                                 styled
                                 panels={[
                                     {
                                         key: "fileUploader",
                                         title: "File Uploader",
                                         content: { content: uploadFilesDisplay() },
                                     },
                                 ]}
                             />
                         </div>
                        </Form>
                        <FileRemover/>
                        <OverviewEditor/>
                    </>
                }
            },]}
        />
    )
}
