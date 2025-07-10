/**
 *  !! FOR DEV USE ONLY !!
 *
 *  Contains functions useful for rapidly resetting database schema and inserting dummy info during development
 */

const fs = require("fs");
const path = require("path");
const DBHandler = require("./server/database/db");
let db = new DBHandler();
const Logger = require("./server/logger");

const table_sql_path = "./server/database/table_sql";
const dummy_data_path = "./server/database/test_data";

// Define dummy files that should be preserved during reset
const PRESERVE_FILES = [
  "resource/archivePosters/dummy/groweasy_thumb.png",
  "resource/archivePosters/dummy/smartspark_thumb.png",
  "resource/archivePosters/dummy/techtitan_thumb.png",
  "resource/archiveVideos/trendtide-real-time-market-trend-prediction-dashboard-video",
];

function dropAllTables() {
  return new Promise((resolve, reject) => {
    let sql = `
            SELECT 
                name
            FROM 
                sqlite_master 
            WHERE 
                type ='table' AND 
                name NOT LIKE 'sqlite_%';
        `;
    db.query(sql)
      .then((values) => {
        let delString = "";
        for (let obj of values) {
          delString = `DROP TABLE IF EXISTS ${obj["name"]};\n`;
          Promise.resolve(
            db.query(delString).catch((err) => {
              reject(`${obj["name"]} : ${err}`);
            }),
          );
        }
        setTimeout(() => {
          resolve();
        }, 1000);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function createAllTables() {
  return new Promise((resolve, reject) => {
    fs.readdir(table_sql_path, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      files
        .filter((file) => file.toString() != "create_all_tables.sql")
        .forEach((file) => {
          fs.readFile(path.join(table_sql_path, file), "utf8", (_err, sql) => {
            Promise.resolve(
              db.query(sql).catch((err) => {
                reject(`${file} : ${err}`);
              }),
            );
          });
        });
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  });
}

function populateDummyData() {
  return new Promise((resolve, reject) => {
    fs.readdir(dummy_data_path, (err, files) => {
      if (err) {
        reject(err);
      }

      files
        .filter((file) => file.toString() != "fill_test_data.sql")
        .forEach((file) => {
          fs.readFile(path.join(dummy_data_path, file), "utf8", (_err, sql) => {
            Promise.resolve(
              db.query(sql).catch((err) => {
                reject(`${file} : ${err}`);
              }),
            );
          });
        });
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  });
}

function clearUploadedFiles() {
  return new Promise((resolve, reject) => {
    try {
      Logger.log("Starting file system cleanup");

      // Directories to clean
      const directoriesToClean = [
        path.join(__dirname, "resource"),
        path.join(__dirname, "server", "project_docs"),
      ];

      // Function to recursively get all files in a directory
      function getAllFiles(dirPath, arrayOfFiles = []) {
        if (!fs.existsSync(dirPath)) {
          return arrayOfFiles;
        }

        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
          const fullPath = path.join(dirPath, file);
          if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
          } else {
            arrayOfFiles.push(fullPath);
          }
        });

        return arrayOfFiles;
      }

      // Convert preserve paths to absolute paths for comparison
      const preserveAbsolute = PRESERVE_FILES.map((filePath) =>
        path.join(__dirname, filePath),
      );

      directoriesToClean.forEach((dirToClean) => {
        if (fs.existsSync(dirToClean)) {
          const allFiles = getAllFiles(dirToClean);

          // Delete files that are not in the preserve list
          allFiles.forEach((filePath) => {
            const shouldPreserve = preserveAbsolute.some(
              (preservePath) =>
                path.normalize(filePath) === path.normalize(preservePath),
            );

            if (!shouldPreserve) {
              try {
                fs.unlinkSync(filePath);
                Logger.log(`Deleted file: ${filePath}`);
              } catch (err) {
                Logger.log(`Failed to delete file ${filePath}: ${err.message}`);
              }
            }
          });

          // Remove empty directories
          function removeEmptyDirs(dirPath) {
            if (!fs.existsSync(dirPath)) return;

            const files = fs.readdirSync(dirPath);
            if (files.length === 0) {
              // Don't delete the main directories or dummy directory
              const relativePath = path.relative(__dirname, dirPath);
              const mainDirs = [
                "resource",
                path.join("resource", "archivePosters"),
                path.join("resource", "archiveImages"),
                path.join("resource", "archiveVideos"),
                path.join("server", "project_docs"),
              ];

              const shouldPreserveDir =
                mainDirs.some(
                  (mainDir) =>
                    path.normalize(relativePath) === path.normalize(mainDir),
                ) || relativePath.endsWith("dummy");

              if (!shouldPreserveDir) {
                try {
                  fs.rmdirSync(dirPath);
                  Logger.log(`Removed empty directory: ${dirPath}`);
                  // Recursively check parent directory
                  removeEmptyDirs(path.dirname(dirPath));
                } catch (err) {
                  Logger.log(
                    `Failed to remove directory ${dirPath}: ${err.message}`,
                  );
                }
              }
            } else {
              files.forEach((file) => {
                const fullPath = path.join(dirPath, file);
                if (fs.statSync(fullPath).isDirectory()) {
                  removeEmptyDirs(fullPath);
                }
              });
            }
          }

          // Clean up empty directories
          removeEmptyDirs(dirToClean);
        }
      });

      Logger.log("File system cleanup completed");
      resolve();
    } catch (error) {
      Logger.log(`File system cleanup error: ${error.message}`);
      reject(error);
    }
  });
}

async function redeployDatabase() {
  try {
    Logger.log("Starting database redeploy");
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "TRYING TO RESET DATABASE ON THE PRODUCTION SERVER, COMMENT OUT THIS CHECK TO RESET DATABASE ON PRODUCTION",
      );
    }
    await dropAllTables();
    await createAllTables();
    await clearUploadedFiles(); // Clear uploaded files before populating dummy data
    await populateDummyData();
    Logger.log("Done redeploying database");
  } catch (error) {
    console.error(error);
    throw error; // Re-throw to ensure the API route can handle the error properly
  }
}

module.exports = redeployDatabase;
