import React from 'react'
import axios from 'axios'
import { useRef ,useState} from 'react';
import useAuthStatus from '../../../hooks/useAuthStatus';
import { useEffect } from 'react';
import Loading from '../Loading';

function ResetPwd() {
    const {authStatus , setAuthStatus} = useAuthStatus();
    const [errMsg , setErrMsg] = useState('');
    const [steps , setSteps] = useState(1);
    const [inputs , setInputs] = useState({
        'user' : '',
        'email' : '',
        'pwd' : '',
        'rPwd' : '',
        'code' : ''
    });
    const [loading , setLoading] = React.useState(false);
    const emailRef = useRef(null);
    const codeRef = useRef(null);
    const pwdRef = useRef(null);
    const rPwdRef = useRef(null);

    const inputHandler = (e) => {
        const { name , value } = e.target ;
        setInputs((prevInputs) => {
            return {...prevInputs , [name] : value} ;
        })
    }

    const submitEmailHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrMsg('');
        if(inputs.email === ''){
            setErrMsg('Please Enter Your Email');
            emailRef.current.classList.add('invailed')
            setLoading(false);
        }else{
            const axios1 = axios.create({
                baseURL: 'https://audiobk-api.onrender.com',
            });
    
            axios1.put('/login',{step : 1 ,email : inputs.email}).then(res => {
                console.log(res);
                setSteps(2);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                if(err?.response?.status === 400){
                    if(err?.response?.data?.message === 'User Not Found'){
                        setErrMsg(err?.response?.data?.message);
                        emailRef.current.classList.add('invailed')
                    }else{
                        setErrMsg('Somthing Went Wronge Try Again Later');
                    }
                }else{
                    setErrMsg('Somthing Went Wronge Try Again Later');
                }
            })
        }
    }

    const submitVerificationCode = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrMsg('');
        if(inputs.email === '' || inputs.code === ''){
            setErrMsg('Please Enter Your Verification Code');
            codeRef.current.classList.add('invailed');
            setLoading(false);
        }else{
            const axios1 = axios.create({
                baseURL: 'http://localhost:3500',
            });
    
            axios1.put('/login',{step : 2 ,email : inputs.email , code : inputs.code}).then(res => {
                console.log(res);
                setSteps(3);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                if(err?.response?.status === 400){
                    if(err?.response?.data?.message === 'User Not Found'){
                        setErrMsg(err?.response?.data?.message);
                        codeRef.current.classList.add('invailed')
                    }else{
                        setErrMsg('Somthing Went Wronge Try Again Later');
                    }
                }else if(err?.response?.status === 401){
                    setErrMsg(err?.response?.data?.message);
                    codeRef.current.classList.add('invailed')
                }else{
                    setErrMsg('Somthing Went Wronge Try Again Later');
                }
            })
        }

    }


    const submitNewPwd = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrMsg('');
        if(inputs.email === '' || inputs.code === '' || inputs.pwd === ''|| inputs.rPwd === ''){
            setLoading(false);
            if(inputs.pwd === ''){
                setErrMsg('Please Enter Your New Password');
                pwd.current.classList.add('invailed')
            }else if(inputs.rPwd === ''){
                setErrMsg('Please Enter Repeted Password');
                rPwd.current.classList.add('invailed');
            }
        }else{
            const axios1 = axios.create({
                baseURL: 'http://localhost:3500',
            });
    
            axios1.put('/login',{step : 3 ,email : inputs.email , code : inputs.code , pwd : inputs.pwd , rPwd : inputs.rPwd}).then(res => {
                console.log(res);
                setSteps(1);
                setAuthStatus('login');
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                if(err?.response?.status === 400){
                    if(err?.response?.data?.message === 'User Not Found'){
                        setErrMsg(err?.response?.data?.message);
                    }else{
                        setErrMsg('Somthing Went Wronge Try Again Later');
                    }
                }else if(err?.response?.status === 401){
                    setErrMsg(err?.response?.data?.message);
                    rPwdRef.current.classList.add('invailed');
                }else if(err?.response?.status === 401){
                    setErrMsg(err?.response?.data?.message);
                    rPwdRef.current.classList.add('invailed');

                }
                else{
                    setErrMsg('Somthing Went Wronge Try Again Later');
                }
            })
        }

    }

    useEffect(() => {
        emailRef.current?.classList.remove('invailed');
        codeRef.current?.classList.remove('invailed');
        setErrMsg(null);
    },[inputs]);

    const mainDivRef = useRef(null);
    const displayNoneForDropBack = () => {
        mainDivRef.current.classList.add('remove-pop-up');
        setTimeout(() => {
            setAuthStatus('');
        }, 700);
    }

  return (
    <div className='register-login reset-pwd ' ref={mainDivRef}>
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
                Reset Password
                <span className={steps === 1 ? 'width-25' : steps === 2 ? 'width-75' : 'width-90'}></span>
            </h3>
            
        </div>
        <div className='steps'>
            <h5>Step {`${steps}`}</h5>
        </div>
        {steps === 1 ? (
            <form onSubmit={submitEmailHandler}>
                <label htmlFor="email">Enter Your Email</label>
                <input type="email" placeholder='Your Email' id='email' name='email' onChange={inputHandler} ref={emailRef} value={inputs.email}/>
                {errMsg && <p className='err-msg'>{errMsg}</p>}
                {loading ? (<Loading/>):(<button>Next Step</button>)}
            </form>
        ) : steps === 2 ? (
            <form onSubmit={submitVerificationCode}>
                <label htmlFor="code">Enter Your Verification Code</label>
                <input type="text" placeholder='Verification Code' id='code' name='code' onChange={inputHandler} ref={codeRef} value={inputs.code}/>
                <p>NOTE: If you do not receive an email with Verification Code, please check the spam inbox</p>
                {errMsg && <p className='err-msg'>{errMsg}</p>}
                {loading ? (<Loading/>):(<button>Next Step</button>)}
            </form>
        ) : (
            <form onSubmit={submitNewPwd}>
                <label htmlFor="pwd">Enter Your New Password</label>
                <input type="password" placeholder='Password' id='pwd' name='pwd' onChange={inputHandler} ref={pwdRef} value={inputs.pwd}/>

                <label htmlFor="rPwd">Enter Reapeted Password</label>
                <input type="password" placeholder='Reapeted Password' id='rPwd' name='rPwd' onChange={inputHandler} ref={rPwdRef} value={inputs.rPwd}/>

                {errMsg && <p className='err-msg'>{errMsg}</p>}
                {loading ? (<Loading/>):(<button>Confirm</button>)}
            </form>
        )}
    </div>
  )
}

export default ResetPwd