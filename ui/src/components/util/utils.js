import moment from "moment";
import _ from "lodash";

export const formatDateTime = (datetime) => {
    let date = new Date(datetime + " UTC");
    return `${moment(date).format('L')} ${moment(date).format("LT")}`
};

export const formatDate = (date) => {
    let dateObj = new Date(date + " UTC");
    return `${moment(dateObj).format('L')}`
};

/**
 * Generate dropdown options from semesterData.
 * 
 * @param {*} semesterData 
 * @param {*} semestersOnly if semestersOnly is true, then omit the "no semester" option
 */
export const createSemesterDropdownOptions = (semesterData, semestersOnly = false) => {
    const options = semestersOnly ? [] : [{ key: "noSemester", text: "No Semester", value: "" }];
    const semesters = _.sortBy(semesterData, ["end_date", "start_date"])
    semesters.forEach(semester => {
        options.push({ key: semester.semester_id, text: semester.name, value: semester.semester_id?.toString() })
    });
    return options;
}
