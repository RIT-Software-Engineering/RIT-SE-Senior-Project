const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

/**
 * Upload files (admin only)
 */
const uploadFiles = (files, uploadPath) => {
  return new Promise((resolve, reject) => {
    let filesUploaded = [];

    // Attachment Handling
    if (files && files.files) {
      // If there is only one attachment, then it does not come as a list
      if (files.files.length === undefined) {
        files.files = [files.files];
      }

      const formattedPath = `resource/${uploadPath}`;
      const baseURL = path.join(__dirname, `../../${formattedPath}`);

      //If directory exists, it won't make one, otherwise it will based on the baseUrl
      fs.mkdirSync(baseURL, { recursive: true });
      for (let x = 0; x < files.files.length; x++) {
        files.files[x].mv(`${baseURL}/${files.files[x].name}`, function (err) {
          if (err) {
            reject(err);
          }
        });
        filesUploaded.push(
          `${process.env.BASE_URL}/${formattedPath}/${files.files[x].name}`,
        );
      }
    }

    resolve({ msg: "Success!", filesUploaded: filesUploaded });
  });
};

/**
 * Upload files for student with archive update
 */
const uploadFilesStudent = (db, files, uploadPath, archiveId, column) => {
  return new Promise((resolve, reject) => {
    let filesUploaded = [];

    // Attachment Handling
    if (files && files.files) {
      // If there is only one attachment, then it does not come as a list
      if (files.files.length === undefined) {
        files.files = [files.files];
      }

      const formattedPath = `resource/${uploadPath}`;
      const baseURL = path.join(__dirname, `../../${formattedPath}`);

      //If directory exists, it won't make one, otherwise it will based on the baseUrl
      fs.mkdirSync(baseURL, { recursive: true });
      for (let x = 0; x < files.files.length; x++) {
        files.files[x].mv(`${baseURL}/${files.files[x].name}`, function (err) {
          if (err) {
            reject(err);
          }
        });
        filesUploaded.push(
          `${process.env.BASE_URL}/${formattedPath}/${files.files[x].name}`,
        );

        let fileName = files.files[x].name;
        let pathString = uploadPath;
        pathString = pathString.split("/");
        pathString.shift();
        pathString = '"' + pathString.join("/") + "/" + fileName + '"';
        let query = `UPDATE archive
                     SET ${column} = ${pathString}
                     WHERE archive_id = ${archiveId}`;
        db.query(query).catch((err) => {
          reject(err);
        });
      }
    }

    resolve({ msg: "Success!", filesUploaded: filesUploaded });
  });
};

/**
 * Create a new directory
 */
const createDirectory = (directoryPath) => {
  return new Promise((resolve, reject) => {
    const formattedPath =
      directoryPath === "" ? `resource/` : `resource/${directoryPath}`;
    const baseURL = path.join(__dirname, `../../${formattedPath}`);
    if (!fs.existsSync(baseURL)) {
      fs.mkdirSync(baseURL, { recursive: true });
      resolve({ msg: "Success!" });
    } else {
      reject(new Error("Directory already exists"));
    }
  });
};

/**
 * Rename a directory or file
 */
const renameDirectoryOrFile = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    const formattedOldPath =
      oldPath === "" ? `resource/` : `resource/${oldPath}`;
    const formattedNewPath =
      newPath === "" ? `resource/` : `resource/${newPath}`;
    const baseURLOld = path.join(__dirname, `../../${formattedOldPath}`);
    const baseURLNew = path.join(__dirname, `../../${formattedNewPath}`);

    // New path already exists, so we can't rename
    if (fs.existsSync(baseURLNew)) {
      reject(new Error("Target path already exists"));
      return;
    }

    // Copy all files from old directory to new directory
    if (fs.lstatSync(baseURLOld).isDirectory()) {
      fse.copySync(baseURLOld, baseURLNew);
      fs.rmdirSync(baseURLOld, { recursive: true });
      resolve({ msg: "Success!" });
      // Rename file
    } else if (fs.lstatSync(baseURLOld).isFile()) {
      fs.renameSync(baseURLOld, baseURLNew);
      resolve({ msg: "Success!" });
    }
  });
};

/**
 * Get files in a directory
 */
const getFiles = (directoryPath) => {
  return new Promise((resolve, reject) => {
    let fileData = [];
    const formattedPath =
      directoryPath === "" ? `resource/` : `resource/${directoryPath}`;
    const baseURL = path.join(__dirname, `../../${formattedPath}`);

    if (fs.existsSync(baseURL)) {
      // Get the files in the directory
      fs.readdir(baseURL, function (err, files) {
        if (err) {
          console.error(`Error reading directory ${baseURL}:`, err);
          // Return empty array instead of throwing error for missing directories
          resolve(fileData);
          return;
        }

        try {
          const info = fs.statSync(baseURL);
          files.forEach(function (file) {
            try {
              // Only files have sizes, directories do not. Send file size if it is a file
              const fileInfo = fs.statSync(path.join(baseURL, file));
              if (fileInfo.isFile()) {
                fileData.push({
                  file: file,
                  size: fileInfo.size,
                  lastModified: fileInfo.ctime,
                });
              } else {
                fileData.push({
                  file: file,
                  size: 0,
                  lastModified: info.ctime,
                });
              }
            } catch (fileErr) {
              console.error(`Error processing file ${file}:`, fileErr);
              // Skip files that can't be processed
            }
          });
        } catch (statErr) {
          console.error(
            `Error getting directory stats for ${baseURL}:`,
            statErr,
          );
        }

        resolve(fileData);
      });
    } else {
      console.log(`Directory does not exist: ${baseURL}`);
      resolve(fileData);
    }
  });
};

/**
 * Get project files
 */
const getProjectFiles = () => {
  return new Promise((resolve, reject) => {
    let fileData = [];
    const formattedPath = `resource/`;
    const baseURL = path.join(__dirname, `../../${formattedPath}`);
    fs.mkdirSync(baseURL, { recursive: true });

    // Get the files in the directory
    fs.readdir(baseURL, function (err, files) {
      if (err) {
        reject(err);
        return;
      }
      const info = fs.statSync(baseURL);
      files.forEach(function (file) {
        // Only files have sizes, directories do not. Send file size if it is a file
        const fileInfo = fs.statSync(baseURL + file);
        if (fileInfo.isFile()) {
          fileData.push({
            file: file,
            size: fileInfo.size,
            lastModified: fileInfo.ctime,
          });
        } else {
          fileData.push({
            file: file,
            size: 0,
            lastModified: info.ctime,
          });
        }
      });
      resolve(fileData);
    });
  });
};

/**
 * Remove a file
 */
const removeFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const formattedPath = `resource/${filePath}`;
    const baseURL = path.join(__dirname, `../../${formattedPath}`);

    if (fs.existsSync(baseURL)) {
      fs.unlinkSync(baseURL);
      resolve({ msg: "Success!" });
    } else {
      reject(new Error("File does not exist"));
    }
  });
};

/**
 * Remove a directory
 */
const removeDirectory = (directoryPath) => {
  return new Promise((resolve, reject) => {
    const formattedPath =
      directoryPath === "" ? `resource/` : `resource/${directoryPath}`;
    const baseURL = path.join(__dirname, `../../${formattedPath}`);

    if (fs.existsSync(baseURL)) {
      fs.rmdirSync(baseURL, { recursive: true });
      resolve({ msg: "Success!" });
    } else {
      reject(new Error("Directory does not exist"));
    }
  });
};

module.exports = {
  uploadFiles,
  uploadFilesStudent,
  createDirectory,
  renameDirectoryOrFile,
  getFiles,
  getProjectFiles,
  removeFile,
  removeDirectory,
};
