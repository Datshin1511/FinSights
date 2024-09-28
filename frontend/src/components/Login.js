import React from 'react'
import '../styles/login.css'

const Login = () => {

  const loginWithGoogle = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self")
  }

  const loginWithFacebook = () => {
    window.open("http://localhost:5000/auth/facebook/callback", "_self")
  }

  return (
    <div className='container-sm'>
      <p className='display-4 text-center my-3'>Login</p>
      <form className='form-control'>
        <div className="form-group my-3">
          <label for="user-email-address">Email address</label>
          <input type="email" className="form-control my-1" id="user-email-address" aria-describedby="emailHelp" placeholder="Enter email" />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group my-3">
          <label for="user-password">Password</label>
          <input type="password" className="form-control my-1" id="user-password" placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-success px-3">Login</button>
      </form>
      <hr />
      <div className='d-flex p-3 justify-content-center'>
        <button type='submit' className='btn btn-outline-danger px-3 m-2' onClick={loginWithGoogle}>
          Sign in with Google
        </button>
        <button type='submit' className='btn btn-outline-primary px-3 m-2' onClick={loginWithFacebook}>
          Sign in with Facebook
        </button>
      </div>
    </div>
  )
}

export default Login