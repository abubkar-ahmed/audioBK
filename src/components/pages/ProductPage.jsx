import React from 'react'
import { useState  } from 'react'
import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import ImgPreviewer from '../assestsComponents/productPageComponents/ImgPreviewer'
import AboutPrudoct from '../assestsComponents/productPageComponents/AboutPrudoct'
import CommentSection from '../assestsComponents/productPageComponents/CommentSection'
import {nanoid} from 'nanoid'
import useElemntOnScreen from '../../hooks/useElemntOnScreen'
import useProducts from '../../hooks/useProducts'

const options = {
  root : null,
  rootMargin:'0px',
  threshold: 0.3
}


function ProductPage() {
    const {auth} = useAuth();
    const {productId} = useParams();
    const { allProducts } = useProducts();

    const [currentProduct , setCurrentProduct] = useState({
      'images' : []
    });

    const navigate = useNavigate();

    useEffect(() => {
      if(allProducts.length > 0){
        const filterdPruduct = allProducts.filter(e => {
          return e.id === productId
        });
        if(filterdPruduct.length > 0){
          setCurrentProduct(...filterdPruduct)
        }else{
          navigate('/404');
        }

      }
    },[allProducts]);

    const productRef = useRef(null);
    const productVis = useElemntOnScreen(options,productRef);

    const featureRef = useRef(null);
    const featureVis = useElemntOnScreen(options,featureRef);

    useEffect(() => {
        if(productVis){
            setTimeout(() => {
              productRef.current.classList.add('show');
            }, 250);
        }else{
            productRef.current.classList.remove('show');
        }
        if(featureVis){
            featureRef.current.classList.add('show');
        }else{
            featureRef.current.classList.remove('show');
        }
    },[productVis , featureVis]);
    

  return (
    <main className='product-page ' >
      <button onClick={() => navigate(-1)} className='go-back'>
          Go Back
      </button>
      <section className='product-info hidden' ref={productRef}>
        <ImgPreviewer currentProduct={currentProduct} />
        <AboutPrudoct currentProduct={currentProduct} />
      </section>
      <section className='product-feature hidden' ref={featureRef}>
        <h2>FEATURES</h2>
        <ul>
          {currentProduct?.features && 
            currentProduct?.features.map(e => {
              return <li key={nanoid()}>{e}</li>
            })
          }
        </ul>
      </section>
      <CommentSection productId={productId} />
    </main>
  )
}

export default ProductPage