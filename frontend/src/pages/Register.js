import React, { useState } from 'react'
import axios from 'axios'
import '../styles/register.css'
import Title from '../components/Title'

const Register = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async (e) => {
    axios.post('http://localhost:5000/user/sign-in', {
      username: username,
      password: password
    })
  }

  const signUpWithGoogle = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self")
  }

  const signUpWithFacebook = () => {
    window.open("http://localhost:5000/auth/facebook/callback", "_self")
  }

  return (
    <div className='login-home-container d-flex flex-row row'>
      <div className='col-lg-8 col-md-8 col-sm bg-warning p-0 m-0'></div>
      
      <div className='d-flex col-lg-4 col-md-4 align-items-center login-form'>
        <Title text='Sign up for a new account.'/>
        <p className='text-center'>Get started with our app, just create an account and enjoy the experience.</p>
        <form className='form-control d-flex flex-column' onSubmit={handleSignUp}>
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
            <button type="submit" className="btn btn-outline-success px-3 text-center">Sign up</button>
          </div>
        </form>
        <p className='my-2 text-secondary'>Or</p>
        <div className='container-md-6 container-sm-4 d-flex flex-column'>
          <button type='submit' className='btn btn-outline-secondary m-2 p-2' onClick={signUpWithGoogle}>
            <div className='d-flex align-items-center justify-content-center'>
              <img src='./google_logo.png' className='d-block mx-2' alt='google_logo.png' />
              <p className='m-0 p-0'>Sign up with Google</p>
            </div>
          </button>
          <button type='submit' className='btn btn-outline-secondary m-2 p-2' onClick={signUpWithFacebook}>
            <div className='d-flex align-items-center justify-content-center'>
              <img src='./facebook_logo.png' className='d-block mx-2' alt='facebook_logo.png' />
              <p className='m-0 p-0'>Sign up with Facebook</p>
            </div>
          </button>
        </div>
        <p className='h6 text-center my-5 text-secondary'>Registered already? <a href='/login' className='links'>Click here</a> to login now!</p>
      </div>
    </div>
  )
}

export default Register