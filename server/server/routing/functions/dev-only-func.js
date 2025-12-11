const CONSTANTS = require("../consts");
const redeployDatabase = require("../../db_setup");

/**
 * Get all users for login (development only)
 */
const devOnlyGetAllUsersForLogin = (db) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT ${CONSTANTS.SIGN_IN_SELECT_ATTRIBUTES} FROM users`;
    db.query(query)
      .then((users) => {
        resolve(users);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Redeploy database (development only)
 */
const devOnlyRedeployDatabase = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await redeployDatabase();
      resolve({
        success: true,
        message: "Database redeployed successfully",
      });
    } catch (error) {
      reject({
        success: false,
        message: "Failed to redeploy database",
        error: error.message,
      });
    }
  });
};

module.exports = {
  devOnlyGetAllUsersForLogin,
  devOnlyRedeployDatabase,
};
