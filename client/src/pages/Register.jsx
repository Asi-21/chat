import React, { useContext, useState } from "react";
import Add from "../img/addAvatar.png";

import axios from "axios"; // Import Axios library



import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = ({closeModal}) => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {login} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    try {
      const response = await axios.post('http://localhost:3001/users', {email,name,password});
      console.log(response.data);
      login(response.data.user); 
      closeModal();
      navigate("/");
      // Handle successful sign-up, show a success message, or redirect the user to another page.
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle sign-up error, show an error message, etc.
    }


  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo"> Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />

          
          <button disabled={loading} type="submit">Sign up</button>


        </form>
        <p>
          You do have an account? <span onClick={closeModal} style={{ color: '#013c6ce8', textDecoration: "underline",cursor: "pointer" }}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;