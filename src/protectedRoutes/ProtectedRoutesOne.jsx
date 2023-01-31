import React from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import HomePage from '../components/pages/HomePage';

function ProtectedRoutesOne() {
    const { auth } = useAuth();

    const checkAuth = () => {
        if(auth?.accessToken){
            if(auth?.roles?.Admin || auth?.roles?.MainAdmin){
                return false;
            }
            return true;
        }
        return false
    }
    const isLoggedInAndNotAdmin = checkAuth();

    return (
        <>
            {isLoggedInAndNotAdmin ? (<Outlet />) : (<HomePage/>)}
        </>
    )
}

export default ProtectedRoutesOne