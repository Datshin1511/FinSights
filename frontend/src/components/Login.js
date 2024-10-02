import React, { useState } from 'react'
import axios from 'axios'
import '../styles/login.css'

const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    axios.post('http://localhost:5000/user/sign-in', {
      username: username,
      password: password
    })
  }

  const loginWithGoogle = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self")
  }

  const loginWithFacebook = () => {
    window.open("http://localhost:5000/auth/facebook/callback", "_self")
  }

  return (
    <div className='login-container container-fluid row'>
      <div className='col-7 scontainer-md bg-warning'></div>

      <div className='container login-form col-4'>
        <form className='form-control d-flex flex-column' onSubmit={handleLogin}>
          <div className="form-group my-2">
            <label for="user-email-address">Email address</label>
            <input 
              className="form-control my-1" 
              type="email" 
              name="username"
              id="user-email-address"
              onChange={(e) => setUsername(e.target.value)} 
              aria-describedby="emailHelp" 
              placeholder="Enter email"

               />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="form-group my-2">
            <label for="user-password">Password</label>
            <input 
              className="form-control my-1"
              type="password" 
              name="password"
              onChange={(e) => setPassword(e.target.value)} 
              id="user-password" 
              placeholder="Password" />
          </div>
          <div className='d-flex justify-content-center my-2'>
            <button type="submit" className="btn btn-outline-success px-3 w-25 text-center">Login</button>
          </div>
        </form>
        <hr />
        <div className='container-md-6 login-options'>
          <button type='submit' className='btn btn-primary m-2' onClick={loginWithGoogle}>
            <div className='d-flex flex-direction-column'>
              <span><img src='https://e7.pngegg.com/pngimages/114/607/png-clipart-g-suite-pearl-river-middle-school-google-software-suite-email-sign-up-button-text-logo.png' width='50px' alt='google_logo.png' /></span>
              <p>Sign in with Google</p>
            </div>
          </button>
          <button type='submit' className='btn btn-outline-primary px-3 m-2' onClick={loginWithFacebook}>
            Sign in with Facebook
          </button>
        </div>
        <p className='h6 text-center text-secondary'>Not registered? <a href='/register' className='links'>Click here</a> to register now!</p>
      </div>
    </div>
  )
}

export default Login