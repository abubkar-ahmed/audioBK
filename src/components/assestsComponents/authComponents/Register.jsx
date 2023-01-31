import React from 'react'
import { useState } from 'react'
import userImg from '../../../assets/defualt.png'
import axios from 'axios'
import { useRef  , useEffect} from 'react';
import useAuthStatus from '../../../hooks/useAuthStatus';
import Loading from '../Loading';


function Register(props) {

    const {authStatus , setAuthStatus} = useAuthStatus();

    const [errMsg , setErrMsg] = useState('');

    const [img , setImg] = useState('');
    const [imgPrev, setImgPrev] = useState(userImg);
    const [loading , setLoading] = React.useState(false)
    const inputs = props.inputs ;

    useEffect(() => {
        props.setInputs({
            'user' : '',
            'email' : '',
            'pwd' : '',
            'rPwd' : '',
            'code' : ''
          });
    },[])



    const fileHandle = (e) => {
        setImg(e.target.files[0])
        setImgPrev(URL.createObjectURL(e.target.files[0]));
    }

    const inputHandler = (e) => {
        const { name , value } = e.target ;
        props.setInputs((prevInputs) => {
            return {...prevInputs , [name] : value} ;
        })
    }

    const registerSubmitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrMsg('')
    
        let formData = new FormData();
    
        formData.append('img' , img);
        formData.append('fullname' , inputs.fullname);
        formData.append('user' , inputs.user);
        formData.append('email' , inputs.email);
        formData.append('pwd' , inputs.pwd);
        formData.append('rPwd' , inputs.rPwd);
        
        const axios1 = axios.create({
          baseURL: 'https://audiobk-api.onrender.com',
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
    
        axios1.post("/register" ,formData).then((res) => {
            console.log(res);
            setAuthStatus('verCode');
            setLoading(false);
        }).catch(err => {
            setLoading(false);            
            if(err?.response?.status === 400) {
                if(err?.response?.data?.message === 'All Fileds Are Required.'){
                    emptyInputs();
                    setErrMsg('All Fileds Are Required');
                }else{
                    imgRef.current.classList.add('invailed');
                    setErrMsg(err?.response.data.message);
                }

            }else if(err?.response?.status === 409){
                if(err?.response?.data?.message === 'Invalied User Name' || err?.response?.data?.message === 'Username is Already Taken'){
                    setErrMsg(err?.response?.data?.message);
                    userRef.current.classList.add('invailed');
                }
                if(err?.response?.data?.message === 'Invalied Email' || err?.response?.data?.message === 'Email is Already Registerd'){
                    setErrMsg(err?.response?.data?.message);
                    emailRef.current.classList.add('invailed');
                }
                if(err?.response?.data?.message === 'Password Must Be same As Repeated Password'){
                    setErrMsg(err?.response?.data?.message);
                    rPwdRef.current.classList.add('invailed');
                }
            }else{
                setErrMsg('Somthing Went Wrong! Try Again Later');
            }

        
        })
    }

    React.useEffect(() => {
        userRef.current?.classList.remove('invailed');
        imgRef.current?.classList.remove('invailed');
        emailRef.current?.classList.remove('invailed');
        pwdRef.current?.classList.remove('invailed');
        rPwdRef.current?.classList.remove('invailed');
        setErrMsg(null);
    },[inputs])


    const imgRef = useRef(null);
    const userRef = useRef(null);
    const emailRef = useRef(null);
    const pwdRef = useRef(null);
    const rPwdRef = useRef(null);


    const emptyInputs = () => {
        if(inputs.user === ''){
          userRef.current.classList.add('invailed');
        }
        if(inputs.email === ''){
          emailRef.current.classList.add('invailed');
        }
        if(inputs.pwd === ''){
          pwdRef.current.classList.add('invailed');
        }
        if(inputs.rPwd === ''){
          rPwdRef.current.classList.add('invailed');
        }
    }

    const mainDivRef = useRef(null);
    const displayNoneForDropBack = () => {
        mainDivRef.current.classList.add('remove-pop-up');
        setTimeout(() => {
            setAuthStatus('');
        }, 700);
    }

  return (
    <div className='register-login' ref={mainDivRef}>
        <div className='close' onClick={displayNoneForDropBack} >
        <span className="material-symbols-outlined">
            close
        </span>
        </div>
        <div className='register-login-header'>
            <h2>
                WELCOME TO <span>audioBK</span>
            </h2>
            <h3>
                Register
            </h3>
        </div>
        <form onSubmit={registerSubmitHandler}>
            <div className='img-upload'>
                <label htmlFor="user-img" className='img-label' >
                    <span className="material-symbols-outlined">
                        edit
                    </span>
                </label>
                <input type="file" id='user-img' className='user-img' onChange={fileHandle}/>
                <div className="img-prev">
                    <div className='img' style= {{"backgroundImage": `url(${imgPrev})`}} ref={imgRef}>
                    </div>
                </div>
            </div>

            
            <label htmlFor="user-name">Enter Your User Name *</label>
            <input type="text" name='user' placeholder='User Name' id='user-name' onChange={inputHandler} ref={userRef}/>
            <label htmlFor='email'>
                Enter Your Email *
            </label>
            <input type="email" name='email' placeholder='...example@example.ex' id='email' onChange={inputHandler} ref={emailRef}/>
            <div className='pwds'>
                <div className="pwd">
                    <label htmlFor="pwd">Enter Your Password *</label>
                    <input type="password" name='pwd' placeholder='Password' id='pwd' onChange={inputHandler} ref={pwdRef}/>
                </div>
                <div className="rPwd">
                    <label htmlFor="rPwd">Enter Reapeted Password *</label>
                    <input type="password" name="rPwd" id="rPwd" placeholder='Reapeted Password' onChange={inputHandler} ref={rPwdRef}/>
                </div>
            </div>

            {errMsg && <p className='err-msg'>{errMsg}</p>}

            
            {loading ? (<Loading/>):(<button>Register</button>)}
            

        </form>
        <div className='redirect'>
            <div>
                Have An Accont? <span onClick={() => setAuthStatus('login')}>Login</span>
            </div>
        </div>
    </div>
  )
}

export default Register