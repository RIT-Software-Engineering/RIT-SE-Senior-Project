import React, {useEffect, useRef, useState} from 'react';
import {Accordion, Form, Button, Modal} from 'semantic-ui-react';
import { config } from '../../util/functions/constants';
import { SecureFetch } from '../../util/functions/secureFetch';

export default function FileUpload() {

    const fileInput = useRef(null);
    const fields = ["Archive Image", "Poster Thumbnail", "Poster Full", "Video"];
    const [path, setPath] = useState(["/"]);
    const [response, setResponse] = useState(null);
    const [addFileOpen, setAddFileOpen] = useState(false); // used for upload file modal

    /**
     * Given a string, checks if it is a file based on if it has a period to represent the file type
     * ex: picture vs picture.jpeg vs picture.png, first one is NOT a file because it does not have a file type ending
     * Based on the assumption that given files / directories do not contain any periods
     * @param str string to be checked
     * @returns {boolean} true if is a file, false otherwise
     */
    const isDirectory = (str) => {
        const strSplit = str.split(".");
        return strSplit.length === 1;
    }

    /**
     * Toggle modal that lets you upload files
     */
    const toggleFileUploadModalOpen = () => {
        setAddFileOpen(!addFileOpen);
    }

    /**
     * Handles logic for sending request to upload files
     */
    const uploadFiles = (event) => {

        return; /*doing nothing until routing implemented for safety*/
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

        SecureFetch(config.url.API_POST_UPLOAD_FILES_STUDENT, {
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

    /**
     * Content inside the upload files modal with dropdown to select path, browse files, and upload files button
     */
    const uploadFilesDisplay = () => {
        return (
            <div>
                <Form.Field>
                    <label>Select file type to upload</label>
                    <select value={path} onChange={(e) => { setPath(e.target.value); setResponse(null); }}>
                        {fields.map((uploadPath, idx) => <option value={uploadPath} key={idx}>{uploadPath}</option>)}
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
        <>
        {/* Modal with add file functionality */}
            <Modal className={"sticky"} open={addFileOpen}  onClose={() => setAddFileOpen(false)}
                   onOpen={() => setAddFileOpen(true)}>
                <Modal.Header>Upload Files</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={uploadFiles}>
                        <div>
                            {uploadFilesDisplay()}
                        </div>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setAddFileOpen(false)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
            <div className="accordion-buttons-container">
                <button className="circular ui icon button" onClick={toggleFileUploadModalOpen} >
                    <i className="file outline icon"></i>
                </button>
            </div>
        </>
    )
}
