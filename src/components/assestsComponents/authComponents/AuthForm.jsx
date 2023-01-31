import React from 'react'
import { useState } from 'react'
import userImg from '../../../assets/defualt.png'
import axios from 'axios'
import { useRef } from 'react';
import Register from './Register';
import VerCode from './VerCode';
import Login from './Login';
import useAuthStatus from '../../../hooks/useAuthStatus';
import ResetPwd from './ResetPwd';

function AuthForm() {
    
    const {authStatus , setAuthStatus} = useAuthStatus();
    const [inputs , setInputs] = useState({
        'user' : '',
        'email' : '',
        'pwd' : '',
        'rPwd' : '',
        'code' : ''
    });
 
  return (
    <>
        {authStatus === 'register'  && (
            <Register inputs={inputs} setInputs = {setInputs}/>
        )}
        {authStatus === 'verCode' && (
            <VerCode inputs={inputs} setInputs = {setInputs}/>
        )}
        {authStatus === 'login' && (
            <Login inputs={inputs} setInputs = {setInputs}/>
        )}
        {authStatus === 'resetPwd' && (
            <ResetPwd />
        )}
    </>
  )
}

export default AuthForm
