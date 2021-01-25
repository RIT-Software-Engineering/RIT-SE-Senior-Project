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
                    db.query(delString).catch((err) => {
                        reject(`${obj["name"]} : ${err}`);
                    });
                }
                setTimeout(resolve, 2000); // wait for the last SQL statement to execute before moving on
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

            for (name of files) {
                fs.readFile(path.join(table_sql_path, name), "utf8", (err, sql) => {
                    db.query(sql).catch((err) => {
                        reject(`${name} : ${err}`);
                    });
                });
            }
            setTimeout(resolve, 2000); // wait for the last SQL statement to execute
        });
    });
}

function populateDummyData() {
    return new Promise((resolve, reject) => {
        fs.readdir(dummy_data_path, (err, files) => {
            if (err) {
                reject(err);
            }

            for (name of files) {
                fs.readFile(path.join(dummy_data_path, name), "utf8", (err, sql) => {
                    db.query(sql).catch((err) => {
                        reject(`${name} : ${err}`);
                    });
                    setTimeout(resolve, 2000);
                });
            }
        });
    });
}

function redeployDatabase() {
    dropAllTables()
        .then(() => {
            createAllTables()
                .then(() => {
                    populateDummyData().catch((err) => {
                        console.log(err);
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
}

redeployDatabase();
