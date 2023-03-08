import React, { useEffect, useState } from 'react';
import {Icon} from 'semantic-ui-react';
import { config } from '../../../util/functions/constants';
import { SecureFetch } from '../../../util/functions/secureFetch';
import FileBrowser from 'react-keyed-file-browser';
import CustomItemDetail from "./CustomItemDetail";
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';
import Moment from 'moment'

export default function FileManager() {

    // Stores the data of files to display to front end
    const [myFiles, setMyFiles] = useState([
        {
        key: 'please reopen accordion/',
        modified: 0,
        size: 0,
        }
    ,]);

    // Grabs all files and directories from /resource and adds it to set to "myFiles" front end array
    useEffect(() => {
        SecureFetch(`${config.url.API_GET_FILES}?path=`)
            .then((response) => response.json())
            .then((fileData) => {
                if(fileData?.length !== 0) {
                    const newFilesToSet = [];
                    fileData.forEach(pathData => {
                        if(isDirectory(pathData["file"])) {
                            getFilesInDirectory(pathData["file"] + "/", newFilesToSet);
                        }
                        else newFilesToSet.push({
                            key: pathData["file"],
                            modified: Moment(pathData["lastModified"]).toDate(),
                            size: pathData["size"],
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
                        if(isDirectory(pathData["file"]))
                            getFilesInDirectory(directory + pathData["file"] + '/', newFilesToSet);
                        else newFilesToSet.push({
                            key: directory + pathData["file"],
                            modified: Moment(pathData["lastModified"]).toDate(),
                            size: pathData["size"]
                        });
                    })
                // Empty directory
                } else {
                    newFilesToSet.push({
                        key: directory,
                        modified: 0,
                        size: 0,
                    });
                }
            })
            .catch((error) => {
                alert("Failed to get files " + error);
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
                    size: 0,
                }]);
            })
            .catch((error) => {
                alert("Failed to create directory: " + error)
            });
    }

    /**
     * Drag and drop functionality for uploading a file
     * @param files files to upload
     * @param prefix path to add to
     */
    const handleCreateFile = (files, prefix) => {
        const body = new FormData();
        body.append("path", prefix);
        for(let i = 0; i < files.length; i++) {
            body.append("files", files[i]);
        }
        SecureFetch(`${config.url.API_POST_UPLOAD_FILES}`, {
            method: "post",
            body: body
        })
            .then((response) => response.json())
            .then(() => {
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
                        modified: 0,
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
            })
            .catch((error) => {
                alert("Failed to upload file: " + error)
            });
    }

    /**
     * Renames selected folder
     * @param oldKey Old folder name
     * @param newKey New folder name
     */
    const handleRenameFolder = (oldKey, newKey) => {
        SecureFetch(`${config.url.API_POST_RENAME_FILES_DIRECTORY}?oldPath=${oldKey}&newPath=${newKey}`, {
            method: "post"
        })
            .then((response) => response.json())
            .then(() => {
                const newFiles = [];
                myFiles.map((file) => {
                    if(file.key.substring(0, oldKey.length) === oldKey) {
                        newFiles.push(
                            {
                                ...file,
                                key: file.key.replace(oldKey, newKey),
                                modified: 0,
                            }
                        );
                    } else {
                        newFiles.push(file);
                    }
                })
                setMyFiles(newFiles);
            })
            .catch((error) => {
                alert("Failed to rename file: " + error)
            });
    }

    /**
     * Renames selected file
     * @param oldKey Old path of file (includes old file name)
     * @param newKey New path of file (includes new file name)
     */
    const handleRenameFile = (oldKey, newKey) => {
        SecureFetch(`${config.url.API_POST_RENAME_FILES_DIRECTORY}?oldPath=${oldKey}&newPath=${newKey}`, {
            method: "post"
        })
            .then((response) => response.json())
            .then(() => {
                const newFiles = [];
                myFiles.map((file) => {
                    if (file.key === oldKey) {
                        newFiles.push(
                            {
                                ...file,
                                key: newKey,
                                modified: 0,
                            }
                        );
                    } else {
                        newFiles.push(file)
                    }
                })
                setMyFiles(newFiles);
            })
            .catch((error) => {
                alert("Failed to rename file: " + error)
            });
    }

    /**
     * Delete folder and all its files inside in file manager
     * @param folderKey array with key of folder to be deleted ex: ["archive/poop/"]
     */
    const handleDeleteFolder = (folderKey) => {
        console.log(folderKey[0])
        if(!getParentDirectory(folderKey[0]).includes("/")) {
            alert("Can not delete top level directories.");
        } else {
            SecureFetch(`${config.url.API_DELETE_DIRECTORY}?path=${folderKey[0]}`, {method: "DELETE"})
                .then((response) => response.json())
                .then(() => {
                    let parent = getParentDirectory(folderKey[0].substring(0, folderKey[0].length-1));
                        let fileCount = 0;
                        const newFiles = [];
                        myFiles.map((file) => {
                            // Keep count of items in parent directory so that if it's empty, we add the empty directory
                            // to myFiles and is displayed properly to the user
                            if (file.key.substring(0, parent.length) === folderKey[0]) {
                                fileCount++;
                            }
                            // Not (in) directory to be deleted, do not add to new array
                            console.log(getParentDirectory(file.key));
                            if(getParentDirectory(file.key) + "/" !== folderKey[0]) {
                                newFiles.push(
                                    {
                                        ...file,
                                        key: file.key,
                                        modified: 0,
                                    }
                                );
                            }
                        })
                        // If there was only one item, the directory we deleted, we add the empty parent directory to newFiles
                        if(fileCount === 1) {
                            newFiles.push({
                                key: parent + '/',
                                modified: 0,
                            });
                        }
                        setMyFiles(newFiles);
                })
                .catch((error) => {
                    alert("Failed to delete directory: " + error)
                })
        }
    }

    /**
     * Delete file in file manager
     * @param fileKey key of file to be deleted
     */
    const handleDeleteFile = (fileKey) => {
        SecureFetch(`${config.url.API_DELETE_FILE}?path=${fileKey}`, {method: "DELETE"})
            .then((response) => response.json())
            .then(() => {
                let parent = getParentDirectory(fileKey[0]);
                // Regular file in root resource directory
                if(parent === fileKey[0]) setMyFiles(myFiles.filter(file => file.key !== fileKey[0]));
                else {
                    let fileCount = 0;
                    const newFiles = [];
                    myFiles.map((file) => {
                        // File to be deleted found, don't add to newFiles and keep track of files in parent directory
                        if(file.key === fileKey[0]) {
                            fileCount++;
                        } else {
                            // Keep track of files in parent directory
                            if (getParentDirectory(file.key) === parent) {
                                fileCount++;
                            }
                            // Add files to newFiles
                            newFiles.push(
                                {
                                    ...file,
                                    key: file.key,
                                    modified: 0,
                                }
                            );
                        }
                    })
                    // If there was only one file, which we deleted, we must add the empty parent directory to newFiles
                    if(fileCount === 1) {
                        newFiles.push({
                            key: parent + '/',
                            modified: 0,
                        });
                    }
                    setMyFiles(newFiles);
                }
            })
            .catch((error) => {
                alert("Failed to delete file: " + error)
            })
    }

    /**
     * Find parent path by splitting by "/" character and excluding last element in array
     * ex: resource/archive/txt --> resource/archive
     * @param path given path
     */
    const getParentDirectory = (path) => {
        const split = path.split('/');
        if(split.length !== 1) {
            return split.slice(0,-1).join('/');
        } else {
            return path;
        }
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
                detailRenderer={CustomItemDetail}
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
