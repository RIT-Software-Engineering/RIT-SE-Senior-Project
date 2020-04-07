/**
 * A place for global variables to be configured and made available
*/

const path = require('path');


module.exports = {
    accepted_file_types: [
        '.pdf',
        '.jpeg',
        '.jpg',
        '.png',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
        '.ppt',
        '.pptx',
        '.rtf',
        '.csv'
    ],
    www_path: path.join(__dirname + '/../www/')

}