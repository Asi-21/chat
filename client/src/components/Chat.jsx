import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { AuthContext } from '../context/AuthContext'





const Chat = () => {
  const {receiver} = useContext(AuthContext);


  return (
    <div className='chat'>
      <div className="chatInfo">
        <span> {receiver ? receiver.name : ""}</span>
        <div className="chatIcons">

        </div>
      </div>
      <Messages />
      {receiver !== null ?
      <Input />
      : null
}
    </div>
  )
}

export default Chat