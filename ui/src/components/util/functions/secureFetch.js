import { config } from "./constants";

export const SecureFetch = async (url, options) => {
    const response = await fetch(url, { credentials: "include", ...options });
    if (!response.ok ) {// auth error, warrants redirect
        const data = await response.json(); // Parse JSON
        window.location.replace(`/error`); // Redirect to error page
        console.log("\n ERROR RESPONSE: ", data);
        sessionStorage.setItem( // Save error details in sessionStorage for display on error page
            "errorDetails",
            JSON.stringify({
                error: data.error,
                statusCode: data.statusCode,
                user_role: data.user_role,
                url: data.url,
                timestamp: data.timestamp,
                componentStack: data.componentStack,
            })
          );
        throw new Error(response);
    } else {
        console.log("\n RESPONSE: ", response);
        return response;
    }
};
