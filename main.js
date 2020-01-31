/**
 * Main entry point for the SE Senior Project web server
 * @author Tom Amaral 
*/

const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const DB_CONFIG = require('./server/database/db_config');

let DBHandler = require('./server/database/db');

// var handler = new DBHandler(DB_CONFIG.tableNames.senior_projects);
// var test1 = [1, 1, "Tom's Test Row", 'Tom', 'S. Malachowsky', 'S. Malachowsky', 'A test row', 'test.jpg', 'www.google.com'];

// handler.insert(test1);


app.get('/db/selectAll', (req, res) => {
    let handler = new DBHandler(DB_CONFIG.tableNames.senior_projects);
    handler.selectAll().then(function(value) {
        console.log(value);
        res.send(value);
    });
});

app.get('/db/getPoster', (req, res) => {
    let screenedFileName = path.normalize(req.query.fileName).replace(/\\|\//g, ''); // attempt to avoid any path traversal issues

    res.sendFile(path.join(__dirname, '/server/posters/' + screenedFileName));
});

app.use('/', express.static('./www'));
app.use('/', express.static('./server/posters'));
app.listen(port);

