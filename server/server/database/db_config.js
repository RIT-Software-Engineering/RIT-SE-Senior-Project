/**
 * Responsible for maintaining variables and configurations for database management
 */

module.exports = {
    dbFileName: "senior_project.db",
    /**
     * @property An enumeration of the valid table names in the database
     * (  its an object so you can modify the actual table names without touching the code :P  )
     */
    tableNames: {
        senior_projects: "projects",
        archive: "archive",
        semester: "semester_group",
        actions: "actions",
        action_logs: "action_log",
        users: "users",
        project_coaches: "project_coaches",
    },
    senior_project_proposal_keys: {
        "title": "Title",
        "organization": "Organization",
        "primary_contact": "Primary Contact",
        "contact_email": "Contact Email",
        "contact_phone": "Contact Phone",
        "background_info": "Background Info",
        "project_description": "Project Description",
        "project_scope": "Project Scope",
        "project_challenges": "Project Challenges",
        "sponsor_provided_resources": "Sponsor-Provided Resources",
        "constraints_assumptions": "Constraints and Assumptions",
        "sponsor_deliverables": "Sponsor Deliverables",
        "proprietary_info": "Proprietary Info",
        "sponsor_alternate_time": "Sponsor Alternate Time",
        "sponsor_avail_checked": "Sponsor Availability Checked",
        "project_agreements_checked": "Project Agreements Checked",
        "assignment_of_rights": "Assignment of Rights",
        "last_login": "Last Login",
        "prev_login": "Previous Login",
    },
};
