import { config } from "./constants";

export const SecureFetch = async (url, options) => {
    const response = await fetch(url, { credentials: "include", ...options });
    if (response.status === 401) {
        window.location.replace(`${config.url.API_LOGIN}`); //FIXME: During development, if this triggers an error caused by this route will occur! there is no localhost:3001!
        throw new Error("Unauthorized");
    } else {
        return response;
    }
};
