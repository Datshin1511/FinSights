import {Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Header from './pages/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Error from './pages/Error'
import Register from './pages/Register'
import About from './pages/About'
import Footer from './pages/Footer'
import History from './pages/History'

import TwoFA from './components/TwoFA'
import ProtectedRoute from './components/ProtectedRoute'

import './styles/App.css';
import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'

function App() {
  return (
    <>
      <Header/>

      <section className='main-content'>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/forgot-password/:token' element={<ForgotPassword />} />
            <Route path='/2fa' element={<TwoFA />} />
            <Route path='/change-password' element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
            <Route path='/history' element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<Error />} />
        </Routes>
      </section>

      <Footer /> 
    </>
  );
}

export default App;

