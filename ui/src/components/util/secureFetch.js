import { config } from "./constants";

export const SecureFetch = async (url, options) => {
    const response = await fetch(url, { credentials: "include", ...options });
    if (response.status === 401) {
        window.location.replace(`${config.url.API_LOGIN}`);
        throw new Error("Unauthorized");
    } else {
        return response;
    }
};
