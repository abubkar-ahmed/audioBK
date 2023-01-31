import React from 'react'
import { useEffect , useRef , useState} from 'react'
import { useNavigate } from 'react-router-dom'



function ImgPreviewer({currentProduct}) {
    const [imgIndecator , setImgIndecator] = useState({
        imgCount : 0,
        currentImg : 0,
    });

    const nextRef = useRef();
    const prevRef = useRef();
    const imgRef = useRef();



    useEffect(() => {
        if(currentProduct){
            if(!imgIndecator.imgCount){
                setImgIndecator({
                  imgCount : currentProduct.images.length,
                  currentImg : 0
                })
            }
        }
    },[currentProduct]);

    useEffect(() => {
        if(imgIndecator.currentImg === currentProduct.images.length - 1){
          nextRef.current.classList.add('hidden')
        }else{
          nextRef.current.classList.remove('hidden')
        }
        
        if(imgIndecator.currentImg === 0 || currentProduct.images.length === 1){
          prevRef.current.classList.add('hidden');
        }else{
          prevRef.current.classList.remove('hidden');
        }
    },[imgIndecator]);


    const nextImg = () => {
        if(imgRef.current.classList.contains('to-right')){
          imgRef.current.classList.remove('to-right');
        }
        if(imgRef.current.classList.contains('from-left')){
          imgRef.current.classList.remove('from-left');
        }
        const theLength = currentProduct.images.length
        if(imgIndecator.currentImg < theLength - 1){
          setTimeout(() => {
            imgRef.current.classList.add('to-right');
          }, 250);
          setTimeout(() => {
            imgRef.current.classList.remove('to-right');
            imgRef.current.classList.add('from-left');
  
          }, 500);
          setTimeout(() => {
            setImgIndecator(prev => {
              return (
                {
                  imgCount : theLength,
                  currentImg : prev.currentImg + 1 ,
                }
              )
            });
          }, 500);
        }
    }
  
    const prevImg = () => {
        if(imgRef.current.classList.contains('to-right')){
          imgRef.current.classList.remove('to-right');
        }
        if(imgRef.current.classList.contains('from-left')){
          imgRef.current.classList.remove('from-left');
        }
        const theLength = currentProduct.images.length
        if(imgIndecator.currentImg > 0){
          setTimeout(() => {
            imgRef.current.classList.add('to-right');
          }, 250);
          setTimeout(() => {
            imgRef.current.classList.remove('to-right');
            imgRef.current.classList.add('from-left');
  
          }, 500);
          setTimeout(() => {
            setImgIndecator(prev => {
              return (
                {
                  imgCount : theLength,
                  currentImg : prev.currentImg - 1 ,
                }
              )
            })
          }, 500);
        }
      }
  
    const imgGoTo = (id) => {
        if(imgRef.current.classList.contains('to-right')){
          imgRef.current.classList.remove('to-right');
        }
        if(imgRef.current.classList.contains('from-left')){
          imgRef.current.classList.remove('from-left');
        }
        setTimeout(() => {
          imgRef.current.classList.add('to-right');
        }, 250);
        setTimeout(() => {
          imgRef.current.classList.remove('to-right');
          imgRef.current.classList.add('from-left');
  
        }, 500);
        setTimeout(() => {
          setImgIndecator(prev => {
            return {
              imgCount : prev.imgCount,
              currentImg : id
            }
          })
        }, 500);
  
    }
      
    const DotsControll = () => {
        const arrOfSpans = []
        for(let i = 0 ; i < imgIndecator.imgCount ; i++){
          if(i === imgIndecator.currentImg){
            arrOfSpans.push({active : true , id : i});
          }else{
            arrOfSpans.push({active : false , id : i});
          }
        }      
        return (
          <>
            {arrOfSpans.map(e => {
              if(e.active){
                return (
                  <span 
                  className='active' 
                  key={e.id}
                  >
                  </span>
                )
              }else{
                return (
                  <span key={e.id} onClick={() => imgGoTo(e.id)}></span>
                )
              }
  
            })}
          </>
        )
    }




  return (
    <div className='img-prev ' >
        {currentProduct?.images?.length > 0 &&
            <div className="img-container">
            <img src={currentProduct?.images[imgIndecator.currentImg]} alt='img' className='img' ref={imgRef}/>
            </div>
        }
        <div className="controls">
        <button ref={prevRef} onClick={prevImg}>
            {`<`}
        </button>
        <div>
            <DotsControll/>
        </div>
        <button onClick={nextImg} ref={nextRef}>
            {`>`}
        </button>
        </div>
    </div>
  )
}

export default ImgPreviewer