import React, { useEffect, useState } from 'react';
import {Icon} from 'semantic-ui-react';
import { config } from '../../../util/functions/constants';
import { SecureFetch } from '../../../util/functions/secureFetch';
import FileBrowser from 'react-keyed-file-browser';
import Moment from "moment/moment";
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';

export default function FileManager() {
    const [myFiles, setMyFiles] = useState([
        {
        key: 'photos/animals/cat in a hat.png',
        modified: 0,
        size: 1.5 * 1024 * 1024,
        }
    ,]);

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_FILES}?path=`)
            .then((response) => response.json())
            .then((fileData) => {
                if(fileData?.length !== 0) {
                    const newFilesToSet = [];
                    fileData.forEach(pathData => {
                        if(isDirectory(pathData)) {
                            getFilesInDirectory(pathData + "/", newFilesToSet);
                        }
                        else newFilesToSet.push({
                            key: pathData,
                            modified: 0,
                            size: 1.5 * 1024 * 1024,
                        });
                    })
                    if(newFilesToSet) setMyFiles(newFilesToSet);
                }
            })
            .catch((error) => {
                alert("Failed to get files " + error);
            });
    },[])

    /**
     * Gets files from desired directory and adds it to the newFilesToSet array
     * @param directory Directory to get files from
     * @param newFilesToSet array to add files to
     */
    const getFilesInDirectory = (directory, newFilesToSet) => {
        SecureFetch(`${config.url.API_GET_FILES}?path=${directory}`)
            .then((response) => response.json())
            .then((fileData) => {
                if(fileData?.length !== 0) {
                    fileData.forEach(pathData => {
                        if(isDirectory(pathData)) getFilesInDirectory(directory + pathData + '/', newFilesToSet);
                        else newFilesToSet.push({
                            key: directory + pathData,
                            modified: 0,
                            size: 1.5 * 1024 * 1024,
                        });
                    })
                // Empty directory
                } else {
                    newFilesToSet.push({
                        key: directory + '/',
                        modified: 0,
                        size: 1.5 * 1024 * 1024,
                    });
                }
            })
            .catch((error) => {
                alert("Failed to get files " + error);
            });
    }

    /*
    * This is the anon func for when a file is confirmed to be deleted.
    */
    /*const removeFile = (event) => {

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
    }*/

    /*const removeFileContent = () => {
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
    }*/


    // NEW FILE MANAGER CODE VVV

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
     * Creates a new folder in given directory
     * @param key directory to make a new folder in
     */
    const handleCreateFolder = (key) => {
        SecureFetch(`${config.url.API_POST_CREATE_DIRECTORY}?path=${key.substring(0, key.length-1)}`, {
            method: "post"
        })
            .then((response) => response.json())
            .then(() => {
                setMyFiles( myFiles => [...myFiles, {
                    key: key,
                    modified: 0,
                    size: 1.5 * 1024 * 1024,
                }]);
            })
            .catch((error) => {
                alert("Failed to create directory: " + error)
            });
    }

    const handleCreateFile = (files, prefix) => {
        // Create new file entry to add
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
        // Check that each of the new uploaded files are not already there (duplicated)
        newFiles.map((newFile) => {
            let exists = false;
            myFiles.map((existingFile) => {
                // Already existing file found
                if (existingFile.key === newFile.key) {
                    exists = true;
                }
            })
            if (!exists) {
                uniqueNewFiles.push(newFile)
            }
        })
        setMyFiles(myFiles.concat(uniqueNewFiles));
    }

    const handleRenameFolder = (oldKey, newKey) => {
        const newFiles = [];
        myFiles.map((file) => {
            if(file.key.substring(0, oldKey.length) === oldKey) {
                newFiles.push(
                    {
                    ...file,
                    key: file.key.replace(oldKey, newKey),
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
            if (file.key === oldKey) {
                newFiles.push(
                    {
                        ...file,
                        key: newKey,
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
                onCreateFiles={handleCreateFile}
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