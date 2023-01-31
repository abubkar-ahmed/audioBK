import React from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import HomePage from '../components/pages/HomePage';

function ProtectedRoutesTwo() {
    const { auth } = useAuth();

  return (
    <>
    {auth?.roles?.Admin || auth?.roles?.MainAdmin ? (<Outlet />) : (<HomePage/>)}
</>
  )
}

export default ProtectedRoutesTwo