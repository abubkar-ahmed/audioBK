import React from 'react'
import DisplayProducts from './DisplayProducts'

function earPhones({page , products}) {
  return (
    <DisplayProducts products={products} page={page} />
  )
}

export default earPhones