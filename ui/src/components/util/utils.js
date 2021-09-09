import moment from "moment-timezone";
import _ from "lodash";
import { SERVER_TIMEZONE } from "./constants";

export const parseDate = (dateTime) => {
    return parseMomentDate(dateTime).toDate();
}

const parseMomentDate = (dateTime) => {
    let newTime = moment(dateTime).utcOffset(0, true);
    return newTime.tz(SERVER_TIMEZONE);
}

export const formatDateTime = (dateTime) => {
    let date = parseMomentDate(dateTime);
    return `${date.format('L LT')}`
};

export const formatDate = (date) => {
    let dateObj = parseMomentDate(date);
    return `${dateObj.format('L')}`;
};

/**
 * Use this in conjunction with createSemesterDropdownOptions.
 *
 * This is needed because Semantic UI dropdowns can't have a value of just null.
 */
export const SEMESTER_DROPDOWN_NULL_VALUE = "null";

/**
 * Generate dropdown options from semesterData. Use this in conjunction with SEMESTER_DROPDOWN_NULL_VALUE.
 * 
 * @param {*} semesterData 
 * @param {*} semestersOnly if semestersOnly is true, then omit the "no semester" option
 */
export const createSemesterDropdownOptions = (semesterData, semestersOnly = false) => {
    // Can't use a value of just null because Semantic UI dropdowns don't match it with the selected value.
    const options = semestersOnly ? [] : [{ key: "noSemester", text: "No Semester", value: SEMESTER_DROPDOWN_NULL_VALUE }];
    const semesters = _.sortBy(semesterData, ["end_date", "start_date"]).reverse();
    semesters.forEach(semester => {
        options.push({ key: semester.semester_id, text: semester.name, value: semester.semester_id })
    });
    return options;
}

export const isSemesterActive = (start_date, end_date) => {
    if (end_date === null || end_date === undefined) {
        return true;
    }
    return parseDate(start_date) <= new Date() && parseDate(end_date) >= new Date();
}
