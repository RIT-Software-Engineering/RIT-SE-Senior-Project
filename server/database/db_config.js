/**
 * Responsible for maintaining variables and configurations for database management
 */

 module.exports = {
    dbFileName: 'senior_project.db',
    /**
     * @property An enumeration of the valid table names in the database 
     * (  its an object so you can modify the actual table names without touching the code :P  )
     */
    tableNames: {
        senior_projects:    'senior_projects',
        sponsor_info:       'sponsor_info'
    }
 }