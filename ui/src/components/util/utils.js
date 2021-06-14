import moment from "moment";
import _ from "lodash";

const formatDateTimeString = (dateTime) => {
    // Note: Non-chromium browsers (i.e Firefox, Safari) can't parse dates in the format YYYY-MM-DD,
    // they need dates in the format YYYY/MM/DD.
    return `${dateTime.replaceAll("-", "/")} GMT`
}

export const formatDateTime = (datetime) => {
    let date = new Date(formatDateTimeString(datetime));
    return `${moment(date).format('L')} ${moment(date).format("LT")}`
};

export const formatDate = (date) => {
    let dateObj = new Date(formatDateTimeString(date));
    return `${moment(dateObj).format('L')}`
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
