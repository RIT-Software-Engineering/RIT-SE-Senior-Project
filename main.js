/**
 * Main entry point for the SE Senior Project web server
 * @author Tom Amaral <txa2269@rit.edu>
*/

'use strict';

// Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const routing = require('./server/routing/index');

// Constants
const port = 3000;

// Set up body parsing and file upload configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileupload({ 
    safeFileNames: true, 
    preserveExtension: true
}));

// Attach route handlers
app.use('/', routing);

// Expose posters, js, and css as public resources
app.use(express.static('./server/posters'));
app.use(express.static('./www/script'));
app.use(express.static('./www/style'));
app.use(express.static('./www/doc'));

app.listen(port);
