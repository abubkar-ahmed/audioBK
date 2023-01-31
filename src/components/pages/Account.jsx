import React from 'react'
import { useState , useEffect } from 'react';
import useAuth from '../../hooks/useAuth'
import axios from '../../api/axios';
import useProducts from '../../hooks/useProducts';
import moment from 'moment'
import { useRef } from 'react';
import deafualImg from '../../assets/defualt.png';
import penImg from '../../assets/pen.svg';
import checkMark from '../../assets/icons8-checkmark-48.png';
import cancelMark from '../../assets/icons8-cancel-48.png';
import Loading from '../assestsComponents/Loading';


function Account() {

  const {auth} = useAuth();
  const [purchases , setPurchases] = useState([]);
  const {allProducts , setAllProducts} = useProducts();
  const [navigationState , setNavigationState] = useState('purchase')

  const axiosPrivate = axios.create({
    headers : {
        'Authorization' : `Bearer ${auth?.accessToken}`
    },
    withCredentials: true
  });


  
  useEffect(() => {
    if(auth?.accessToken && allProducts.length > 0){
      axiosPrivate.get('/purchase').then(res => {
        setPurchases(res.data.map(e => {
          return {...e , products : e.products.map(i => {
            const filterdProduct = allProducts.filter(h => {
              return i.productId === h.id ;
            })
            return {
              quantity : i.quantity,
              productId : i.productId,
              productName : filterdProduct[0].productName,
              price : filterdProduct[0].price,
              image : filterdProduct[0].images[0]
            }
          })}
        }))
      }).catch(err => {
        console.log(err);
      })
    }
  },[auth , allProducts])

  const purchaseRef = useRef(null)
  const accountRef = useRef(null)
  
  useEffect(() => {
    if(navigationState === 'purchase'){
      purchaseRef.current.classList.add('active');
      accountRef.current.classList.remove('active');
    }else{
      purchaseRef.current.classList.remove('active');
      accountRef.current.classList.add('active');
    }
  },[navigationState])

  return (
    <main className='account'>
      <div className="account-container">
        <nav>
          <ul>
            <li>
              <button onClick={() => setNavigationState('purchase')} ref={purchaseRef}>
                Purchases
              </button>
            </li>
            <li>
              <button onClick={() => setNavigationState('accountSittings')} ref={accountRef}>
                Account
              </button>
            </li>
          </ul>
        </nav>
        {navigationState === 'purchase' ? (
          <Purchases purchases={purchases}/>
        ): (
          <AccontSittings /> 
        )}
        
      </div>
    </main>
  )
}

export default Account


function AccontSittings () {
  const { auth } = useAuth();
  const [img , setImg] = useState('');
  const [imgPrev, setImgPrev] = useState('');
  const [editpwd , setEditPwd] = useState(false);
  const [pwd , setPwd] = useState('');
  const [rPwd , setRpwd] = useState('');
  const [displayConfirm , setDisplayConfirm] = useState(false);
  const [errMsg , setErrMsg] = useState({
    status : false ,
    msg : ''
  })
  const [loading , setLoading] = useState(false);
  const [check , setCheck] = useState(false);
  const [cancel , setCancel] = useState(false);

  const fileHandle = (e) => {
    setImg(e.target.files[0])
    setImgPrev(URL.createObjectURL(e.target.files[0]));
  }
  useEffect(() => {
    if(auth.accessToken){
      if(auth.image){
        setImgPrev(auth?.image);
      }else{
        setImgPrev(deafualImg);
      }
    }
  },[auth]);

  useEffect(() => {
    if(img || pwd || rPwd){
      setDisplayConfirm(true);
      setCheck(false);
      setCancel(false);
    }else{
      setDisplayConfirm(false);
    }
  },[img , pwd , rPwd]);

  useEffect(() => {
    setErrMsg({
      status : false,
      msg : ''
    })
  },[editpwd , pwd , rPwd])

  const makeThecall = () => {
    setLoading(true);
    let formData = new FormData();
    if(img){
      formData.append('img' , img);
    }
    if(pwd && rPwd){
      formData.append('pwd' , pwd);
      formData.append('rPwd' , rPwd);
    }
    const axiosPrivate = axios.create({
      headers : {
          'Authorization' : `Bearer ${auth?.accessToken}`,
          'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    axiosPrivate.put('/edit-user' , formData).then(res => {
      console.log(res)
      setLoading(false);
      setCheck(true);
    }).catch(err => {
      console.log(err)
      setLoading(false);
      setCancel(true);
      if(err.response.status === 400 || err.response.status === 409){
        setErrMsg({
          status : true,
          msg: err.response.data.message
        })
      }else{
        setErrMsg({
          status : true,
          msg: 'Somthing Went Wrong Please Try Again Later'
        })
      }
    })
  }

  const confirmHandler = () => {
    if(editpwd){
      setErrMsg({
        status : true,
        msg : 'please Save Changes'
      })
    }else{
      if(img || (pwd && rPwd)){
        makeThecall();
      }
      else{
        setErrMsg({
          status : true,
          msg : 'please Enter Valied inputs'
        })
      }
    }
  }


  return (
    <div className="content account-sittings">
      <h2>Account</h2>
      <div className="account-sittings-contailner">
        <div className="user-img">
          <img src={imgPrev} alt="user-img" className='user-image'/>
          <label htmlFor="img-input">
            <img src={penImg} alt='pen-icon' className='pen-img'/>
          </label>
          <input type="file" name='img' id='img-input' onChange={fileHandle}/>
        </div>
        <div className="email">
          <div className='info'>
            <h3>Email</h3>
            <h4>{auth?.email}</h4>
          </div>
        </div>
        <div className="username">
          <div className='info'>
            <h3>username</h3>
            <h4>@{auth?.username}</h4>
          </div>
        </div>
        <div className="pwd">
          <div className='info'>
            <h3>Password</h3>
            {editpwd ? (
              <>
              <input type='password' name='pwd' placeholder='Enter Your New password' onChange={(e) => setPwd(e.target.value)} value={pwd}/>
              <input type='password' name='rPwd' placeholder='Enter Your Repeted New password' onChange={(e) => setRpwd(e.target.value)} value={rPwd}/>              
              </>
            ): (
              <h4>*********</h4>
            )}
          </div>
          {editpwd ? (
            <button onClick={() => setEditPwd(e => !e)} className='save'>Save</button>
          ): (
            <button onClick={() => setEditPwd(e => !e)}>Edit</button>
          )}
        </div>
        {displayConfirm &&         
        <div className="confirm">
          {displayConfirm &&
            loading ? <Loading/> : check ? (
              <img src={checkMark} alt='check' className='mark'/>
            ) : cancel ? (
              <img src={cancelMark} alt='cancel' className='mark'/>
            ) : (
              <button onClick={confirmHandler}>Confirm</button>
            )
          }
          
        </div>}
        {errMsg.status && 
          <p className='err-msg'>{errMsg.msg}</p>
        }
      </div>
    </div>
  )
}


function Purchases({purchases}){

  return (
    <>
      {purchases.length  ? (
        <div className="content purchases">
          <h2>purchase</h2>
          {purchases.map(e => {
            return (
              <Card e={e} key={e._id}/>
            )
          })}
        </div>
      ):(
        <div className="empty">
          Your Purachase List Is Empty
        </div>
      )}
    </>
  )
}

function Card({e}){
  const newDate = new Date();
  const date = new Date(e.Date);    
  const result = moment(newDate).diff(moment(date));
  const time = moment.duration(result).humanize();

  const [details , setDetails] = useState(false);


  return(
    <>
      {details ? (
        <div className='card' >
          <div className="name">
            <h3>Name</h3>
            <h4>{e.purchasesInfo.name}</h4>
          </div>
          <div className="email">
            <h3>email</h3>
            <h4>{e.purchasesInfo.email}</h4>
          </div>
          <div className="phone">
            <h3>phone</h3>
            <h4>{e.purchasesInfo.phone}</h4>
          </div>
          <div className="location">
            <h3>Location</h3>
            <h4>{e.purchasesInfo.city}, {e.purchasesInfo.country}</h4>
          </div>
          <div className="address">
            <h3>address</h3>
            <h4>{e.purchasesInfo.address}</h4>
          </div>
  
          <div className="zipCode">
            <h3>zip Code</h3>
            <h4>{e.purchasesInfo.zipCode}</h4>
          </div>
          <div className="grand-total">
            <h3>grand total</h3>
            <h4>${e.total.grandTotal}</h4>
          </div>
          <div className="payment-methode">
            <h3>payment Methode</h3>
            <h4>{e.purchasesInfo.paymentMethode}</h4>
          </div>
          <div className="date">
            {time} ago
          </div>
          <div className="details" onClick={() => setDetails(e => !e)}>
            hide details
          </div>
          <div className="products">
            {e.products.map(i => {
              return (
                <div className="product-card" key={i.productId}>
                  <img src={i.image} alt="product-img" />
                  <div className="product-name-price">
                    <p>{i.productName}</p>
                    <p className='price'>${i.price}</p>
                  </div>
                  <div className="quentity">
                    x{i.quantity}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="name">
            <h3>Name</h3>
            <h4>{e.purchasesInfo.name}</h4>
          </div>
          <div className="email">
            <h3>email</h3>
            <h4>{e.purchasesInfo.email}</h4>
          </div>
          <div className="location">
            <h3>Location</h3>
            <h4>{e.purchasesInfo.city}, {e.purchasesInfo.country}</h4>
          </div>
          <div className="grand-total">
            <h3>grand total</h3>
            <h4>${e.total.grandTotal}</h4>
          </div>
          <div className="date">
            {time} ago
          </div>
          <div className="details" onClick={() => setDetails(e => !e)}>
            more details
          </div>
        </div>
      )
    
    }
    </>
  )
}

