import React, { useContext, useEffect, useRef , useState } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import axios from "axios";

import Message from './Message'



const Messages = () => {

  const [messagesReceived,setMessagesReceived] = useState([]);
  const {user,socket,receiver,setReceiver} = useContext(AuthContext);
  const [prev,setPrev] = useState(null);
  const [room, setRoom] = useState("");
  // const socket = io("http://localhost:3001");
  // socket.emit("join_room","user1");
  const fetchChat = async () => {
    {
      if (!room) {
        // alert("Please enter a room.");
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:3001/chat?room=${encodeURIComponent(room)}`);
        const data = response.data;
        console.log(data.chat.Messages);
  
        if (data.success) {
          setMessagesReceived(data.chat.Messages);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
        // alert("An error occurred while fetching chat.");
      };
  }
}
  useEffect(() => {
   
    const n1 = user.id;

    const n2 = receiver ? receiver.id : 0;
    let temp = "";
    if (n1 > n2) {
      temp = n1 + " " + n2;
      setRoom(temp);
    } else {
      temp = n2 + " " + n1;
      setRoom(temp);
    }
    // console.log(temp);


   
    
    fetchChat();
   
    socket.on("receive_message", (data) => {
      // socket.emit("join_room",user.name);
      // Update the messagesReceived state with the new message
      
      // console.log(data);
      // if(data.sender.name !== receiver.name){
      //   setReceiver(data.sender);
      //   // setMessagesReceived([]);
      // }
      fetchChat();
      
      setMessagesReceived((prevMessages) => [...prevMessages, data]);

    });
  // console.log(messagesReceived);
 
  
  
    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, [socket, user.id, receiver, room]);
  

  return (
   
    <div className='messages'>
      {messagesReceived.map((message, index) => (
        <Message key={index} message = {message} />

        ))
      }
    </div>
 
  )
}

export default Messages
