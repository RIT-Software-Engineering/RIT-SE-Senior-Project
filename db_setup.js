const fs = require('fs')
const DBHandler = require('./server/database/db')
let db = new DBHandler()


function dropAllTables() {
    let sql = 
    `
        SELECT 
            name
        FROM 
            sqlite_master 
        WHERE 
            type ='table' AND 
            name NOT LIKE 'sqlite_%';
    `
    db.query(sql).then((values)=> {
        let delString = ""
        for (var obj of values) {
            delString = `DROP TABLE IF EXISTS ${obj["name"]};\n`
            db.query(delString).catch((err) => {
                console.log(err)
            })
        }
    }).catch((err) => {
        console.log(err)
    })
}
dropAllTables()