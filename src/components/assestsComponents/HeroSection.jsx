import React from 'react'
import { useEffect ,useRef} from 'react';
import hero2 from '../../assets/hero-2.jpg'
import useElemntOnScreen from '../../hooks/useElemntOnScreen';


function HeroSection() {
    const options = {
        root : null,
        rootMargin:'0px',
        threshold: 0.3
    }
    const hero2Ref = useRef(null);
    const hero2Vis = useElemntOnScreen(options,hero2Ref);

    useEffect(() => {
        if(hero2Vis){
            hero2Ref.current.classList.add('show');
        }else{
            hero2Ref.current.classList.remove('show');
        }
    },[hero2Vis])
  return (
    <section className='about-section hidden' ref={hero2Ref}>
        <img src={hero2} alt="hero-image" />
        <div>
            <h2>
                BRINGING YOU THE <span>BEST</span> AUDIO GEAR
            </h2>
            <p>
            Located at the heart of New York City, AudioBK is the premier store for high end headphones, earphones, speakers, and audio accessories. We have a large showroom and luxury demonstration rooms available for you to browse and experience a wide range of our products. Stop by our store to meet some of the fantastic people who make AudioBK the best place to buy your portable audio equipment.
            </p>
        </div>
    </section>
  )
}

export default HeroSection