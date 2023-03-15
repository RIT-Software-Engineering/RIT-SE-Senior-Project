import React, {useEffect, useRef, useState} from 'react';
import {Accordion, Form, Button, Modal} from 'semantic-ui-react';
import { config } from '../../../util/functions/constants';
import { SecureFetch } from '../../../util/functions/secureFetch';
import FileManager from "./FileManager";
import OverviewEditor from "./OverviewEditor"

/**
 * Content Editor Accordion in Admin Tab
 */
export default function FileEditor() {

    const fileInput = useRef(null);
    const [directories, setDirectories] = useState([]); // used to store directories from GET request
    const [path, setPath] = useState(["/"]);
    const [response, setResponse] = useState(null);
    const [addFileOpen, setAddFileOpen] = useState(false); // used for upload file modal

    // Get all directories from /resource and add it to directories array
    useEffect(() => {
        SecureFetch(`${config.url.API_GET_FILES}?path=`)
            .then((response) => response.json())
            .then((fileData) => {
                if(fileData?.length !== 0) {
                    const newDirectoriesToSet = [];
                    fileData.forEach(pathData => {
                        if(isDirectory(pathData["file"])) {
                            newDirectoriesToSet.push(pathData["file"]);
                            getDirectoriesInDirectory(pathData["file"] + "/", newDirectoriesToSet);
                        }
                    })
                    if(newDirectoriesToSet) setDirectories(newDirectoriesToSet);
                }
            })
            .catch((error) => {
                alert("Failed to get directories " + error);
            });
    }, []);

    /**
     * Gets files from desired directory and adds directories to newDirectoriesToSet array
     * @param directory Directory to get files from
     * @param newDirectoriesToSet array to add directories to
     */
    const getDirectoriesInDirectory = (directory, newDirectoriesToSet) => {
        SecureFetch(`${config.url.API_GET_FILES}?path=${directory}`)
            .then((response) => response.json())
            .then((fileData) => {
                if(fileData?.length !== 0) {
                    fileData.forEach(pathData => {
                        if (isDirectory(pathData["file"])) {
                            newDirectoriesToSet.push(directory + pathData["file"]);
                            getDirectoriesInDirectory(directory + pathData["file"] + '/', newDirectoriesToSet);
                        }
                    })
                }
            })
            .catch((error) => {
                alert("Failed to get files in directory " + error);
            });
    }

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

    /**
     * Content inside the upload files modal with dropdown to select path, browse files, and upload files button
     */
    const uploadFilesDisplay = () => {
        return (
            <div>
                <Form.Field>
                    <label>Select directory path to upload</label>
                    <select value={path} onChange={(e) => { setPath(e.target.value); setResponse(null); }}>
                        {directories.map((uploadPath, idx) => <option value={uploadPath} key={idx}>{uploadPath}</option>)}
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
        <div className="accordion-button-group">
        <Accordion
            fluid
            styled
            panels={[{
                key: "fileEditor",
                title: "Content Editor",
                content: {
                    content:
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
                        <FileManager/>
                        <OverviewEditor/>
                    </>
                }
            },]}
        />
            <div className="accordion-buttons-container">
                <button className="circular ui icon button" onClick={toggleFileUploadModalOpen} >
                    <i className="plus icon"></i>
                </button>
            </div>
        </div>
    )
}
