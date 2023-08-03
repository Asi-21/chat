
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { current } from "@reduxjs/toolkit";



const Chats = () => {
  const [users, setUsers] = useState([]);
  const {user,setReceiver,socket} = useContext(AuthContext);
  

  useEffect(() => {
    // Function to fetch users from the backend API
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users");
        const data = response.data;

        if (data.success) {
          setUsers(data.users);
        } else {
          console.error("Error getting users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Call the function to fetch users
    fetchUsers();
  }, []);
 
  useEffect(() =>{
    users.forEach((currentUser) => {
      const n1 = user.id;

      const n2 = currentUser ? currentUser.id : 0;
      let temp = "";
      if (n1 > n2) {
        temp = n1 + " "+ n2;
      } else {
        temp = n2 + " " +n1;
      }
      socket.emit("join_room", temp);
    });
    
  })

  

 const handleClick = (currentUser) =>{
  setReceiver(currentUser);
 }

  return (
    <div className="chats">
      {users.map((currentUser) =>
        user.name !== currentUser.name ? (
          <div className="userChat" onClick={() => {handleClick(currentUser)}}>
            {/* <img > */}
            <div className="userChatInfo">
              <span>{currentUser.name}</span>
              <p></p>
            </div>
          </div>
        ) : null
      )}
    </div>

  );
};

export default Chats;