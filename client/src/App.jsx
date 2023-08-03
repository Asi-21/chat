import './style.scss'
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { AuthContext } from './context/AuthContext';



function App() {
  const {user} = useContext(AuthContext);
  const ProtecteRout = ({children}) => {
    if(!user){
      return <Navigate to="/login" />
    }
    return children;
  }
  return (
    <Router>
      <Routes>
      <Route path='/' element={<ProtecteRout><Home /></ProtecteRout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />



      </Routes>
    </Router>
  );
}

export default App;
