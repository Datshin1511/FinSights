import React, { useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

import Title from '../components/Title'
import '../styles/resetPassword.css'

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setMessage('');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/user/reset-password/${token}`, { newPassword });
            if (response.status === 200) {
                setMessage(response.data.message);
                setError('');
                // Redirect to login after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Error during password reset:', err);
            setError(err.response?.data?.message || 'An error occurred.');
            setMessage('');
        }
    }
  return (
    <div className='reset-password-container d-flex flex-column align-items-center justify-content-center'>
            <Title text='Reset Your Password' />
            <form className='form-control d-flex flex-column align-items-center' onSubmit={handleSubmit}>
                <div className="form-group my-2">
                    <label htmlFor="new-password">New Password</label>
                    <input
                        className="form-control my-1"
                        type="password"
                        name="newPassword"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                    />
                </div>
                <div className="form-group my-2">
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input
                        className="form-control my-1"
                        type="password"
                        name="confirmPassword"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-outline-success px-3 text-center">Reset Password</button>
            </form>
            {message && <p className='text-success my-2'>{message}</p>}
            {error && <p className='text-danger my-2'>{error}</p>}
        </div>
  )
}

export default ResetPassword