import React, { useState } from 'react'
import axios from 'axios'

import Title from '../components/Title'

import '../styles/forgotPassword.css'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const response = await axios.post('http://localhost:5000/user/forgot-password', { email });
            if (response.status === 200) {
                setMessage(response.data.message);
                setError('');
            }
        } catch (err) {
            console.error('Error during password reset request:', err);
            setError(err.response?.data?.message || 'An error occurred.');
            setMessage('');
        }
    }
  return (
    <div className='forgot-password-container d-flex flex-column align-items-center justify-content-center'>
        <Title text='Forgot Your Password?' />
        <form className='form-control d-flex flex-column align-items-center' onSubmit={handleSubmit}>
            <div className="form-group my-2">
                <label htmlFor="email">Email Address</label>
                <input
                    className="form-control my-1"
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
            </div>
            <button type="submit" className="btn btn-outline-success px-3 text-center">Send Reset Link</button>
        </form>
        {message && <p className='text-success my-2'>{message}</p>}
        {error && <p className='text-danger my-2'>{error}</p>}
    </div>
  )
}

export default ForgotPassword