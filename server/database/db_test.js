const DB_CONFIG = require('./db_config');

let DBHandler = require('./db');

var handler = new DBHandler(DB_CONFIG.tableNames.senior_projects);
var row1 = [1, 0, 'Creating an Interactive Vocabulary Practice Program', 'Team.js',
            'John Renner, Michael Timbrook, Matthew Witte, Johnathan Sellers', 
            'RIT NTID-Liberal Studies', 'Don Boyd', 
            'TeamJS-Thumb.jpg', 'NULL', 'http://teamjs.se.rit.edu/',
            'The vocabulary program is a tool for teachers to teach advanced \
            vocabulary skills to deaf students whose hearing loss has significantly \
            reduced their access to auditory English learning. ASL and other sign based \
            communication modalities in some instances do not mark all English word forms \
            and word roots. The vocabulary program provides a platform for teachers \
            to strengthen student skills through repetition and various forms of \
            enforcements. Teachers would be able to construct and share lessons that \
            focus on specific sets of words. These lessons would include information \
            such as context sentences, definitions, roots, synonyms, and antonyms. \
            The lessons will be populated with existing corpus references, but will \
            allow for editing by teachers for further customization. Teachers will \
            then be able to assign lessons to students for completion and the program \
            will provide metrics of success after the completion of a lesson. These \
            metrics will encompass grading as well as give information about certain \
            aspects of the lesson such as completion time and completion percentage. \
            The program will be accessed through a web portal. The focus of the project \
            will be to create one model lesson that is thoroughly vetted and will \
            systematically produce a stable and simple workflow for both teachers and \
            students alike.'];

handler.insert(`INSERT INTO ` + this.currentTable + 
` (id, priority, title, teamName, members, sponsor, coach, poster, video, website, synopsis) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, row1); 