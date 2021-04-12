import React, { useRef } from 'react';
import { useHistory } from "react-router-dom";

/**
 * NOTE: THIS SHOULD BE DELETED AND NO LONGER USED ONCE ACTUAL
 * SIGNING IN WORKS VIA SHIBBOLETH
 */
export default function TempSignInModalContent() {
    const userName = useRef(null);
    const role = useRef(null)
    const history = useHistory();
    return (
        <div>
            Username: <br /><input ref={userName} />
            <br />
            Role : <br /><select ref={role} >
                <option value="admin">Admin</option>
                <option value="coach">Coach</option>
                <option value="student">Student</option>
            </select>
            <br /><br /><br />
            <button onClick={() => {
                document.cookie = `user=${userName.current.value}`
                document.cookie = `type=${role.current.value}`
                history.push("/dashboard")
            }}>Sign In</button>
        </div>
    )
}
