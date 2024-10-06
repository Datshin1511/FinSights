import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Title from '../components/Title';

const History = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/auth-status', { withCredentials: true });
        if (!response.data.isAuthenticated) {
          navigate('/login');
        }
      } catch (error) {
        console.log('Error:', error);
        navigate('/login');
      }
    };

    checkAuthStatus();
  }, [navigate]);

  return (
    <Title text='History page, Nigga'/>
  );
};

export default History;
