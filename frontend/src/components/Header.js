/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import '../styles/header.css'

const Header = () => {

  const loginWindow = () => {
    window.open("http://localhost:3000/login", "_self")
  }

  const homeWindow = () => {
    window.open("http://localhost:3000/", "_self")
  }
  
  const [oscillate, oscillator] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      oscillator(oscillate => !oscillate)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <nav className='navbar py-2 px-3'>
      <div className='container-md-6 navbar-title'>
        <img src='/FinSights.png' alt='finsights.png' onClick={homeWindow}/>
        <p>FinSights Corp.</p>
      </div>

      <div className='login-div'>
        <a id='login-button' href='#' onClick={loginWindow}>
          {oscillate ? 'Login' : 'Register'}
        </a>
        <a href='/about'>About</a>
      </div>
    </nav>

  )
}

export default Header