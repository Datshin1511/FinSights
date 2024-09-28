import React from 'react'
import '../styles/header.css'

const Headers = () => {

  const loginWindow = () => {
    window.open("http://localhost:3000/login", "_self")
  }

  const homeWindow = () => {
    window.open("http://localhost:3000/", "_self")
  }

  return (
    <nav className='navbar py-2 px-3'>
      <div className='navbar-title'>
        <img src='/FinSights.png' alt='finsights.png' onClick={homeWindow}/>
        <p>FinSights Corp.</p>
      </div>

      <div className='login-div'>
        <button className='btn btn-success px-4 mx-2' onClick={loginWindow}>
          Login
        </button>
      </div>

    </nav>
  )
}

export default Headers