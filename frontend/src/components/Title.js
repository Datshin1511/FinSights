import React from 'react'

const Title = ({text = 'Hello World'}) => {
  return (
    <p className='fs-3 fw-bold lh-base text-center'>{text}</p>
  )
}

export default Title