import React from 'react'
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState , useEffect , useRef} from 'react';
import cashImg from '../../assets/icon-cash-on-delivery.svg';
import eMoneyImg from '../../assets/icons8-time-48.png';
import axios from '../../api/axios'
import Loading from '../assestsComponents/Loading';
import checkIcon from '../../assets/icon-check-mark.svg';
import useProducts from '../../hooks/useProducts'

function CheckOut() {
  const {cart , setCart} = useCart();
  const {auth } = useAuth();
  const navigate = useNavigate();
  const [inputs , setInputs] = useState({
    name : '',
    email : '',
    phone : '',
    address : '',
    zipCode : '',
    city : '',
    country : '',
    paymentMethode : '',
  })
  const [errs , setErrs] = useState({});
  const [calculatedPrice , setCalculatedPrice] = useState({
    total : 0,
    shipping : 0,
    vat : 0,
    grandTotal : 0
  });
  const [confirmPurchase , setConfirmPurchase] = useState(false);

  const calculateTotal = () => {
    let totalPrice = 0;
    for(let i = 0 ; i < cart.length ; i++){
        let productTotalPrice = cart[i].quantity * cart[i].price ;
        totalPrice += productTotalPrice ;
    }
    return totalPrice.toFixed(2) ;
  }

  const calculateVat = (vatPercent) => {
    let caculatedVat = 0;
    const total = calculateTotal() ;
    caculatedVat = +(total/100)*vatPercent
    return caculatedVat.toFixed(2)
  }

  const calculatGrandTotal = (shippingCost , vatPercent) => {
    let calculatedGrand = 0 ;
    const total = calculateTotal() ;
    const vat = calculateVat(vatPercent);
    calculatedGrand = (+shippingCost) + (+vat) + (+total)
    return calculatedGrand.toFixed(2);
  }

  useEffect(() => {
    if(cart.length > 0){
      
      const shippingCost = cart[0].shippingCost ;
      const vat = calculateVat(cart[0].vat)
      const grandTotal = calculatGrandTotal(cart[0].shippingCost , cart[0].vat) ;
      setCalculatedPrice({
        total : calculateTotal(),
        shipping : shippingCost,
        vat : vat,
        grandTotal : grandTotal
      })
    }else{
      setCalculatedPrice({
        total : 0,
        shipping : 0,
        vat : 0,
        grandTotal : 0
      })
    }
  },[cart])



  return (
    <main className='checkout'>
      <h2 onClick={() => navigate(-1)} className='go-back'>Go Back</h2>
      <div className="checkout-container">
        <h2 className='checkout-header'>CHECKOUT</h2>
        <Form 
        inputs={inputs}
        setInputs={setInputs}
        errs={errs}
        setErrs={setErrs}/>
      </div>
      <div className="summary-container">
        <h2 className='summary-header'>
          SUMMARY
        </h2>
        <Summary calculatedPrice={calculatedPrice} 
        inputs={inputs} 
        setInputs={setInputs}
        errs={errs} 
        setErrs={setErrs}
        setConfirmPurchase={setConfirmPurchase}/>
      </div>
      {confirmPurchase && <ThanYou calculatedPrice={calculatedPrice}/>}
    </main>
  )
}

export default CheckOut

function Form ({inputs , setInputs , errs , setErrs }) {

  const [payment , setPayment] = useState('cash');
  const cashRef = useRef();
  const eMoneyRef = useRef();

  const activeEmoney = () => {
    cashRef.current.classList.remove('active');
    eMoneyRef.current.classList.add('active');
    setPayment('e-money')
    
  }
  const activeCash = () => {
    eMoneyRef.current.classList.remove('active');
    cashRef.current.classList.add('active');
    setPayment('cash')
    
  }

  const inputHandler = (e) => {
    const { name , value } = e.target ;
    setInputs((prevInputs) => {
        return {...prevInputs , [name] : value} ;
    })
  }

  useEffect(() => {
    setInputs(prev => {
      return {...prev , paymentMethode : payment}
    })
    eMoneyRef.current.classList.remove('err');
  },[payment])

  useEffect(() => {
    setErrs({});
  },[inputs])

  const billingRef = React.useRef(null);
  const shippingRef = React.useRef(null);
  const paymentRef = React.useRef(null);
  React.useEffect(() => {
    if(errs?.name || errs?.email || errs?.phone){
      billingRef.current?.scrollIntoView({behavior: 'auto'});
    } else if (errs?.address || errs?.city || errs?.country){
      shippingRef.current?.scrollIntoView({behavior: 'auto'});
    } else if (errs?.paymentMethode){
      paymentRef.current?.scrollIntoView({behavior: 'auto'});
      eMoneyRef.current.classList.add('err');
    }
  },[errs]);

  return(
    <form>
      <div className='billing-datiles' ref={billingRef}>
          <h3>BILLING DETAILS</h3>
          <div className="input-div name">
            <label htmlFor="name">
              Name
            </label>
            {errs?.name && <p className="err-msg">{errs?.name}</p>}
            <input type="text" name='name' id='name' placeholder='Abubkar Ahmed' className={errs?.name ? 'err' : ''} onChange={inputHandler}/>
          </div>
          <div className="input-div email">
            <label htmlFor="email">
              Email
            </label>
            {errs?.email && <p className="err-msg">{errs?.email}</p>}
            <input type="email" name='email' id='email' placeholder='Abubkar@audiBK.com' className={errs?.email ? 'err' : ''} onChange={inputHandler}/>
          </div>
          <div className="input-div phone">
            <label htmlFor="phone">
              Phone
            </label>
            {errs?.phone && <p className="err-msg">{errs?.phone}</p>}
            <input type="text" name='phone' id='phone' placeholder='+249 123456789' className={errs?.phone ? 'err' : ''} onChange={inputHandler}/>
          </div>
      </div>
      <div className="shipping-info" ref={shippingRef}>
        <h3>SHIPPING INFO</h3>
        <div className="input-div address">
            <label htmlFor="address">
              Your Address
            </label>
            {errs?.address && <p className="err-msg">{errs?.address}</p>}
            <input type="text" name='address' id='address' placeholder='1137 Wiliams Avenue' className={errs?.zipCode ? 'err' : ''} onChange={inputHandler}/>
        </div>
        <div className="input-div zip-code">
            <label htmlFor="zipCode">
              ZIP Code
            </label>
            {errs?.zipCode && <p className="err-msg">{errs?.zipCode}</p>}
            <input type="number" name='zipCode' id='zipCode' placeholder='10001' className={errs?.zipCode ? 'err' : ''} onChange={inputHandler}/>
        </div>
        <div className="input-div city">
            <label htmlFor="city">
              City
            </label>
            {errs?.city && <p className="err-msg">{errs?.city}</p>}
            <input type="text" name='city' id='city' placeholder='New York' className={errs?.city ? 'err' : ''} onChange={inputHandler}/>
        </div>
        <div className="input-div country">
            <label htmlFor="country">
              Country
            </label>
            {errs?.country && <p className="err-msg">{errs?.country}</p>}
            <input type="text" name='country' id='country' placeholder='New York' className={errs?.country ? 'err' : ''} onChange={inputHandler}/>
        </div>    
      </div>
      <div className="payment-datils" ref={paymentRef}>
        <h3>PAYMENT DETAILS</h3>
        <div className='payment-div'>
            <h4>Payment Method</h4>
            <div className='choice'>
              <div className="cash-on-delivry active" ref={cashRef} onClick={activeCash}>
                <div>
                  <span></span>
                </div>
                Cash On Delivery
              </div>
              <div className="e-money" ref={eMoneyRef} onClick={activeEmoney}>
                <div>
                  <span></span>
                </div>
                e-Money
              </div>
            </div>
            
                {payment === 'cash' ? (
                  <div className="payment-about">
                    <img src={cashImg} alt="cashImg" />
                    <p>
                      The ‘Cash on Delivery’ option enables you to pay in cash when our delivery courier arrives at your residence. Just make sure your address is correct so that your order will not be cancelled.
                    </p>
                  </div>
                ):(
                  <div className="payment-about">
                  <img src={eMoneyImg} alt="cashImg" />
                  <p>
                    This Method Is Currently Unavailable.
                  </p>
                </div>
                )
                  
                }
            
        </div>
      </div>
    </form>
  )
}

function Summary({calculatedPrice , inputs , errs , setErrs , setConfirmPurchase}) {
  const {cart , setCart} = useCart();
  const navigate = useNavigate();
  const {auth} = useAuth();
  const [loading , setLoading] = useState(false);
  const [errMsg , setErrMsg] = useState('');
  const {setAllProducts} = useProducts()

  const checkForm = () => {
    setErrs({})
    if(inputs.name && inputs.email && inputs.phone && inputs.address && inputs.zipCode && inputs.city && inputs.country && (inputs.paymentMethode === 'cash') ){
      const rgxEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if(rgxEmail.test(inputs.email)){
        makeTheCall();
      }else{
        setErrs(prev => {
          return {...prev , email : 'Please Enter Valied Email'}
        })
      }
    }else{
      if(!inputs.name){        
        setErrs(prev => {
          return {...prev , name : 'All Fields Are Required'}
        })
      }
      if(!inputs.email){
        setErrs(prev => {
          return {...prev , email : 'All Fields Are Required'}
        })
      }
      if(!inputs.phone){
        setErrs(prev => {
          return {...prev , phone : 'All Fields Are Required'}
        })
      }
      if(!inputs.address){
        setErrs(prev => {
          return {...prev , address : 'All Fields Are Required'}
        })
      }
      if(!inputs.zipCode){
        setErrs(prev => {
          return {...prev , zipCode : 'All Fields Are Required'}
        })
      }
      if(!inputs.city){
        setErrs(prev => {
          return {...prev , city : 'All Fields Are Required'}
        })
      }
      if(!inputs.country){
        setErrs(prev => {
          return {...prev , country : 'All Fields Are Required'}
        })
      }
      if(inputs.paymentMethode !== 'cash'){
        setErrs(prev => {
          return {...prev , paymentMethode : 'This Method Is Currently Unavailable.'}
        })
      }
    }

  }

  const axiosPrivate = axios.create({
    headers : {
        'Authorization' : `Bearer ${auth?.accessToken}`
    },
    withCredentials: true
  });

  const makeTheCall = () => {
    if(cart.length){
      setLoading(true);
      const filterdCart = cart.map(e => {
        console.log(e)
        return {
          productId : e.id,
          quantity : e.quantity,
        }
      })
      axiosPrivate.post('/purchase' , {
        products : filterdCart,
        purchasesInfo : inputs,
      }).then(res => {
        setAllProducts(res.data.result.reverse());
        setLoading(false)
        setConfirmPurchase(true);
      }).catch(err => {
        console.log(err);
        if(err.response.status === 409){
          setErrMsg(err?.response?.data?.message)
        }
        setLoading(false)
      })
    }else{
      navigate('/')
    }
  }

  return(
    <div className="sumarry">
      {cart.length > 0 && 
        cart.map(e => {
          return <Card e={e} key={e.id}/>
        })
      }
      <Total calculatedPrice={calculatedPrice}/>
      {loading ? <div className="loading-container">
        <Loading />
      </div> : (
        <button className="continue" onClick={checkForm}>
          Continue & pay
        </button>
      )}
      {errMsg && (
      <div className='msg err errCheckOut'>
       <p>{errMsg}</p>
       <span onClick={() => setErrMsg('')}>X</span> 
      </div>
      )}
    </div>
  )
}

function Card({e}) {
  const {cart , setCart} = useCart();
  const {auth} = useAuth();

  const axiosPrivate = axios.create({
    headers : {
        'Authorization' : `Bearer ${auth?.accessToken}`
    },
    withCredentials: true
  });

  const minusHandler = () => {
    if(e.quantity > 1){
      axiosPrivate.put('/cart' , {
        productId : e.id,
        quantity : e.quantity - 1
      }).then(res => {
        console.log(res)
        setCart(prev => {
          return prev.map(i => {
              if(i.id === e.id){
                i.quantity = i.quantity - 1 ;
              }
            return i
          })
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }

  const plusHandler = () => {
      axiosPrivate.put('/cart' , {
        productId : e.id,
        quantity : e.quantity + 1
      }).then(res => {
        console.log(res)
        setCart(prev => {
          return prev.map(i => {
              if(i.id === e.id){
                i.quantity = i.quantity + 1 ;
              }
            return i
          })
        })
      }).catch(err => {
        console.log(err)
      })
  }

  const deleteHandler = () => {
    axiosPrivate.put('/cart' , {
      productId : e.id,
      quantity : 0
    }).then(res => {
      console.log(res)
      if(cart.length === 1){
        setCart([]);
      }else{
        setCart(prev => {
          return prev.filter(i => {
            return i.id !== e.id
          })
        })
      }
    }).catch(err => {
      console.log(err)
    })

  }


  return(
    <div className="card">
      <img src={e?.image} alt="product-img" />
      <div className="card-info">
        <h3>{e.productName}</h3>
        <h4>${e.price}</h4>
      </div>
      <div className="controls">
        <div className="quantity-controls">
          <span className='minus' onClick={minusHandler}>-</span>
          <span className='quantity'>{e.quantity}</span>
          <span className='plus' onClick={plusHandler}>+</span>
        </div>
        <button className='delete' onClick={deleteHandler}>Remove</button>
      </div>
    </div>
  )
}

function Total ({calculatedPrice}) {
  const {cart , setCart} = useCart();

  return (
    <div className='total'>
      <ul>
        <li>
          <span>Total</span>
          <span className='price'>${calculatedPrice.total}</span>
        </li>
        <li>
          <span>Shipping</span>
          <span className='price'>${calculatedPrice.shipping}</span>
        </li>
        <li>
          <span>Vat (included)</span>
          <span className='price'>${calculatedPrice.vat}</span>
        </li>
        <li className='grand-total'>
          <span>grand total</span>
          <span className='price'>${calculatedPrice.grandTotal}</span>
        </li>
      </ul>
    </div>
  )
}

function ThanYou ({calculatedPrice}){
  const navigate = useNavigate();
  const {setCart} = useCart();

  const toHome = () => {
    navigate('/');
    setCart([])
  }
  return (
    <div className="thank-you">
      <div className="thank-you-card">
          <img src={checkIcon} alt="check" />
          <h2>thank you for your order</h2>
          <p>you will receive an email confirmation shortly</p>
          <div className="grand-total">
            <span className="grand">grand total</span>
            <span >${calculatedPrice?.grandTotal}</span>
          </div>
          <button className='back-to-home' onClick={toHome}>
            Back To Home
          </button>
      </div>
    </div>
  )
}