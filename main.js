/**
 * Main entry point for the SE Senior Project web server
 * @author Tom Amaral 
*/

const express = require('express');
const app = express();
const port = 3000;
const path = require('path')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/www/test.html'));
});

app.listen(port);
