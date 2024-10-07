import React, { useState } from 'react'
import axios from 'axios'

import '../styles/changePassword.css'
import Title from '../components/Title'

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            setMessage('');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/user/update-password',
                { currentPassword, newPassword },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setMessage(response.data.message);
                setError('');
                // Optionally, reset the form fields
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            console.error('Error during password update:', err);
            setError(err.response?.data?.message || 'An error occurred.');
            setMessage('');
        }
    }

  return (
    <div className='change-password-container d-flex flex-column align-items-center justify-content-center'>
            <Title text='Change Password' />
            <form className='form-control d-flex flex-column align-items-center' onSubmit={handleSubmit}>
                <div className="form-group my-2">
                    <label htmlFor="current-password">Current Password</label>
                    <input
                        className="form-control my-1"
                        type="password"
                        name="currentPassword"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                    />
                </div>
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
                    <label htmlFor="confirm-new-password">Confirm New Password</label>
                    <input
                        className="form-control my-1"
                        type="password"
                        name="confirmNewPassword"
                        id="confirm-new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-outline-success px-3 text-center">Update Password</button>
            </form>
            {message && <p className='text-success my-2'>{message}</p>}
            {error && <p className='text-danger my-2'>{error}</p>}
        </div>
  )
}

export default ChangePassword