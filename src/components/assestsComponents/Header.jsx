import React from 'react'
import headPhone from '../../assets/image-headphones.png'
import speakers from '../../assets/image-speakers.png'
import earphone from '../../assets/image-earphones.png'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import useAuthStatus from '../../hooks/useAuthStatus';
import useAuth from '../../hooks/useAuth'
import userImg from '../../assets/defualt.png';
import axios from '../../api/axios';
import { NavLink, useNavigate } from 'react-router-dom';
import Cart from './Cart';
import useCart from '../../hooks/useCart';
import useProducts from '../../hooks/useProducts';


function Header({showCart , setShowCart , showUserControls , setShowUserControls}) {
  const {auth , setAuth} = useAuth();
  const {authStatus , setAuthStatus} = useAuthStatus();
  const navRef = useRef();
  const hamRef = useRef();
  const closeRef = useRef();
  const [authControl , setAuthControl] = useState(false);
  const {cart , setCart} = useCart();
  const {allProducts} = useProducts();

  const axiosPrivate = axios.create({
    headers : {
        'Authorization' : `Bearer ${auth?.accessToken}`
    },
    withCredentials: true
  });

  const toggleNav = () => {
    if(navRef.current.classList.contains('none')){
      navRef.current.classList.remove('none');
      navRef.current.classList.remove('animation-bottom-to-top');
    }else{
      navRef.current.classList.add('animation-bottom-to-top');
      setTimeout(() => {
        navRef.current.classList.add('none');
      }, 700);
    }
  }

  useEffect(() => {
    handleResize()
  },[])

  const handleResize = () => {
    if(window.innerWidth > 669){
      navRef.current.classList.remove('none');
      navRef.current.classList.remove('animation-bottom-to-top');
      hamRef.current.classList.add('none');
      closeRef.current.classList.add('none');
    }else{
      navRef.current.classList.add('none');
      hamRef.current.classList.remove('none');
      closeRef.current.classList.remove('none');
    }
    if(window.innerWidth > 669 && window.innerWidth < 1023){
      setAuthControl(true);
    }else{
      setAuthControl(false);
    }
  }

  useEffect(() => {
    window.addEventListener('resize' , handleResize)

    return () => window.removeEventListener('resize' , handleResize)
  })



  const cartRef = useRef(null);
  const cartDisplayControl = () => {
    if(showCart){
      cartRef.current.classList.add('remove-pop-up');
      setTimeout(() => {
          setShowCart(false);
      }, 700);
    }else{
      setShowCart(true);
    }
  }

  useEffect(() => {
    if(auth?.accessToken && allProducts.length > 0){
        axiosPrivate.get('/cart').then(res => {
            setCart(res.data.cart.map(e => {
                const product = allProducts.filter(p => {
                    return p.id === e.productId ;
                })
                return {
                    id: e.productId,
                    productName : product[0].productName,
                    image : product[0].images[0],
                    price : product[0].price,
                    quantity : e.quantity,
                    shippingCost : e.shippingCost,
                    vat : e.vat
                }
            }));
        }).catch(err => {
        })
    }else{
      setCart([]);
      setShowCart(false);
    }
  },[auth , allProducts])

  return (
    <header>
      <div className={!auth?.roles?.Admin && !auth?.roles?.MainAdmin ? 'header-container' : 'header-container header-admin'} >
          <span className="material-symbols-outlined" onClick={toggleNav} ref={hamRef} >
            menu
          </span>
          <h1 className='logo'>audioBK</h1>
          <nav className='none nav' ref={navRef} onClick={() => setShowCart(false)}>
          <span className="material-symbols-outlined close" onClick={toggleNav} ref={closeRef}>
          close
          </span>
            <ul onClick={toggleNav}>
              <li><NavLink to='/'>HOME</NavLink></li>
              <li><NavLink to='/headphones'>HEADPHONES</NavLink></li>
              <li><NavLink to='/speakers'>SPEAKERS</NavLink></li>
              <li><NavLink to='/earphones'>EARPHONES</NavLink></li>
            </ul>
            <UserControls 
            authControl={authControl}
            setAuthControl={setAuthControl}
            showUserControls={showUserControls} 
            setShowUserControls={setShowUserControls}
            toggleNav={toggleNav}
            />
          </nav>
          {!auth?.roles?.Admin && !auth?.roles?.MainAdmin && (
            <div className="cart" >
              <span className="material-symbols-outlined cart-logo"   onClick={cartDisplayControl}>
                shopping_cart
              </span>
              {cart.length > 0 && 
                <span className='cart-length'>
                  {cart.length}
                </span>
              }
              {showCart && (
              <div className="cart-details" ref={cartRef}>
                <Cart setShowCart={setShowCart}/>
              </div>
              )}
            </div>
          )}

        </div>
    </header>
  )
}

export default Header


function UserControls({authControl , setAuthControl , showUserControls , setShowUserControls , toggleNav}){
  const {auth ,  setAuth} = useAuth() ;
  const {authStatus , setAuthStatus} = useAuthStatus();
  
  const arrowRef = useRef(null);
  const ulRef = useRef(null);
  const navigate = useNavigate();

  const logOut = async () => {
    try{
      await axios.get('/logout').then(res => {
        setAuth({}); 
      })
    } catch (err) {
      console.log(err);
      setAuth({});
    }
  }

  const showUserCHandler = () => {
    if(showUserControls){
      arrowRef.current.classList.add('rotate-360')
      arrowRef.current.classList.remove('rotate-180')
      ulRef.current.classList.add('remove-ul')
      setTimeout(() => {
        setShowUserControls(prev => !prev);
      }, 200);
    }else{
      setShowUserControls(prev => !prev);
      arrowRef.current.classList.add('rotate-180')
      arrowRef.current.classList.remove('rotate-360')
    }
  }

  const hideUserControls = () => {
    setShowUserControls(false);
  }

  useEffect(() => {
    if(!showUserControls){
      arrowRef?.current?.classList.add('rotate-360')
      arrowRef?.current?.classList.remove('rotate-180')
      ulRef?.current?.classList.add('remove-ul')
    }
  },[showUserControls])

  const hendleNavigate = (location) => {
    navigate(location);
    toggleNav()

  }

  return (
    <>
      {
        auth?.accessToken ? (
          <div className='user-info'>
            <button className='show-controls' onClick={showUserCHandler}>
              <span className='span-user-name'>@{auth.username}</span>
              <span className="material-symbols-outlined " ref={arrowRef}>
                keyboard_arrow_down
              </span>
            </button>
            {showUserControls && (
              <div className="user-controls" onClick={hideUserControls}>
                <ul ref={ulRef} className='user-controls-list'>
                  {auth?.roles?.Admin ? (
                    <li onClick={() => hendleNavigate('dashboard/products')}>
                      dashboard
                    </li>
                  ) : (
                    <li onClick={() => hendleNavigate('account')}>
                      account
                    </li>
                  )}
                  <li onClick={logOut}>
                    logout
                    <span className="material-symbols-outlined" >
                      logout
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : 
        authControl ? (
          <div onClick={() => setAuthStatus('login')}>
            <span class="material-symbols-outlined auth-controll">
              person
            </span>
          </div>
        ) : (
        <div>
          <a className='login' onClick={() => setAuthStatus('login')}>Login</a>
          <a className='register' onClick={() => setAuthStatus('register')}>Register</a>
        </div>
        )
      }
    </>
  )
}


