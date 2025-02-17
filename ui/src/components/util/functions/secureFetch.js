import { config } from "./constants";

export const SecureFetch = async (url, options) => {
    const response = await fetch(url, { credentials: "include", ...options });
    if (!response.ok && response.status === 401) {// If response is not ok
        const data = await response.json(); // Parse JSON
        window.location.replace(`/error`); // Redirect to error page
        console.log("\n ERROR 401 RESPONSE: ", data);
        sessionStorage.setItem( // Save error details in sessionStorage for display on error page
            "errorDetails",
            JSON.stringify({
              error: data.error,  
              componentStack: data.componentStack,
            })
          );
        throw new Error(response);
    } else if (!response.ok && response.status !== 401) { // not an auth error, doesn't warrant redirect
        console.log("\n ERROR {" + response.status + "} RESPONSE: ", response);
        return response;
    }else {
        console.log("\n RESPONSE: ", response);
        return response;
    }
};
