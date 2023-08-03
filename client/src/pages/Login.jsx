import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SignGoogle from './SignUpGoogle';
import Register from './Register';
import Modal from "react-modal";
// import './ModalStyle.css'


const Login = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);
  const [err, setError] = useState(false);
  const navigate = useNavigate();
  const { setUser, login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });

      login(response.data.user); // Call the login function to update the authentication state
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle sign-in error, show an error message, etc.
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo"> Chat</span>
        <span className="title">Login </span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button> Sign In</button>
        </form>
        <p>
          You don't have an account?{' '}
          <span to="/register" style={{ color: '#013c6ce8', textDecoration: 'underline', cursor : 'pointer' }} onClick={() => {
          openSignupModal();
        }}>
            Register
          </span>
        </p>
        <Modal
        isOpen={isSignupOpen}
        onRequestClose={closeSignupModal}
        contentLabel="Signup Popup"
        className="custom-modal"
      >
        <Register  closeModal={closeSignupModal} />
      </Modal>
        <div><SignGoogle /></div>
      </div>
    </div>
  );
};

export default Login;
