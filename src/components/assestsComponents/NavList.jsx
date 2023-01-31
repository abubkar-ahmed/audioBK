import React from 'react'
import headphones from '../../assets/image-headphones.png'
import speakers from '../../assets/image-speakers.png'
import earphones from '../../assets/image-earphones.png'
import useElemntOnScreen from '../../hooks/useElemntOnScreen';
import { useRef } from 'react';
import { useEffect } from 'react';
import {NavLink , useNavigate} from 'react-router-dom';

function NavList() {
    const navRef = useRef(null);
    const navigate = useNavigate();

    const options = {
        root : null,
        rootMargin:'0px',
        threshold: 0.3
    }

    const navVisibilty = useElemntOnScreen(options,navRef);

    useEffect(() => {
        if(navVisibilty){
            navRef.current.classList.add('show');
        }else{
            navRef.current.classList.remove('show');
        }
    },[navVisibilty]);



  return (
    <ul className='nav-list hidden' ref={navRef}>
        <li onClick={() => navigate('/headphones')}>
            <img src={headphones} alt="headphones" loading='lazy'/>
            <h2>HEADPHONES</h2>
            <NavLink to='/headphones'>
                SHOP <span className="material-symbols-outlined">
                arrow_forward_ios
                </span>
            </NavLink>
        </li>
        <li onClick={() => navigate('/speakers')}>
            <img src={speakers} alt="speakers" loading='lazy'/>
            <h2>SPEAKERS</h2>
            <NavLink to='/speakers'>
                SHOP <span className="material-symbols-outlined">
                arrow_forward_ios
                </span>
            </NavLink>
        </li>
        <li onClick={() => navigate('/earphones')}>
            <img src={earphones} alt="earphones" loading='lazy'/>
            <h2>EARPHONES</h2>
            <NavLink to='/earphones'>
                SHOP <span className="material-symbols-outlined">
                arrow_forward_ios
                </span>
            </NavLink>

            
        </li>
    </ul>
  )
}

export default NavList