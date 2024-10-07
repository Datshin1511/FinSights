// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user/auth-status', { withCredentials: true });
                if (response.data.isAuthenticated && response.data.twoFA) {
                    setAuth(true);
                } else if (response.data.isAuthenticated && !response.data.twoFA) {
                    // Redirect to 2FA page if authenticated but 2FA not completed
                    window.location.href = '/2fa';
                } else {
                    setAuth(false);
                }
            } catch (error) {
                setAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (auth === null) return <div>Loading...</div>;
    return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
