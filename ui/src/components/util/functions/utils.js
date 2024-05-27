import moment from "moment-timezone";
import _ from "lodash";
import { SERVER_TIMEZONE } from "./constants";

export const parseDateNoOffset = (dateTime) => {
    return moment(dateTime);
}

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

export const formatDateNoOffset = (date) => {
    return `${parseDateNoOffset(date).format('L')}`;
}

// Month+1 in Date constructor to account for how it determines month from numbers
export const daysInMonth = (month, year) => {
    return new Date(year, month+1, 0).getDate();
}

// magic number 86400000 is milli * sec * min * hr
// difference in days
export const dateDiff = (firstDateTime, secondDateTime) => {
    return Math.floor((secondDateTime - firstDateTime) / 86400000);
}

export const numDaysLeftInYear = (dateTime) => {
    let nextYear = new Date(dateTime.getFullYear() + 1, 0, 1);

    return Math.floor((nextYear - dateTime) / 86400000);
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

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

/**
 * Converts a string to a url-friendly slug
 * @param str string
 * @returns {string} slug
 */
export const slugify = (str) => {
    if(str === undefined) return "";
    return str.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

