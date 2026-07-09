import dayjs from "dayjs";
import _ from "lodash";
import { SERVER_TIMEZONE } from "./constants";
import { useState, useEffect } from "react";

// include plugins
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
var localizedFormat = require("dayjs/plugin/localizedFormat");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);


export const parseDateNoOffset = (dateTime) => {
  return dayjs(dateTime);
};

export const parseDate = (dateTime) => {
  return parseDayjsDate(dateTime).toDate();
};

const parseDayjsDate = (dateTime) => {
  let newTime = dayjs(dateTime).utcOffset(0, true);
  return dayjs.tz(newTime, SERVER_TIMEZONE);
};

export const formatDateTime = (dateTime) => {
  let date = parseDayjsDate(dateTime);
  return `${date.format("L LT")}`;
};

export const formatDate = (date) => {
  let dateObj = parseDayjsDate(date);
  return `${dateObj.format("L")}`;
};

export const formatDateNoOffset = (date) => {
  let dateObj = parseDateNoOffset(date);
  return `${dateObj.format("L")}`;
};

// Month+1 in Date constructor to account for how it determines month from numbers
export const daysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

// magic number 86400000 is milli * sec * min * hr
// difference in days
export const dateDiff = (firstDateTime, secondDateTime) => {
  return Math.floor((secondDateTime - firstDateTime) / 86400000);
};

export const numDaysLeftInYear = (dateTime) => {
  let nextYear = new Date(dateTime.getFullYear() + 1, 0, 1);

  return Math.floor((nextYear - dateTime) / 86400000);
};

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
export function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
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
export const createSemesterDropdownOptions = (
  semesterData,
  semestersOnly = false,
) => {
  // Can't use a value of just null because Semantic UI dropdowns don't match it with the selected value.
  const options = semestersOnly
    ? []
    : [
        {
          key: "noSemester",
          text: "No Semester",
          value: SEMESTER_DROPDOWN_NULL_VALUE,
        },
      ];
  const semesters = _.sortBy(semesterData, [
    "end_date",
    "start_date",
  ]).reverse();
  semesters.forEach((semester) => {
    options.push({
      key: semester.semester_id,
      text: semester.name,
      value: semester.semester_id,
    });
  });
  return options;
};

export const isSemesterActive = (start_date, end_date) => {
  if (end_date === null || end_date === undefined) {
    return true;
  }
  return (
    parseDate(start_date) <= new Date() && parseDate(end_date) >= new Date()
  );
};

/**
 * Converts a string to a url-friendly slug
 * @param str string
 * @returns {string} slug
 */
export const slugify = (str) => {
  if (str === undefined || str === null) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export function applyDarkModeClass(isDark) {
  if (isDark) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

/**
 * A React hook that provides a way to store and retrieve state in
 * `sessionStorage`, and synchronize it across tabs.
 *
 * @param {string} key The key to store the value under
 * @param {*} initialValue The initial value to use if the key is not present
 * @returns {[*, (newValue: *) => void]} A tuple containing the current value,
 * and an `updateValue` function that can be used to update the value.
 *
 * The `updateValue` function will cause the value to be updated in all tabs, and
 * will trigger a re-render of the component.
 *
 * This is currently being used to handle the gantt chart view
 */
export const useSessionStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = sessionStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setValue(JSON.parse(e.newValue));
      }
    };

    // Listen for storage changes (including cross-tab)
    window.addEventListener("storage", handleStorageChange);

    // Manually trigger update for same-tab changes
    const manualSync = () => {
      const newValue = sessionStorage.getItem(key);
      setValue(JSON.parse(newValue));
    };
    window.addEventListener("sessionStorageSync", manualSync);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sessionStorageSync", manualSync);
    };
  }, [key]);

  const updateValue = (newValue) => {
    sessionStorage.setItem(key, JSON.stringify(newValue));
    // Dispatch custom event for same-tab sync
    window.dispatchEvent(new Event("sessionStorageSync"));
    setValue(newValue);
  };

  return [value, updateValue];
};
