import React from 'react'
import notFound404Img from '../../assets/2456051.jpg'

function NotFound404() {
  return (
    <div className='not-found'>
      <img src={notFound404Img} alt="not-found 404" />
      <h3>Page Not Found</h3>
    </div>
    
  )
}

export default NotFound404