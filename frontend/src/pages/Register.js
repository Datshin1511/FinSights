import React, { useState } from 'react';
import axios from 'axios';
import '../styles/register.css';
import Title from '../components/Title';

const Register = () => {
  // State variables for form inputs
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState(null); // Changed to null for better handling of file upload

  // State variables for feedback messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler for local sign-up form submission
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError('');
    setSuccess('');

    // Basic client-side validation
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError('Firstname, Lastname, Email, Password, and Confirm Password are required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&+=]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include both letters and numbers.');
      return;
    }

    setIsSubmitting(true); // Disable the form to prevent multiple submissions

    try {
      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('fullname', fullname);
      formData.append('email', email);
      formData.append('password', password);
      if (photo) {
        formData.append('photo', photo);
      }

      for (let [key, value] of formData.entries()) {
        console.log(key, value); // Log each field in FormData
      }

      const response = await axios.post('http://localhost:5000/user/sign-up', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
        withCredentials: true, // Include credentials for session management
      });

      if (response.status === 201) {
        setSuccess('Registration successful! Redirecting to login...');
        setError('');
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Handle different error responses from the server
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during registration.');
      }
      setSuccess('');
    } finally {
      setIsSubmitting(false); // Re-enable the form
    }
  };

  // Handlers to initiate OAuth flows
  const signUpWithGoogle = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  const signUpWithFacebook = () => {
    window.open("http://localhost:5000/auth/facebook", "_self");
  };

  return (
    <div className='register-home-container d-flex flex-row row'>
      {/* Left Side Image or Branding */}
      <div className='col-lg-8 col-md-6 col-sm-12 bg-warning p-0 m-0 d-none d-lg-block'></div>

      {/* Right Side Registration Form */}
      <div className='d-flex col-lg-4 col-md-6 col-sm-12 align-items-center justify-content-center register-form'>
        <div className='w-100 px-4'>
          <Title text='Sign Up for a New Account' />
          <p className='text-center'>Get started with our app. Create an account and enjoy the experience.</p>

          {/* Display Success or Error Messages */}
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="alert">{success}</div>}

          {/* Local Sign-Up Form */}
          <form className='form-control d-flex flex-column' onSubmit={handleSignUp} noValidate>
            {/* Firstname Field */}
            <div className="form-group my-2">
              <label htmlFor="user-firstname">Firstname <span className='required-field'>*</span></label>
              <input
                className="form-control my-1"
                type="text"
                name="firstname"
                id="user-firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Enter your firstname"
                required
              />
            </div>

            {/* Lastname Field */}
            <div className="form-group my-2">
              <label htmlFor="user-lastname">Lastname <span className='required-field'>*</span></label>
              <input
                className="form-control my-1"
                type="text"
                name="lastname"
                id="user-lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Enter your lastname"
                required
              />
            </div>

            {/* Fullname Field (User Enterable) */}
            <div className="form-group my-2">
              <label htmlFor="user-fullname">Fullname </label>
              <input
                className="form-control my-1"
                type="text"
                name="fullname"
                id="user-fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter your fullname"
              />
            </div>

            {/* Email Field */}
            <div className="form-group my-2">
              <label htmlFor="user-email-address">Email Address <span className='required-field'>*</span></label>
              <input
                className="form-control my-1"
                type="email"
                name="email"
                id="user-email-address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="emailHelp"
                placeholder="Enter email"
                required
              />
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>

            {/* Password Field */}
            <div className="form-group my-2">
              <label htmlFor="user-password">Password <span className='required-field'>*</span></label>
              <input
                className="form-control my-1"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="user-password"
                placeholder="Password"
                required
              />
              <small className="form-text text-muted">Minimum 8 characters, including letters and numbers.</small>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group my-2">
              <label htmlFor="user-confirm-password">Confirm Password <span className='required-field'>*</span></label>
              <input
                className="form-control my-1"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="user-confirm-password"
                placeholder="Confirm Password"
                required
              />
            </div>

            {/* Photo Upload Field */}
            <div className="form-group my-2">
              <label htmlFor="user-photo">Upload Photo </label>
              <input
                className="form-control my-1"
                type="file"
                name="photo"
                id="user-photo"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
              <small className="form-text text-muted">Accepted formats: JPG, PNG, GIF. Max size: 5MB.</small>
            </div>

            {/* Submit Button */}
            <div className='d-flex justify-content-center my-2'>
              <button
                type="submit"
                className="btn btn-outline-success px-3 text-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <p className='my-3 text-center text-secondary'>Or</p>

          {/* OAuth Sign-Up Buttons */}
          <div className='container-md-6 container-sm-4 d-flex flex-column align-items-center'>
            <button
              type='button'
              className='btn btn-outline-secondary m-2 p-2 w-100'
              onClick={signUpWithGoogle}
            >
              <div className='d-flex align-items-center justify-content-center'>
                <img src='/images/google_logo.png' className='d-block mx-2' alt='Google Logo' width="20" height="20" />
                <span>Sign Up with Google</span>
              </div>
            </button>
            <button
              type='button'
              className='btn btn-outline-secondary m-2 p-2 w-100'
              onClick={signUpWithFacebook}
            >
              <div className='d-flex align-items-center justify-content-center'>
                <img src='/images/facebook_logo.png' className='d-block mx-2' alt='Facebook Logo' width="20" height="20" />
                <span>Sign Up with Facebook</span>
              </div>
            </button>
          </div>

          <p className='h6 text-center my-5 text-secondary'>
            Already have an account? <a href='/login' className='links'>Click here</a> to log in!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
