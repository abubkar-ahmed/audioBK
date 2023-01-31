import { createContext, useState } from "react";

const ShowAuthStatusContext = createContext({});

export const ShowAuthStatusProvider = ({ children }) => {
    const [authStatus , setAuthStatus] = useState('');

    return (
        <ShowAuthStatusContext.Provider value={{ authStatus , setAuthStatus }}>
            {children}
        </ShowAuthStatusContext.Provider>
    )
}

export default ShowAuthStatusContext;