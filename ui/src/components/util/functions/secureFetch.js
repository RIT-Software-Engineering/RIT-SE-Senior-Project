import { config } from "./constants";

export const SecureFetch = async (url, options) => {
  const response = await fetch(url, { credentials: "include", ...options });
  if (!response.ok) {
    // For authentication errors (401, 403), don't auto-redirect to generic error page
    // Let the calling component handle these specifically
    if (response.status === 401 || response.status === 403) {
      console.log(`Authentication error (${response.status}) for URL:`, url);
      throw new Error(`Authentication failed: ${response.status}`);
    }

    // For other errors, use the existing error handling
    const data = await response.json(); // Parse JSON
    window.location.replace(`/error`); // Redirect to error page
    console.log("\n ERROR RESPONSE: ", data);
    sessionStorage.setItem(
      // Save error details in sessionStorage for display on error page
      "errorDetails",
      JSON.stringify({
        error: data.error,
        statusCode: data.statusCode,
        user_role: data.user_role,
        url: data.url,
        timestamp: data.timestamp,
        componentStack: data.componentStack,
      }),
    );
    throw new Error(response);
  } else {
    console.log("\n RESPONSE: ", response);
    return response;
  }
};

export const SecureUpload = (url, options, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(options.method || "POST", url);
    xhr.withCredentials = true;

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      resolve({
        status: xhr.status,
        ok: xhr.status >= 200 && xhr.status < 300,
      });
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.send(options.body);
  });
};
