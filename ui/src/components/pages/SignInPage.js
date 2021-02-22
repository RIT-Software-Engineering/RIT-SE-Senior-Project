import React from "react";

export default function SignInPage({ setSignedIn }) {
    return (
        <div>
            Username: <input />
            <button onClick={() => setSignedIn({ authenticated: true })}>Sign in</button>
        </div>
    );
}
