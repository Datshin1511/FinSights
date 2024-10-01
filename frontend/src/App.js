import { Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Error from './components/Error'
import Register from './components/Register'
import About from './components/About'
import Footer from './components/Footer'

import './styles/App.css';

function App() {
  return (
    <>
      <Header className='header-content'/>

      <section className='main-content'>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/register' element={<Register />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<Error />} />
        </Routes>
      </section>
          
      <Footer className='footer-content' />  
    </>
  );
}

export default App;

