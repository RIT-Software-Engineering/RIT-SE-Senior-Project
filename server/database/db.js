/**
 * Responsible for coordinating interactions with the senior_projects database
*/
const PATH = require('path');
const SQLITE3 = require('sqlite3').verbose();
const CONFIG = require('./db_config');

let seniorProjects;

/**
 * @function openReadWrite Opens the database in memory with read/write capabilities
 */
function openReadWrite() {
    seniorProjects = new SQLITE3.Database(PATH.join(__dirname, CONFIG.dbFileName), SQLITE3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to ' + CONFIG.dbFileName);
    });
    
}

