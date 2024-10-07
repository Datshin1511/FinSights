// src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';
import Title from '../components/Title';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      await axios.post(
        'http://localhost:5000/user/sign-in',
        {
          email: username,
          password: password,
        },
        {
          withCredentials: true, // 🔴 Added: include credentials for session
        }
      );

      window.location.href = '/dashboard'; // Redirect to dashboard on success
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const loginWithGoogle = () => {
    window.open('http://localhost:5000/auth/google', '_self');
  };

  const loginWithFacebook = () => {
    window.open('http://localhost:5000/auth/facebook', '_self');
  };

  return (
    <div className='login-home-container d-flex flex-row row'>
      {/* Left Side Image or Branding */}
      <div className='col-lg-8 col-md-6 col-sm-12 bg-warning p-0 m-0 d-none d-lg-block'></div>

      {/* Right Side Login Form */}
      <div className='d-flex col-lg-4 col-md-6 col-sm-12 align-items-center justify-content-center login-form'>
        <div className='w-100 px-4'>
          <Title text='Login to your account.' />
          <p className='text-center'>Login to view your dashboard and obtain various insights.</p>
          <form className='form-control d-flex flex-column' onSubmit={handleLogin}>
            <div className='form-group my-2'>
              <label htmlFor='user-email-address'>Email address</label>
              <input
                className='form-control my-1'
                type='email'
                name='username'
                id='user-email-address'
                onChange={(e) => setUsername(e.target.value)}
                aria-describedby='emailHelp'
                placeholder='Enter email'
                required // 🔄 Added: make email required
              />
              <small id='emailHelp' className='form-text text-muted'>
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className='form-group my-2'>
              <label htmlFor='user-password'>Password</label>
              <input
                className='form-control my-1'
                type='password'
                name='password'
                onChange={(e) => setPassword(e.target.value)}
                id='user-password'
                placeholder='Password'
                required // 🔄 Added: make password required
              />
            </div>
            <div className='d-flex justify-content-center my-2'>
              <button type='submit' className='btn btn-outline-success px-3 text-center'>
                Login
              </button>
            </div>
          </form>
          <p className='my-2 text-center text-secondary'>Or</p>
          <div className='container-md-6 container-sm-4 d-flex flex-column'>
            <button
              type='button'
              className='btn btn-outline-secondary m-2 p-2'
              onClick={loginWithGoogle}
            >
              <div className='d-flex align-items-center justify-content-center'>
                <img
                  src='/images/google_logo.png'
                  className='d-block mx-2'
                  alt='Google Logo'
                  width='20'
                  height='20'
                />
                <p className='m-0 p-0'>Sign in with Google</p>
              </div>
            </button>
            <button
              type='button'
              className='btn btn-outline-secondary m-2 p-2'
              onClick={loginWithFacebook}
            >
              <div className='d-flex align-items-center justify-content-center'>
                <img
                  src='/images/facebook_logo.png'
                  className='d-block mx-2'
                  alt='Facebook Logo'
                  width='20'
                  height='20'
                />
                <p className='m-0 p-0'>Sign in with Facebook</p>
              </div>
            </button>
          </div>
          <div className='my-4'>
            <p className='h6 text-center my-2 text-secondary'>
              Forgot password? <a href='/reset-password' className='links'>Click here</a> to reset.
            </p>
            <p className='h6 text-center my-2 text-secondary'>
              Not registered? <a href='/register' className='links'>Click here</a> to register now!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
