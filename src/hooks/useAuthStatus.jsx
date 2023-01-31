import { useContext, useDebugValue } from "react";
import ShowAuthStatusContext from "../context/ShowAuthStatusProvider";

const useAuthStatus = () => {
    const { auth } = useContext(ShowAuthStatusContext);    
    return useContext(ShowAuthStatusContext);
}

export default useAuthStatus;