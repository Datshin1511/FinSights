import React from 'react'

const HorizontalLine = ({color = 'black', width='50'}) => {
  return (
    <span style={{ 
        display: 'block',
        color: color, 
        borderBottom: '1px solid #f39c12', 
        margin: '1rem 0', 
        width: '100%' }}>
    </span>
  )
}

export default HorizontalLine