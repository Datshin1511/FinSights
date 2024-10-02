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
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        oscillator(oscillate => !oscillate)
        setVisible(true)
      }, 1000)

    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <nav className='navbar py-2 px-3'>
      <div className='container-md-6 navbar-title'>
        <img src='/FinSights.png' alt='finsights.png' onClick={homeWindow}/>
        <p id='company-name'>FinSights Corp.</p>
      </div>

      <div className='login-div'>
        <ul className='d-flex list-none'>
          <li>
            <a id='login-button' href='#' onClick={loginWindow}>
              <span className={`animated-text ${visible ? 'visible' : ''}`}>
                {oscillate ? 'Login' : 'Register'}
              </span>
            </a>
          </li>

          {
            (true) ? (
              <>
                <li><a href='/dashboard'>Dashboard</a></li>
                <li><a href='/history'>History</a></li>
              </>
            ) : ( <></> )
          }

          <li><a href='/about'>About</a></li>

        </ul>
      </div>
    </nav>

  )
}

export default Header