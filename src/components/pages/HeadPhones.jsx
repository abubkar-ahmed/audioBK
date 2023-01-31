import React from 'react'
import DisplayProducts from './DisplayProducts'

function HeadPhones({page , products}) {
  return (
    <DisplayProducts products={products} page={page} />
  )
}

export default HeadPhones