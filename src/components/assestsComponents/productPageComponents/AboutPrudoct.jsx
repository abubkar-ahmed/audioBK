import React from 'react'
import ClampLines from 'react-clamp-lines';
import useAuth from '../../../hooks/useAuth';
import useAuthStatus from '../../../hooks/useAuthStatus';
import axios from '../../../api/axios';
import { useState } from 'react';
import useCart from '../../../hooks/useCart';
import useProducts from '../../../hooks/useProducts';
import { useEffect } from 'react';

function AboutPrudoct({currentProduct}) {
  const {auth} = useAuth();
  const {authStatus , setAuthStatus} = useAuthStatus();
  const [quantity , setQuantity] = useState(1);
  const {allProducts , setAllProducts} = useProducts();
  const [displayMsg , setDisplayMsg] = useState(false);
  const [msg , setMsg] = useState({
    type : '',
    msg : ''
  })

  const {cart , setCart} = useCart();

  const axiosPrivate = axios.create({
    headers : {
        'Authorization' : `Bearer ${auth?.accessToken}`
    },
    withCredentials: true
  });

  
  const submitHandler = async () => {
    if(auth.accessToken && allProducts.length > 0){
      try{
        const response = await axiosPrivate.post('/cart', {
          productId : currentProduct.id,
          quantity : quantity
        })
        setCart(response.data.cart.map(e => {
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
        setDisplayMsg(true);
        setMsg({
          type : 'success',
          msg : `Item ${currentProduct.productName} Was Added To Your Cart`,
        })

        console.log(response)
      }catch(err) {
        console.log(err);
        setDisplayMsg(true);
        setMsg({
          type : 'err',
          msg : `Somthing Went Wrong Please Try Again Later`,
        })
      }
    }else{
      setAuthStatus('login');
    }
  }
  useEffect(() => {
    if(msg.msg){
      setTimeout(() => {
        setDisplayMsg(false);
      }, 3500);
    }
  },[msg])


  const plusHandler = () => {
    setQuantity(prev => {
      if(prev < currentProduct.quantity){
        return prev + 1
      }else{
        return prev
      }
    })
  }

  const minusHandler = () => {
    setQuantity(prev => {
      if(prev > 1){
        return prev - 1;
      }
      else{
        return prev
      }
    })
  }

  return (
    <div className='about-product'>
        <h2>{currentProduct.productName}</h2>
        {currentProduct?.about && 
        <ClampLines
            text={currentProduct?.about}
            id="really-unique-id123"
            lines={4}
            ellipsis="..."
            moreText="Show More..."
            lessText="Show Less..."
            className="about-p"
            innerElement="p"
        />
        }
        <h3>$ {currentProduct.price}</h3>
        {(!auth?.roles?.Admin && !auth?.roles?.MainAdmin)&& 
        (currentProduct?.quantity !== 0) && (
          <div className='cart-controls'>
            <div className='quntity-control'>
                <span className='add-minus' onClick={minusHandler}>-</span>
                <span>{quantity}</span>
                <span className='add-minus' onClick={plusHandler}>+</span>
            </div>
            <button className='see-product' onClick={submitHandler}>
              Add To Cart
            </button>
          </div>
        )}
        {currentProduct?.quantity <= 5 && currentProduct?.quantity > 0 ? (
          <p className='left-quantity'>
            Only {currentProduct?.quantity} Left
          </p>
        ) : currentProduct?.quantity === 0 ? (
          <p className='left-quantity'>
            This product is out of stock
          </p>
        ): null}
        

        {displayMsg && (
          <div className={msg.type === 'success' ? 'msg success' : 'msg err'}>
              {msg.msg}
           </div>
        )}
    </div>
  )
}

export default AboutPrudoct