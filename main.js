/**
 * Main entry point for the SE Senior Project web server
 * @author Tom Amaral 
*/

const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port);
