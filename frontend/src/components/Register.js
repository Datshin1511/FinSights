import React, { useState } from 'react'
import axios from 'axios'

const Register = () => {

  const loginWithGoogle = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self")
  }

  const loginWithFacebook = () => {
    window.open("http://localhost:5000/auth/facebook/callback", "_self")
  }

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async (e) => {
    axios.post('http://localhost:5000/user/sign-up', {
      username: username,
      password: password
    })
  }

  return ( 
    <div className='container-sm login-form'>
      <form className='form-control d-flex flex-column' onSubmit={handleSignUp}>
        <div className="form-group my-2">
          <label for="user-email-address">Email address</label>
          <input 
            type="email" 
            className="form-control my-1" 
            id="user-email-address" 
            aria-describedby="emailHelp" 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter email" />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group my-2">
          <label for="user-password">Password</label>
          <input 
            type="password" 
            className="form-control my-1" 
            id="user-password"
            onChange={(e) => setPassword(e.target.value)}  
            placeholder="Password" />
        </div>
        <div className='d-flex justify-content-center my-2'>
          <button type="submit" className="btn btn-outline-success px-3 w-25 text-center">Register</button>
        </div>
      </form>
      <hr />
      <div className='container-sm-6 login-options'>
        <button type='submit' className='btn btn-outline-danger px-3 m-2' onClick={loginWithGoogle}>
          Sign in with Google
        </button>
        <button type='submit' className='btn btn-outline-primary px-3 m-2' onClick={loginWithFacebook}>
          Sign in with Facebook
        </button>
      </div>
      <p className='h6 text-center text-secondary'>Already have an account? <a href='/login' className='links'>Click here</a> to login now!</p>
    </div>
  )
}

export default Register