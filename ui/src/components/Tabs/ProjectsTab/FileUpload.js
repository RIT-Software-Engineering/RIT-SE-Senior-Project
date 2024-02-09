import React, {useEffect, useRef, useState} from 'react';
import {Accordion, Form, Button, Modal} from 'semantic-ui-react';
import { config } from '../../util/functions/constants';
import { SecureFetch } from '../../util/functions/secureFetch';

export default function FileUpload(props) {

    const fileInput = useRef(null);
    const fields = ["Archive Image", "Poster Thumbnail", "Poster Full", "Video"];
    const [archive, setArchive] = useState(null);
    const [column, setColumn] = useState("");
    const [path, setPath] = useState(["/"]);
    const [response, setResponse] = useState(null);
    const [addFileOpen, setAddFileOpen] = useState(false); // used for upload file modal

    /**
     * Toggle modal that lets you upload files
     */
    const toggleFileUploadModalOpen = () => {
        setAddFileOpen(!addFileOpen);
    }

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_ARCHIVE_FROM_PROJECT}?project_id=${props.project?.project_id}`)
            .then((response) => response.json())
            .then((archives) => {
                if(archives.length > 0){
                    setArchive(archives[0]);
                }
            });
    }, [props.project]);

    const createProjectSubpath = (input) => {
        let formattedPath = "";
        if (archive === null){return formattedPath;}
        let projectSubfolder = archive.url_slug;
        switch(input) {
            case ("Archive Image"):
                console.log("step 1")
                formattedPath = "archiveImages/" + projectSubfolder;
                setColumn("archive_image");
                break;
            case ("Poster Thumbnail"):
                formattedPath = "archivePosters/Thumb/" + projectSubfolder;
                setColumn("poster_thumb");
                break;
            case ("Poster Full"):
                formattedPath = "archivePosters/Full/" + projectSubfolder;
                setColumn("poster_full");
                break;
            case ("Video"):
                formattedPath = "archiveVideos/" + projectSubfolder;
                setColumn("video");
                break;
        }
        return formattedPath;
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

        if (archive === null){
            alert("No archive to upload to");
            return;
        }

        const body = new FormData();

        body.append("path", path);
        body.append("archive", archive.archive_id);
        body.append("column", column);

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
     * The upload files modal to select path, browse files, and upload files
     */
    const uploadFilesDisplay = () => {
        return (
            <div>
                <Form.Field>
                    <label>Select file type to upload</label>
                    <select value={path} onChange={(e) => { setPath(createProjectSubpath(e.target.value)); setResponse(null); }}>
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
