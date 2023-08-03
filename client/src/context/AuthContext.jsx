import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Check if there is a user in local storage (user is logged in)
  const storedUser = localStorage.getItem('user');
  const [isLoggedin, setIsLoggedin] = useState(!!storedUser);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [receiver,setReceiver] = useState(null);
  const socket = io("http://localhost:3001");


  // Function to handle login
  const login = (userData) => {
    setIsLoggedin(true);
    setUser(userData);


    // Store user in local storage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to handle logout
  const logout = () => {
    setIsLoggedin(false);
    setUser(null);
    // Remove user from local storage
    localStorage.removeItem('user');
  };

  // Check for user in local storage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedin(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedin, user, receiver, setReceiver, login, logout,socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
