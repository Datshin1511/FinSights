import React from 'react'

const Register = () => {
  return (
    <div className='container-sm'>
      <p className='display-4 text-center my-3'>Register</p>
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
        <button type="submit" className="btn btn-success px-3">Sign up</button>
      </form>
      <hr />
      <div className='d-flex p-3 justify-content-center'>
        <button type='submit' className='btn btn-outline-danger px-3 m-2'>
          Sign up with Google
        </button>
        <button type='submit' className='btn btn-outline-primary px-3 m-2'>
          Sign up with Facebook
        </button>
      </div>
      <p className='h6 text-center text-secondary'>Already have an account? <a href='/login' className='links'>Click here</a> to login now!</p>
    </div>
  )
}

export default Register