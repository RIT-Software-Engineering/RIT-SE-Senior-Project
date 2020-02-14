/**
 * Responsible for coordinating interactions with the senior_projects database
*/
const PATH = require('path');
const SQLITE3 = require('sqlite3').verbose();
const CONFIG = require('./db_config');

/**
 * @class DBHandler takes a table name and creates an object to interact with the specified table. 
 * Table names can be set post-instantiation in order to interact with other tables.
 */
module.exports = class DBHandler {

    constructor(tableName) {
        if (Object.values(CONFIG.tableNames).includes(tableName)) {
            this.currentTable = tableName
            /**
             * @property The senior projects DB. Internal class use only.
             * @private
             * */
            this.seniorProjectsDB;
        }
        else {
            throw new Error(`The given table name: "${tableName}" is not in the list of valid table names from db_config.js.`);
        }
    }

    /**
     * Opens up the database for read/write access. Internal class use only.
     * @private
     */
    openReadWrite() {
        this.seniorProjectsDB = new SQLITE3.Database(PATH.join(__dirname, CONFIG.dbFileName), SQLITE3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }
    /**
     * Closes the database. Internal class use only.
     * @private 
     */
    closeDB() {
        if(this.seniorProjectsDB) {
            this.seniorProjectsDB.close();
        }
    }

    /**
     * Takes an array of values and inserts them into a new row in the current table
     * @param {Array} values must match the field count of the table
    */
    insert(values) {
        this.openReadWrite();
        if (this.seniorProjectsDB) {
            this.seniorProjectsDB.run(`INSERT INTO ` + this.currentTable + ` (id, priority, title, members, sponsor, coach, synopsis, poster, website) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, values);
        }
        this.closeDB();
    }

    /**
     * Takes a row id and deletes the row from the current table
     * @param {int} id row id of the row to be deleted
     */
    deleteById(id) {
        this.openReadWrite();
        if(this.seniorProjectsDB) {
            this.seniorProjectsDB.run(`DELETE FROM ` + this.currentTable + ` WHERE id=?`, id, function(error) {
                if(err) {
                    console.error(err.message);
                }
                console.log(`Row deleted: ${this.changes}`);
            })
        }
        this.closeDB();
    }

    /**
     * Selects all rows from the current table
     */
    selectAll() {
        return new Promise((resolve) => {
            this.openReadWrite();
            if (this.seniorProjectsDB) {
                let sql = 'SELECT * FROM ' + this.currentTable;
                
                this.seniorProjectsDB.all(sql, [], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    resolve(rows);
                });
            }
            this.closeDB();
        });
    }
    
    select(sql, values) {
        return new Promise((resolve) => {
            this.openReadWrite();
            if(this.seniorProjectsDB) {
                this.seniorProjectsDB.all(sql, values, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    resolve(rows);
                });
            }
            
            this.closeDB();
        });
    }

};
