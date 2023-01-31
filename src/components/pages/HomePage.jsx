import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import hero from '../../assets/hero-6.jpg'
import useElemntOnScreen from '../../hooks/useElemntOnScreen';
import { useRef } from 'react';
import NavList from '../assestsComponents/NavList';
import HeroSection from '../assestsComponents/HeroSection';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';


function HomePage() {
    const [products , setProducts] = useState()
    const [newProduct , setNewProduct] = useState({});
    const [randomProducts , setRandomProducts] = useState({});

    const newProductRef = useRef(null);
    const heroRef = useRef(null);

    const navigate = useNavigate();
    const {allProducts} = useProducts();

    useEffect(() => {
        if(allProducts.length > 0){
            setProducts(() => {
                return {
                  headphones : allProducts.filter(e => {
                    return e.category === 'headphones'
                  }),
                  speakers : allProducts.filter(e => {
                    return e.category === 'speakers'
                  }),
                  earphones : allProducts.filter(e => {
                    return e.category === 'earphones'
                  }),
                }
              })
        }
    },[allProducts])


    useEffect(() => {
        if(products){
            setNewProduct(allProducts[0]);
            setRandomProducts(() => {
                return {
                    headphone : products.headphones[Math.floor(Math.random() * products.headphones.length)],
                    speaker : products.speakers[Math.floor(Math.random() * products.speakers.length)],
                    earphone : products.earphones[Math.floor(Math.random() * products.earphones.length)]
                }
            })

            setTimeout(() => {
                heroRef?.current?.classList?.add('show');
                setTimeout(() => {
                    newProductRef?.current?.classList?.add('show')
                }, 1500);
            }, 500);


        }
    },[products]);

    const options = {
        root : null,
        rootMargin:'0px',
        threshold: 0.3
    }
    


    const prOneRef = useRef(null);
    const prOneVis = useElemntOnScreen(options,prOneRef);

    const prTwoRef = useRef(null);
    const prTwoVis = useElemntOnScreen(options,prTwoRef);

    const prThreeRef = useRef(null);
    const prThreeVis = useElemntOnScreen(options,prThreeRef);



    useEffect(() => {
        if(prOneVis){
            prOneRef.current.classList.add('show');
        }
        if(prTwoVis){
            prTwoRef.current.classList.add('show');
        }
        if(prThreeVis){
            prThreeRef.current.classList.add('show');
        }

    },[prOneVis , prTwoVis ,prThreeVis]);



  return (
    <>
    
    {products && 
        <main className='home-page'>
            <section className='section-1'>
                <div className='hidden' ref={newProductRef}>
                    <h1>
                        <strong>
                            NEW PRODUCT
                        </strong>
                        {newProduct?.productName}
                    </h1>               
                    <p>
                        Experience natural, lifelike audio and exceptional build quality made for the passionate music enthusiast.
                    </p>
                    
                    <button 
                    onClick={() => navigate(`/product/${newProduct?.id}`)}>
                        SEE Product
                    </button>
                </div>
                <img src={hero} alt="main-hero" ref={heroRef} className='hidden'/>
            </section>
            <section className='nav-section'>
                <NavList/>
                {randomProducts && 
                    <ul className='products-list'>
                        <li className='hidden' ref={prOneRef}>
                            <img src={randomProducts?.headphone?.images[0]} alt="product-img" />
                            <div>
                                <h3>{randomProducts?.headphone?.productName}</h3>
                                <button 
                                className='see-product'
                                onClick={() => navigate(`/product/${randomProducts?.headphone?.id}`)}
                                >
                                    SEE PRODUCT
                                </button>
                            </div>
                        </li>
                        <li className='hidden' ref={prTwoRef}>
                            <img src={randomProducts?.speaker?.images[0]} alt="product-img" />
                            <div>
                                <h3>{randomProducts?.speaker?.productName}</h3>
                                <button 
                                className='see-product'
                                onClick={() => navigate(`/product/${randomProducts?.speaker?.id}`)}
                                >
                                    SEE PRODUCT
                                </button>
                            </div>
                        </li>
                        <li className='hidden' ref={prThreeRef}>
                            <img src={randomProducts?.earphone?.images[0]} alt="product-img" />
                            <div>
                                <h3>{randomProducts?.earphone?.productName}</h3>
                                <button 
                                className='see-product'
                                onClick={() => navigate(`/product/${randomProducts?.earphone?.id}`)}
                                >
                                    SEE PRODUCT
                                </button>
                            </div>
                        </li>
                    </ul>   
                }

            </section>
            <HeroSection/>
        </main>
    }
    </>
  )
}

export default HomePage