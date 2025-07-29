import { USERTYPES } from "./constants";
import { SecureFetch } from "./secureFetch";
import { config } from "./constants";

/**
 * Check if the current user is a member of the given project
 * @param {Object} user - The current user object from UserContext
 * @param {Object} project - The project object
 * @param {Array} projectMembers - Optional array of project members if already fetched
 * @returns {Promise<boolean>} - True if user is a member, false otherwise
 */
export const isProjectMember = async (user, project, projectMembers = null) => {
  if (!user || !project) {
    return false;
  }

  // Admins can edit any project
  if (user.role === USERTYPES.ADMIN) {
    return true;
  }

  // If project members are already provided, use them
  if (projectMembers) {
    return projectMembers.some(
      (member) =>
        member.system_id === user.system_id &&
        (member.type === user.role || member.type === user.type),
    );
  }

  // Fetch project members if not provided
  try {
    const response = await SecureFetch(
      `${config.url.API_GET_PROJECT_MEMBERS}?project_id=${project.project_id}`,
    );
    const members = await response.json();

    return members.some(
      (member) =>
        member.system_id === user.system_id &&
        (member.type === user.role || member.type === user.type),
    );
  } catch (error) {
    console.error("Error checking project membership:", error);
    return false;
  }
};

/**
 * Check if user can edit/add content for a project
 * @param {Object} user - The current user object from UserContext
 * @param {Object} project - The project object
 * @param {Array} projectMembers - Optional array of project members if already fetched
 * @returns {Promise<boolean>} - True if user can edit, false otherwise
 */
export const canEditProject = async (user, project, projectMembers = null) => {
  if (!user || !project) {
    return false;
  }

  // Admins can always edit
  if (user.role === USERTYPES.ADMIN) {
    return true;
  }

  // Check if user is a member of the project
  return await isProjectMember(user, project, projectMembers);
};

/**
 * Check if user can add/edit website content for a project
 * This is stricter than general project editing
 * @param {Object} user - The current user object from UserContext
 * @param {Object} project - The project object
 * @param {Array} projectMembers - Optional array of project members if already fetched
 * @returns {Promise<boolean>} - True if user can edit website, false otherwise
 */
export const canEditProjectWebsite = async (
  user,
  project,
  projectMembers = null,
) => {
  if (!user || !project) {
    return false;
  }

  // Admins can always edit
  if (user.role === USERTYPES.ADMIN) {
    return true;
  }

  // View-only users cannot edit
  if (
    user.view_only === "TRUE" ||
    user.view_only === true ||
    user.view_only === "1"
  ) {
    return false;
  }

  // Check if user is a member of the project
  return await isProjectMember(user, project, projectMembers);
};
