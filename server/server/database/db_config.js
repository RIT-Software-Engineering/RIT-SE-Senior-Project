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
        senior_projects:    'archive',
    },
    senior_project_proposal_keys : [
        'title', 
        'organization', 
        'primary_contact', 
        'contact_email', 
        'contact_phone',
        'background_info', 
        'project_description', 
        'project_scope', 
        'project_challenges',
        'sponsor_provided_resources', 
        'constraints_assumptions', 
        'sponsor_deliverables',
        'proprietary_info', 
        'sponsor_alternate_time', 
        'sponsor_avail_checked', 
        'project_agreements_checked',
        'assignment_of_rights'
    ]

 }