const BASE_API_URL =
    process.env.NODE_ENV === "development" ? `${window.location.protocol}//localhost:${process.env.REACT_APP_PORT}` : process.env.REACT_APP_BASE_URL;    // Production URLs should always be HTTPS
const BASE_URL = process.env.NODE_ENV === "development" ? `${window.location.protocol}//localhost:${process.env.REACT_APP_PORT}` : process.env.REACT_APP_BASE_URL;   // Production URLs should always be HTTPS


export const config = {
    url: {
        BASE_URL: BASE_URL,
        BASE_API_URL: BASE_API_URL,
        WWW: `${BASE_URL}/www`,
        LOGOUT_SUCCESS: "https://shibboleth.main.ad.rit.edu/logout.html",

        API_LOGIN: `${BASE_API_URL}/saml/login`,
        API_LOGOUT: `${BASE_API_URL}/saml/logout`,

        PROPOSAL_FORM: `${BASE_URL}/proposal-form`,

        // No auth needed
        API_GET_EXEMPLARY_PROJECTS: `${BASE_API_URL}/db/selectExemplary`,
        API_GET_POSTER: `${BASE_API_URL}/db/getPoster`,
        API_POST_SUBMIT_PROJECT: `${BASE_API_URL}/db/submitProposal`,

        // GET - Auth needed
        API_WHO_AM_I: `${BASE_API_URL}/saml/whoami`,
        API_GET_PROJECTS: `${BASE_API_URL}/db/getProjects`,
        API_GET_MY_PROJECTS: `${BASE_API_URL}/db/getMyProjects`,
        API_GET_SEMESTER_PROJECTS: `${BASE_API_URL}/db/getSemesterProjects`,
        API_GET_CANDIDATE_PROJECTS: `${BASE_API_URL}/db/getCandidateProjects`,
        API_GET_PROJECT_MEMBERS: `${BASE_API_URL}/db/getProjectMembers`,
        API_GET_SEMESTERS: `${BASE_API_URL}/db/getSemesters`,
        API_GET_ACTIONS: `${BASE_API_URL}/db/getActions`,
        API_GET_SEMESTER_ANNOUNCEMENTS: `${BASE_API_URL}/db/getSemesterAnnouncements`,
        API_GET_TIMELINE_ACTIONS: `${BASE_API_URL}/db/getTimelineActions`,
        API_GET_PROPOSAL_PDF: `${BASE_API_URL}/db/getProposalPdf`,
        API_GET_PROPOSAL_ATTACHMENT: `${BASE_API_URL}/db/getProposalAttachment`,
        API_GET_STUDENT_INFO: `${BASE_API_URL}/db/selectAllStudentInfo`,
        API_GET_NON_STUDENT_INFO: `${BASE_API_URL}/db/selectAllNonStudentInfo`,
        API_GET_ACTIVE_PROJECTS: `${BASE_API_URL}/db/getActiveProjects`,
        API_GET_ACTIVE_TIMELINES: `${BASE_API_URL}/db/getActiveTimelines`,
        API_GET_ACTION_LOGS: `${BASE_API_URL}/db/getActionLogs`,
        API_GET_ALL_ACTION_LOGS: `${BASE_API_URL}/db/getAllActionLogs`,
        API_GET_SUBMISSION: `${BASE_API_URL}/db/getSubmission`,
        API_GET_SUBMISSION_FILE: `${BASE_API_URL}/db/getSubmissionFile`,
        API_GET_ALL_COACH_INFO: `${BASE_API_URL}/db/selectAllCoachInfo`,
        API_GET_PROJECT_COACHES: `${BASE_API_URL}/db/getProjectCoaches`,
        API_GET_PROJECT_STUDENTS: `${BASE_API_URL}/db/getProjectStudents`,
        API_GET_ACTIVE_COACHES: `${BASE_API_URL}/db/getActiveCoaches`,
        API_GET_SEMESTER_STUDENTS: `${BASE_API_URL}/db/getSemesterStudents`,
        API_GET_ACTIVE_USERS: `${BASE_API_URL}/db/getActiveUsers`,
        API_GET_ALL_SPONSORS: `${BASE_API_URL}/db/getAllSponsors`,

        // POST - Auth needed
        API_POST_EDIT_PROJECT: `${BASE_API_URL}/db/editProject`,
        API_POST_SUBMIT_ACTION: `${BASE_API_URL}/db/submitAction`,
        API_POST_EDIT_ACTION: `${BASE_API_URL}/db/editAction`,
        API_POST_CREATE_ACTION: `${BASE_API_URL}/db/createAction`,
        API_POST_EDIT_SEMESTER: `${BASE_API_URL}/db/editSemester`,
        API_POST_CREATE_SEMESTER: `${BASE_API_URL}/db/createSemester`,
        API_POST_EDIT_USER: `${BASE_API_URL}/db/editUser`,
        API_POST_CREATE_USER: `${BASE_API_URL}/db/createUser`,
        API_POST_BATCH_CREAT_USER: `${BASE_API_URL}/db/batchCreateUser`,
        API_POST_UPLOAD_FILES: `${BASE_API_URL}/db/uploadFiles`,
        API_POST_BACKUP_DATABASE: `${BASE_API_URL}/db/backupDatabase`,

        // PATCH - Auth needed
        API_PATCH_EDIT_PROPOSAL_STATUS: `${BASE_API_URL}/db/updateProposalStatus`,




        // *** DEVELOPMENT ONLY ***
        DEV_ONLY_API_GET_ALL_USERS: `${BASE_API_URL}/db/DevOnlyGetAllUsersForLogin`,
    },
};

export const USERTYPES = {
    COACH: "coach",
    STUDENT: "student",
    ADMIN: "admin",
}

export const ACTION_TARGETS = {
    individual: 'individual',
    team: 'team',
    coach: 'coach',
    admin: 'admin',
    student_announcement: 'student_announcement',
    coach_announcement: 'coach_announcement',
}

export const DROPDOWN_ITEMS = {
    actionTarget: [
        {
            key: "individual",
            text: "Individual",
            value: "individual",
        },
        {
            key: "team",
            text: "Team",
            value: "team",
        },
        {
            key: "coach",
            text: "Coach",
            value: "coach",
        },
        {
            key: "admin",
            text: "Admin",
            value: "admin",
        },
        {
            key: "student_announcement",
            text: "Student Announcement",
            value: "student_announcement",
        },
        {
            key: "coach_announcement",
            text: "Coach Announcement",
            value: "coach_announcement",
        },
    ],

    userTypes: [
        {
            key: "student",
            value: "student",
            text: "Student",
        },
        {
            key: "coach",
            value: "coach",
            text: "Coach",
        },
        {
            key: "admin",
            value: "admin",
            text: "Admin",
        },
    ]
}

export const PROJECT_STATUSES = {
    SUBMITTED: "submitted",
    NEEDS_REVISION: "needs revision",
    REJECTED: "rejected",
    FUTURE_PROJECT: "future project",
    CANDIDATE: "candidate",
    IN_PROGRESS: "in progress",
    COMPLETE: "completed",
    ARCHIVED: "archive",
};

export const ACTION_STATES = {
    YELLOW: "yellow",
    RED: "red",
    GREEN: "green",
    GREY: "grey",
}

export const SERVER_TIMEZONE = "America/New_York";

export const DEFAULT_UPLOAD_LIMIT = 15 * 1024 * 1024