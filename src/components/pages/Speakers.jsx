import React from 'react'
import DisplayProducts from './DisplayProducts'

function Speakers({page , products}) {
  return (
    <DisplayProducts products={products} page={page} />
  )
}

export default Speakers