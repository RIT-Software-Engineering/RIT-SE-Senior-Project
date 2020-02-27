/**
 * Main entry point for the SE Senior Project web server
 * @author Tom Amaral 
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;
const path = require('path')
const DB_CONFIG = require('./server/database/db_config');
const DBHandler = require('./server/database/db');

let db = new DBHandler();

app.use(bodyParser.urlencoded({ extended: true }));


//#region 'Select All' Routes

app.get('/db/selectAllSponsorInfo', (req, res) => {
    db.selectAll(DB_CONFIG.tableNames.sponsor_info).then(function(value) {
        console.log(value);
        res.send(value);
    });
});

app.get('/db/selectAllStudentInfo', (req, res) => {
    res.status(404).send('Sorry, route not yet available');
    /*
    db.selectAll(DB_CONFIG.tableNames.student_info).then(function(value) {
        console.log(value);
        res.send(value);
    });
    */
});

app.get('/db/selectAllCoachInfo', (req, res) => {
    res.status(404).send('Sorry, route not yet available');
    /*
    db.selectAll(DB_CONFIG.tableNames.coach_info).then(function(value) {
        console.log(value);
        res.send(value);
    });
    */
});

app.get('/db/selectExemplary', (req, res) => {
    let sql = 'SELECT * FROM ' + DB_CONFIG.tableNames.senior_projects + ' WHERE priority = ?';
    let values = [0];

    db.select(sql, values).then(function(value) {
        res.send(value);
    });
});
//#endregion

app.post('/db/submitProposal', (req, res) => {
    res.send(req.body)
});


app.get('/db/getPoster', (req, res) => {
    let screenedFileName = path.normalize(req.query.fileName).replace(/\\|\//g, ''); // attempt to avoid any path traversal issues

    res.sendFile(path.join(__dirname, '/server/posters/' + screenedFileName));
});



app.use('/', express.static('./www'));
app.use('/', express.static('./www/admin'));
app.use('/', express.static('./server/posters'));
app.listen(port);
