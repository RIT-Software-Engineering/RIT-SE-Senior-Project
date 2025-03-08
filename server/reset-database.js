const redeployDatabase = require("./db_setup");
const fs = require("fs");
const dbConfig = require("./server/database/db_config.js");

console.log("Creating db backup");

const currentTime = new Date().toISOString();
const dest = `./server/database/${currentTime}-${dbConfig.dbFileName}`;

fs.copyFileSync(
    `./server/database/${dbConfig.dbFileName}`,
    dest,
    fs.constants.COPYFILE_EXCL
);

console.log("Backup made:", dest);

redeployDatabase();
