import React, { useContext, useEffect, useRef , useState } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";



const Message = ({message}) => {
// const [messagesReceived,setMessagesReceived] = useState([]);
const {user} = useContext(AuthContext);
// const ref = useRef();


  

  
  return (
    <div


      className={`message ${message.sender.name === user.name ? "owner" : ""} `}
    >
      <div className="messageInfo">
        
      <span>{message.sender.name === user.name ? "me" : message.sender.name }</span>
      </div>
      <div className="messageContent">
        <p>{message.messageText}</p>


      </div>
      

    </div>
  );
};

export default Message;