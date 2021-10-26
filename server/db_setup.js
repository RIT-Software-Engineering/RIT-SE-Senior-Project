/**
 *  !! FOR DEV USE ONLY !!
 *
 *  Contains functions useful for rapidly resetting database schema and inserting dummy info during development
 */

const fs = require("fs");
const path = require("path");
const DBHandler = require("./server/database/db");
let db = new DBHandler();

const table_sql_path = "./server/database/table_sql";
const dummy_data_path = "./server/database/test_data";

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
                    Promise.resolve(db.query(delString).catch((err) => {
                        reject(`${obj["name"]} : ${err}`);
                    }));
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

            for (file of files) {
                fs.readFile(path.join(table_sql_path, file), "utf8", (err, sql) => {
                    Promise.resolve(db.query(sql).catch((err) => {
                        reject(`${file} : ${err}`);
                    }));
                });
            }
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

            for (file of files) {
                fs.readFile(path.join(dummy_data_path, file), "utf8", (err, sql) => {
                    Promise.resolve(db.query(sql).catch((err) => {
                        reject(`${file} : ${err}`);
                    }));
                });
            }
            setTimeout(() => {
                resolve();
            }, 3000);
        });
    });
}

async function redeployDatabase() {
    try {
        Logger.log("Starting database redeploy");
        if (process.env.NODE_ENV === 'production') {
            throw new Error("TRYING TO RESET DATABASE ON THE PRODUCTION SERVER, COMMENT OUT THIS CHECK TO RESET DATABASE ON PRODUCTION");
        }
        await dropAllTables()
        await createAllTables()
        await populateDummyData()
        Logger.log("Done redeploying database");
    } catch (error) {
        console.error(error);
    }
}

module.exports = redeployDatabase;
