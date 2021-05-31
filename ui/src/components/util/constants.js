const BASE_API_URL =
    process.env.NODE_ENV === "development" ? `${window.location.protocol}//localhost:3001` : `https://seniorproject.se.rit.edu`;    // Production URLs should always be HTTPS
const BASE_URL = process.env.NODE_ENV === "development" ? `${window.location.protocol}//localhost:3000` : `https://seniorproject.se.rit.edu`;   // Production URLs should always be HTTPS

export const config = {
    url: {
        BASE_URL: BASE_URL,
        BASE_API_URL: BASE_API_URL,

        PROPOSAL_FORM: `${BASE_URL}/proposal-form`,

        // No auth needed
        API_GET_EXEMPLARY_PROJECTS: `${BASE_API_URL}/db/selectExemplary`,
        API_GET_POSTER: `${BASE_API_URL}/db/getPoster`,
        API_POST_SUBMIT_PROJECT: `${BASE_API_URL}/db/submitProposal`,
        API_WHO_AM_I: `${BASE_API_URL}/db/whoami`,

        // GET - Auth needed
        API_GET_PROJECTS: `${BASE_API_URL}/db/getProjects`,
        API_GET_SEMESTERS: `${BASE_API_URL}/db/getSemesters`,
        API_GET_ACTIONS: `${BASE_API_URL}/db/getActions`,
        API_GET_PROPOSAL_PDF: `${BASE_API_URL}/db/getProposalPdf`,
        API_GET_PROPOSAL_ATTACHMENT: `${BASE_API_URL}/db/getProposalAttachment`,
        API_GET_STUDENT_INFO: `${BASE_API_URL}/db/selectAllStudentInfo`,
        API_GET_ACTIVE_SEMESTERS: `${BASE_API_URL}/db/getActiveSemesters`,
        API_GET_ACTIVE_PROJECTS: `${BASE_API_URL}/db/getActiveProjects`,
        API_GET_ACTIVE_TIMELINES: `${BASE_API_URL}/db/getActiveTimelines`,
        API_GET_ACTION_LOGS: `${BASE_API_URL}/db/getActionLogs`,
        API_GET_ALL_COACH_INFO: `${BASE_API_URL}/db/selectAllCoachInfo`,
        API_GET_USERS: `${BASE_API_URL}/db/getUsers`,
        API_GET_ACTIVE_USERS: `${BASE_API_URL}/db/getActiveUsers`,

        // POST - Auth needed
        API_POST_EDIT_PROJECT: `${BASE_API_URL}/db/editProject?user=admin`,
        API_POST_SUBMIT_ACTION: `${BASE_API_URL}/db/submitAction?user=student`,
        API_POST_EDIT_ACTION: `${BASE_API_URL}/db/editAction`,
        API_POST_CREATE_ACTION: `${BASE_API_URL}/db/createAction`,
        API_POST_EDIT_SEMESTER: `${BASE_API_URL}/db/editSemester`,
        API_POST_CREATE_SEMESTER: `${BASE_API_URL}/db/createSemester`,
        API_POST_EDIT_USER: `${BASE_API_URL}/db/editUser`,
        API_POST_CREATE_USER: `${BASE_API_URL}/db/createUser`,
        API_POST_BATCH_CREAT_USER: `${BASE_API_URL}/db/batchCreateUser`,

        // PATCH - Auth needed
        API_PATCH_EDIT_PROPOSAL_STATUS: `${BASE_API_URL}/db/updateProposalStatus`,
    },
};

export const USERTYPES = {
    COACH: "coach",
    STUDENT: "student",
    ADMIN: "admin",
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
        }
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