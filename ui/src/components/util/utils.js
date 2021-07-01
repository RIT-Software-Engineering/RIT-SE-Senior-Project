import moment from "moment";
import "moment-timezone";
import _ from "lodash";
import { SERVER_TIMEZONE } from "./constants";

export const parseDate = (dateTime) => {
    return parseMomentDate(dateTime).toDate();
}

const parseMomentDate = (dateTime) => {
    return moment(dateTime).tz(SERVER_TIMEZONE);
}

export const formatDateTime = (dateTime) => {
    let date = parseMomentDate(dateTime);
    return `${date.format('L')} ${date.format("LT")}`
};

export const formatDate = (date) => {
    let dateObj = parseMomentDate(date);
    return `${dateObj.format('L')}`;
};

/**
 * Generate dropdown options from semesterData.
 * 
 * @param {*} semesterData 
 * @param {*} semestersOnly if semestersOnly is true, then omit the "no semester" option
 */
export const createSemesterDropdownOptions = (semesterData, semestersOnly = false) => {
    const options = semestersOnly ? [] : [{ key: "noSemester", text: "No Semester", value: null }];
    const semesters = _.sortBy(semesterData, ["end_date", "start_date"]).reverse();
    semesters.forEach(semester => {
        options.push({ key: semester.semester_id, text: semester.name, value: semester.semester_id })
    });
    return options;
}

export const isSemesterActive = (end_date) => {
    if (end_date === null || end_date === undefined) {
        return true;
    }
    return new Date() < parseDate(end_date)
}
