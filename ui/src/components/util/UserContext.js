import React, { createContext, useState } from 'react'

/**
 * For more info: https://reactjs.org/docs/hooks-reference.html#usecontext
 */

// Use this to get the current state of a user
export const UserContext = createContext({ user: null, setUser: () => { } });

// Provider for the app -- you most likely don't need to touch this
export function UserContextProvider({ children }) {

    const [user, updateUser] = useState({})

    const setUser = (newUser) => {
        updateUser(newUser);
    }

    let context = {
        user: user,
        setUser,
    }

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>
    )
}
