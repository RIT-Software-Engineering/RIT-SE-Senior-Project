/**
 * Responsible for coordinating interactions with the senior_projects database
 * Wiki for sqlite3 on nodejs can be found at @see https://github.com/mapbox/node-sqlite3/wiki
 */
const PATH = require("path");
const SQLITE3 = require("sqlite3").verbose();
const CONFIG = require("./db_config");
const Logger = require("../logger");

/**
 * @class DBHandler takes a table name and creates an object to interact with the specified table.
 * Table names can be set post-instantiation in order to interact with other tables.
 */
module.exports = class DBHandler {
    constructor() {
        /**
         * @property The senior projects DB. Internal class use only.
         * @private
         * */
        this.seniorProjectsDB;

        this.closeDB = this.closeDB.bind(this);
    }

    /**
     * Opens up the database for read/write access. Internal class use only.
     * @private
     */
    openReadWrite() {
        this.seniorProjectsDB = new SQLITE3.Database(
            PATH.join(__dirname, CONFIG.dbFileName),
            SQLITE3.OPEN_READWRITE | SQLITE3.OPEN_CREATE,
            (err) => {
                Logger.log("Opened Database");
                if (err) {
                    Logger.error(err.message);
                }
            }
        );
    }
    /**
     * Closes the database. Internal class use only.
     * @private
     */
    closeDB() {
        if (this.seniorProjectsDB) {
            this.seniorProjectsDB.close();
            Logger.log("Closed database");
        }
    }

    /**
     * Takes a sql statement and corresponding array of values and executes it.
     * @param {String} sql The sql query to execute. Use prepared statements.
     * @param {Array} values corresponding values, if any, to prepare into the query
     * @returns {Promise} The resulting rows, if any, of the query. For operations such as insert, it will be empty.
     */
    query(sql, values = []) {
        return new Promise((resolve, reject) => {
            this.openReadWrite();
            if (this.seniorProjectsDB) {
                this.seniorProjectsDB.all(sql, values, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            }
        });
    }

    /**
     * Selects all rows from the current table
     * @param {String} table The name of the table to select all from
     * @returns {Promise} All of the rows of the given table.
     */
    selectAll(table) {
        return new Promise((resolve, reject) => {
            this.openReadWrite();
            if (this.seniorProjectsDB) {
                let sql = "SELECT * FROM " + table;

                this.seniorProjectsDB.all(sql, [], (err, rows) => {
                    this.closeDB();
                    if (err) reject(err);
                    else resolve(rows);
                });
            }
        });
    }
};
