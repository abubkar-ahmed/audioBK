import React from 'react'
import { useState } from 'react'
import userImg from '../../../assets/defualt.png'
import axios from 'axios'
import { useRef } from 'react';
import useAuthStatus from '../../../hooks/useAuthStatus';
import Loading from '../Loading';

function VerCode(props) {
    const {authStatus , setAuthStatus} = useAuthStatus();
    const [errMsg , setErrMsg] = useState('');
    const [loading , setLoading] = React.useState(false);
    const inputs = props.inputs ;

    const inputHandler = (e) => {
        const { name , value } = e.target ;
        props.setInputs((prevInputs) => {
            return {...prevInputs , [name] : value} ;
        })
    }


    const verificationSubmitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrMsg('');
        let formData = new FormData();
    
        formData.append('email' , inputs.email);
        formData.append('pwd' , inputs.pwd);
        formData.append('code' , inputs.code);
        
        const axios1 = axios.create({
          baseURL: 'https://audiobk-api.onrender.com',
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        
        

        axios1.put("/register" ,formData).then((res) => {
            console.log(res);
            setAuthStatus('login');
            setLoading(false);
        }).catch(err => {
            setLoading(false); 
            setErrMsg(err?.response?.data?.message);
            codeRef?.current?.classList?.add('invailed');
            
        })

    }

    React.useEffect(() => {
        codeRef.current?.classList.remove('invailed');
        setErrMsg(null);
    },[inputs]);

    const codeRef = useRef(null);

  return (
    <div className="register-login verification">
        <div className='close' onClick={() => setAuthStatus('')}>
            <span className="material-symbols-outlined">
                close
            </span>
        </div>
        <div className='register-login-header'>
            <h2>
                WELCOME TO <span>audioBK</span>
            </h2>
            <h3>
                A Verification Code Was Sent To Your Email
            </h3>
        </div>
        <form onSubmit={verificationSubmitHandler}>
            <div>
                <label>Enter Your Verification Code</label>
                <input type="text" name='code' placeholder='Verification Code' onChange={inputHandler} ref={codeRef}/>
                <p>NOTE: If you do not receive an email with Verification Code, please check the spam inbox</p>
            </div>
            {errMsg && <p className='err-msg'>{errMsg}</p>}
            {loading ? (<Loading/>):(<button>Submit</button>)}
        </form>
    </div>
  )
}

export default VerCode