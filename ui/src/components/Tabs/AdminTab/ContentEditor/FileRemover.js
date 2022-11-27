import React, { useEffect, useState } from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { config } from '../../../util/functions/constants';
import { SecureFetch } from '../../../util/functions/secureFetch';
import FileBrowser from 'react-keyed-file-browser';
import Moment from "moment/moment";
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';

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
    const [files, setFiles] = useState([]) //these are the files that are in the specified path.
    const [file, setFile] = useState("poop") //This is the file that is selected to be removed..

    const [myFiles, setMyFiles] = useState([
        {
            key: 'photos/animals/cat in a hat.png',
            modified: 0,
            size: 1.5 * 1024 * 1024,
        },
        {
            key: 'photos/animals/kitten_ball.png',
            modified: +Moment().subtract(3, 'days'),
            size: 545 * 1024,
        },
        {
            key: 'documents/letter chunks.doc',
            modified: +Moment().subtract(15, 'days'),
            size: 480 * 1024,
        },
        {
            key: 'documents/export.pdf',
            modified: +Moment().subtract(15, 'days'),
            size: 4.2 * 1024 * 1024,
        },
    ]);

    //If the path that is selected is changed, this will refetch all the files that are found inside that path.
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

    /**
     * Creates a new folder in given directory
     * @param key directory to make a new folder in
     */
    const handleCreateFolder = (key) => {
        setMyFiles( myFiles => [...myFiles, {
            key: key
        }]);
    }

    const handleCreateFile = (files, prefix) => {

        this.setState(state => {
            const newFiles = files.map((file) => {
                let newKey = prefix
                if (prefix !== '' && prefix.substring(prefix.length - 1, prefix.length) !== '/') {
                    newKey += '/'
                }
                newKey += file.name
                return {
                    key: newKey,
                    size: file.size,
                    modified: +Moment(),
                }
            })

            const uniqueNewFiles = []
            newFiles.map((newFile) => {
                let exists = false
                state.files.map((existingFile) => {
                    if (existingFile.key === newFile.key) {
                        exists = true
                    }
                })
                if (!exists) {
                    uniqueNewFiles.push(newFile)
                }
            })
            state.files = state.files.concat(uniqueNewFiles)
            return state
        })
    }

    const handleRenameFolder = (oldKey, newKey) => {
        const newFiles = [];
        myFiles.map((file) => {
            if(file.key.substring(0, oldKey[0].length) === oldKey[0]) {
                newFiles.push(
                    {
                    ...file,
                    key: file.key.replace(oldKey[0], newKey[0]),
                    modified: +Moment(),
                    }
                );
            } else {
                newFiles.push(file);
            }
        })
        setMyFiles(newFiles);
    }

    const handleRenameFile = (oldKey, newKey) => {
        const newFiles = [];
        myFiles.map((file) => {
            if (file.key === oldKey[0]) {
                newFiles.push(
                    {
                        ...file,
                        key: newKey[0],
                        modified: +Moment(),
                    }
                );
            } else {
                newFiles.push(file)
            }
        })
        setMyFiles(newFiles);
    }


    /**
     * Delete folder and all its files inside in file manager
     * @param folderKey key of folder to be deleted
     */
    const handleDeleteFolder = (folderKey) => {
        setMyFiles(myFiles.filter(file => file.key.substring(0, folderKey[0].length) !== folderKey[0]));
    }

    /**
     * Delete file in file manager
     * @param fileKey key of file to be deleted
     */
    const handleDeleteFile = (fileKey) => {
        setMyFiles(myFiles.filter(file => file.key !== fileKey[0]));
    }

    return (
        <div>
            <FileBrowser
                files={myFiles}
                onCreateFile={handleCreateFile}
                onCreateFolder={handleCreateFolder}
                onDeleteFolder={handleDeleteFolder}
                onDeleteFile={handleDeleteFile}
                onMoveFolder={handleRenameFolder}
                onMoveFile={handleRenameFile}
                onRenameFolder={handleRenameFolder}
                onRenameFile={handleRenameFile}
                icons={{
                    File: <Icon name="file" />,
                    Image: <Icon name="file image" />,
                    PDF: <Icon name="file pdf" />,
                    Rename: <Icon name="i cursor" />,
                    Folder: <Icon name="folder" />,
                    FolderOpen: <Icon name="folder open" />,
                    Delete:<Icon name="trash alternate" />,
                    Loading: <Icon name="spinner" />,
                }}
            />
        </div>
    )
}