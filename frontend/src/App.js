import { Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import Headers from './components/Headers'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Error from './components/Error'
import Register from './components/Register'

import './styles/App.css';

function App() {
  return (
    <div>
      <Headers />
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<Error />} />
      </Routes>
      </div>
  );
}

export default App;

