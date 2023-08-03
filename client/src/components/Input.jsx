import React, { useContext, useEffect, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";



 

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const {user,receiver,socket} = useContext(AuthContext);
  // const socket = io("http://localhost:3001"); // R
  useEffect(() =>{
    
  },[]);
  const handleSend = async () => {
    const n1 = user.name;
    
    const n2 = receiver ? receiver.name : "";
    let temp = "";
    if(n1.length > n2.length){
      temp = n1 +n2;
    }
    else{
      temp = n2 +n1;
    }
    
    socket.emit("join_room",temp);
    if (text.trim() === "") {
      return;
    }

    // Send the message to the server
    socket.emit("send_message", { receiver: receiver, sender: user,  message:text });


    setText("");
    setImg(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input">
         {receiver !== null ?
      (<input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown} // Attach keydown event listener

        value={text}
      />
     ) : null}
      <div className="send">
        <img src={Attach} alt="" />
     
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        

       
        <button onClick={handleSend}>Send</button>
      
      </div>
     
    </div>
  );
};

export default Input;