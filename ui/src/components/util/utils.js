import moment from "moment";

export const formatDateTime = (datetime) => {
    let date = new Date(datetime + " UTC");
    return `${moment(date).format('L')} ${moment(date).format("LT")}`
};

export const formatDate = (date) => {
    let dateObj = new Date(date + " UTC");
    return `${moment(dateObj).format('L')}`
};
