import React, { useEffect, useState } from 'react';
import {Form, Button, Accordion} from 'semantic-ui-react';
import { config } from '../../util/functions/constants';
import { SecureFetch } from '../../util/functions/secureFetch';

/*
* I need to pass in file paths from file editor to here through props.
* Props: path, fileInput, fileUploadPaths, response
* */
//TODO: CHANGE HOW YOU ARE MANAGING FILEUPLOADPATHS. THIS IS BAD. THERE SHOULD BE A BETTER WAY OF GETTING THIS INFO
//TODO: OTHER THAN COPY AND PASTING FROM FILEEDITOR.JS
const fileUploadPaths = ["archive", "coach", "site", "student", "publicContent"];

export default function FileRemover() {

        const [path, setPath] = useState(fileUploadPaths[0]);
        const [response, setResponse] = useState(null);
        const [files, setFiles] = useState([])//these are the files that are in the specified path.
        const [file, setFile] = useState("poop")//This is the file that is selected to be removed..

        //If the path that is selected is changed, this will refetch all the files that are found inside of that path.
        useEffect(() => {
            SecureFetch(`${config.url.API_GET_FILES}?path=${path}`)
                .then((response) => response.json())
                .then((fileData) => {
                    setFiles(fileData);
                    setFile(fileData[0])
                })
                .catch((error) => {
                    alert("Failed to get files" + error);
                });
        }, [path])

        /*
        * This is the anon func for when a file is confirmed to be deleted.
        */
        const removeFile = (event) => {

            event.preventDefault();
            if(file === ""){
                alert("No file is selected")
                return
            }
            SecureFetch(`${config.url.API_DELETE_FILE}?path=${path}&file=${file}`, {method: "DELETE"})
                .then((response) => response.json())
                .then((response) => {
                    setResponse(response);
                })
                .catch((error) => {
                    alert(`Failed to delete ${file}, error: ${error}`)
                })
        }

        const removeFileContent = () => {
            return (
                <div>
                    <Form.Field>
                        <label>Select path to remove file from</label>
                        <select value={path} onChange={(e) => { setPath(e.target.value); setResponse(null); }}>
                            {fileUploadPaths.map((uploadPath, idx) => <option value={uploadPath} key={idx}>{uploadPath}</option>)}
                        </select>
                    </Form.Field>
                    <Form.Field>
                        <label>Select files to remove</label>
                        <select value={file} onChange={(e) => { console.log(e); setFile(e.target.value);  setResponse(null); }}>
                            {files?.map((fileInPath, idx) => <option value={fileInPath} key={idx}>{fileInPath}</option>)}
                        </select>
                    </Form.Field>
                    <Form.Field>
                        {response && <>
                            <label>{response.msg} File Deleted:</label>
                            <div>{response.fileDeleted}<br /></div>
                            {response.error && JSON.stringify(response.error)}
                        </>}
                    </Form.Field>
                    <Button type="submit">Remove File</Button>
                </div>
            )
        }

        return (
            <Form
                onSubmit={removeFile}
            >
                <div>
                    <Accordion
                        fluid
                        styled
                        panels={[
                            {
                                key: "fileRemover",
                                title: "File Remover",
                                content: { content: removeFileContent() },
                            },
                        ]}
                    />
                </div>
            </Form>

    )
}