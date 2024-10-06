import {BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Header from './pages/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Error from './pages/Error'
import Register from './pages/Register'
import About from './pages/About'
import Footer from './pages/Footer'
import History from './pages/History'

import './styles/App.css';

function App() {
  return (
    <Router>
      <Header/>

      <section className='main-content'>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/register' element={<Register />} />
            <Route path='/history' element={<History />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<Error />} />
        </Routes>
      </section>

      <Footer /> 
    </Router>
  );
}

export default App;

