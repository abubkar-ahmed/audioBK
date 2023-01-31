import React from 'react'
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import axios from '../../api/axios';
import useProducts from '../../hooks/useProducts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Cart({setShowCart}) {
    const {cart , setCart} = useCart();
    const {auth} = useAuth();
    const {allProducts , setAllProduc} = useProducts();
    const [total , setTotal] = useState(0);
    const navigate = useNavigate();
    
    const axiosPrivate = axios.create({
        headers : {
            'Authorization' : `Bearer ${auth?.accessToken}`
        },
        withCredentials: true
    });



    const removeAll = () => {
        axiosPrivate.delete('/cart').then(res => {
            console.log(res);
            setCart([]);
        }).catch(err => {
            console.log(err);
        })
    }

    const calculateTotal = () => {
        let totalPrice = 0;
        for(let i = 0 ; i < cart.length ; i++){
            let productTotalPrice = cart[i].quantity * cart[i].price ;
            totalPrice += productTotalPrice ;
        }
        return totalPrice.toFixed(2) ;
    }

    useEffect(() => {
        if(cart.length > 0){
            setTotal(calculateTotal());
        }
    },[cart])

    const toCheckOut = () => {
        setShowCart(false);
        navigate('checkout');
    }


  return (
    <div className='display-cart'>
        {cart.length > 0 ? (
            <>
                <div className="cart-header">
                    <h2>CART ({cart.length})</h2>
                    {cart.length > 0 && (
                        <button onClick={removeAll}>
                            Remove All
                        </button>
                    )}
                </div>
                {cart.map((e) => {
                    return (
                    <CartCard e={e} key={e.id}/>
                    )
                })}
                <div className="total">
                    <h3>Total</h3>
                    <h4>${total}</h4>
                </div>
                <button className="checkout" onClick={toCheckOut}>
                    CHECKOUT
                </button>
            </>
        ):(
            <>
                Your cart is empty
            </>  
        )   
        }
    </div>
  )
}

export default Cart


function CartCard({e}){
    return (
        <div className="card">
            <img src={e.image} alt="product-img" />
            <div className="name-price">
                <h3>{e.productName}</h3>
                <h4>${e.price}</h4>
            </div>
            <div className="quantity">
                x{e.quantity}
            </div>
        </div>
    )
}