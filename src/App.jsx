import React, { useState , useEffect} from 'react'
import axios from './api/axios';
import Header from './components/assestsComponents/Header';
import Footer from './components/assestsComponents/Footer'
import {Routes , Route , useLocation} from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import AuthForm from './components/assestsComponents/authComponents/AuthForm';
import useAuth from './hooks/useAuth';
import useRefreshToken from './hooks/useRefreshToken';
import HeadPhones from './components/pages/HeadPhones';
import Speakers from './components/pages/Speakers';
import EarPhones from './components/pages/EarPhones';
import ProductPage from './components/pages/ProductPage';
import NotFound404 from './components/pages/NotFound404';
import useProducts from './hooks/useProducts';
import CheckOut from './components/pages/CheckOut';
import Account from './components/pages/Account';
import AdminDashBoard from './components/pages/AdminDashBoard';
import ProtectedRoutesOne from './protectedRoutes/ProtectedRoutesOne';
import ProtectedRoutesTwo from './protectedRoutes/ProtectedRoutesTwo';
import arrowUp from './assets/icons8-up-24.png';
import Loading from './components/assestsComponents/Loading';


function App() {
  const  {auth , setAuth}  = useAuth();
  const {allProducts , setAllProducts} = useProducts();
  const [showCart , setShowCart] =useState(false);
  const [showUserControls , setShowUserControls] = useState(false);
  const [scrollToTop , setScrollToTop] = useState(false);
  const [loading , setLoading] = useState(false);
  const location = useLocation();

  const [products , setProducts] = useState({
    'headphones' : [],
    'speakers' : [],
    'earphones' : []
  })
  const [showAuthStatus , setShowAuthStatus] = useState('verCode');

  // const [allProducts , setAllProducts] = useState([]);

  useEffect(() => {
    getAllProducts();
  },[])

  const getAllProducts = async () => {
    try{
      const response = await axios.get('/products');
      const prod = response.data.products
      setAllProducts(prod.reverse());
      setProducts(() => {
        return {
          headphones : prod.filter(e => {
            return e.category === 'headphones'
          }),
          speakers : prod.filter(e => {
            return e.category === 'speakers'
          }),
          earphones : prod.filter(e => {
            return e.category === 'earphones'
          }),
        }
      })
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    if(allProducts.length > 0){
      setLoading(true)
    }
  },[allProducts])

  

  const refresh = useRefreshToken();

  const refreshFunction = async () => {
    try {
      const ref = await refresh();
      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  }

  React.useEffect(() => {
    refreshFunction() ; 
  },[]);

  const topRef = React.useRef(null);
  React.useEffect(() => {
    topRef.current?.scrollIntoView({behavior: 'auto'});
  },[location]);

  const handleScroll = () => {
    if(window.scrollY > 100){
      setScrollToTop(true);
    }else{
      setScrollToTop(false)
    }
  }

  
  useEffect(() => {
    window.addEventListener('scroll' , handleScroll)

    return () => window.removeEventListener('scroll' , handleScroll)
  })

  const handleScrollToTopBtn = () => {
    topRef.current?.scrollIntoView({behavior: 'auto'});
  }

  const mainContainerCilckHandler = () => {
    setShowUserControls(false);
    setShowCart(false)
  }


  
  return (
    <>
    {loading ? (
      <>
      <div ref={topRef} ></div>
      <Header 
      showCart={showCart} 
      setShowCart={setShowCart}
      showUserControls={showUserControls} 
      setShowUserControls={setShowUserControls}
      
      />
      <AuthForm />
      <div className='main-container' onClick={mainContainerCilckHandler}>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage products={products}/>} />

          {/* HeadPhone Page */}
          <Route path='headphones' element={<HeadPhones products={products?.headphones} page='headphones'/>} />
          <Route path='headphones/:pageNumber' element={<HeadPhones products={products?.headphones} page='headphones'/>} />

          {/* Speakers Page */}
          <Route path='speakers' element={<Speakers products={products?.speakers} page='speakers' />} />
          <Route path='speakers/:pageNumber' element={<Speakers products={products?.speakers} page='speakers' />} />

          {/* EarPhones Page */}
          <Route path='earphones' element={<EarPhones products={products?.earphones} page='earphones' />} />
          <Route path='earphones/:pageNumber' element={<EarPhones products={products?.earphones} page='earphones' />} />

          {/* Products Page */}
          <Route 
            path='product/:productId' 
            element={<ProductPage />}
          
          />

          {/* Protect Route For None Sign In User And User With Admin Or Main Admin Roles */}
          <Route element={<ProtectedRoutesOne/>}>
            {/* CheckOut Page */}
            <Route path='checkout' element={<CheckOut />}/>
            {/* Account Page */}
            <Route path='account' element={<Account />}/>
          </Route>


          {/*Admin Only*/}
          <Route element={<ProtectedRoutesTwo />}>
            {/* Admin DashBoard */}
            <Route path='dashboard/:navheader' element={<AdminDashBoard />} />
            <Route path='dashboard/:navheader/:productStaus' element={<AdminDashBoard />} />
          </Route>


        {/* 404 Page */}
          <Route path='*' element={<NotFound404/>}/>
        </Routes>
        {scrollToTop && (
          <button onClick={handleScrollToTopBtn} className='scroll-top'>
            <img src={arrowUp} alt="Scroll To Top" />
            <p>Top</p>
          </button>
        )}
      </div>
      <Footer/>
      </>
    ): (
      <div className="main-loading">
        <Loading/>
      </div>
      
    )}

    </>
  )
}

export default App
