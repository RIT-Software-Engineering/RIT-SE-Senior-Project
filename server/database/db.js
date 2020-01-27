/**
 * Responsible for coordinating interactions with the senior_projects database
*/
const PATH = require('path');
const SQLITE3 = require('sqlite3').verbose();
const CONFIG = require('./db_config');

let seniorProjectsDB;

/**
 * @function openReadWrite Opens the database in memory with read/write capabilities
 */
function openReadWrite() {
    seniorProjectsDB = new SQLITE3.Database(PATH.join(__dirname, CONFIG.dbFileName), SQLITE3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
}

function selectAll() {
    if (seniorProjectsDB) {
        let sql = `SELECT * FROM senior_projects`;

        seniorProjectsDB.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(rows); // DEBUGGING
        });
    }
}

/**
 * Takes an array of values and inserts them into a new row in the senior_projects table
 * Array must be of size nine
 * @param {Array} values 
 */
function insert(values) {
    if (seniorProjectsDB) {
        seniorProjectsDB.run(`INSERT INTO senior_projects (id, priority, title, members, sponsor, coach, synopsis, poster, website) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, values);
    }
}
let test1 = [1, 1, 'toms test', 'tom', 'also tom', 'its tom', 'toms test row', '/path/to/file', PATH.join(__dirname + '/img/test.jpg')];
let test2 = [2, 1, 'toms test 2', 'tom', 'also tom', 'its tom', 'toms test row', '/path/to/file', PATH.join(__dirname + '/img/test.jpg')];

//openReadWrite();
insert();
//selectAll();
//seniorProjectsDB.close();