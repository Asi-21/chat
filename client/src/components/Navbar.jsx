
import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'


const Navbar = () => {
  const {user,logout} = useContext(AuthContext);
 
  return (
    <div className='navbar'>
        <span className='logo'>Chat</span>
            <div className="user">
                {/* <img  alt="" /> */}
                <span>{user.name}</span>
                <button onClick={logout}>logout</button>
            </div>
        
    </div>
  )
}

export default Navbar