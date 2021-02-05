export const formatDateTime = (datetime) => {
    let date = new Date(datetime + " UTC");
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};
