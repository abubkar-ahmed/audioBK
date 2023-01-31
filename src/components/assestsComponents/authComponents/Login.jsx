import React from 'react'
import { useState } from 'react'
import userImg from '../../../assets/defualt.png'
import axios from 'axios'
import { useRef } from 'react';
import useAuthStatus from '../../../hooks/useAuthStatus';
import { useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import Loading from '../Loading';

function Login(props) {
    const  {auth , setAuth}  = useAuth();
    const {authStatus , setAuthStatus} = useAuthStatus();
    const [errMsg , setErrMsg] = useState('');
    const [loading , setLoading] = React.useState(false);
    const inputs = props.inputs;

    const inputHandler = (e) => {
        const { name , value } = e.target ;
        props.setInputs((prevInputs) => {
            return {...prevInputs , [name] : value} ;
        })
    }
    
    useEffect(() => {
        props.setInputs({
            'user' : '',
            'email' : '',
            'pwd' : '',
            'rPwd' : '',
            'code' : ''
          });
    },[]);

    const loginSubmitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrMsg('');
        let formData = new FormData();
    
        formData.append('email' , inputs.email);
        formData.append('pwd' , inputs.pwd);
        
        const axios1 = axios.create({
          baseURL: 'https://audiobk-api.onrender.com',
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });

        axios1.post("/login" ,formData).then((res) => {
            console.log(res);
            setAuth({...res.data});
            setAuthStatus('');
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            if(err?.response?.status === 400){
                setErrMsg(err?.response?.data?.message);
                emailRef.current.classList.add('invailed');
                pwdRef.current.classList.add('invailed');
            }else if (err?.response?.status === 401){
                if(err?.response?.data?.message === 'Bad Caredials'){
                    setErrMsg(err?.response?.data?.message);
                    emailRef.current.classList.add('invailed');
                    pwdRef.current.classList.add('invailed');
                }else{
                    setAuthStatus('verCode');
                }
            }else{
                setErrMsg('somthing Went Wrong! Please Try Again Later')
            }

            
        })
    }

    useEffect(() => {
        emailRef.current?.classList.remove('invailed');
        pwdRef.current?.classList.remove('invailed');
        codeRef.current?.classList.remove('invailed');
        setErrMsg(null);
    },[inputs]);

    const emailRef = useRef(null);
    const pwdRef = useRef(null);
    const codeRef = useRef(null);

    const mainDivRef = useRef(null);
    const displayNoneForDropBack = () => {
        mainDivRef.current.classList.add('remove-pop-up');
        setTimeout(() => {
            setAuthStatus('');
        }, 700);
    }


  return (
    <div className='register-login login' ref={mainDivRef}>
        <div className='close' onClick={displayNoneForDropBack}>
            <span className="material-symbols-outlined">
                close
            </span>
        </div>
        <div className='register-login-header'>
            <h2>
                WELCOME TO <span>audioBK</span>
            </h2>
            <h3>
                Login
            </h3>
        </div>
        <form onSubmit={loginSubmitHandler}>
            <label htmlFor="email">Enter Your Email</label>
            <input type="email" placeholder='Your Email' id='email' name='email' onChange={inputHandler} ref={emailRef}/>

            <label htmlFor="password">Enter Your Paswword</label>
            <input type="password" name='pwd' placeholder='Password' id='password' onChange={inputHandler} ref={pwdRef}/>
            <p className='forgotPwd' onClick={() => setAuthStatus('resetPwd')}>Forgot Password</p>
            {errMsg && <p className='err-msg'>{errMsg}</p>}
            {loading ? (<Loading/>):(<button>Login</button>)}
        </form>
        <div className='redirect'>
        <div>
            No Accont? <span onClick={() => setAuthStatus('register')}>Register</span>
        </div>
        </div>
    </div>
  )
}

export default Login