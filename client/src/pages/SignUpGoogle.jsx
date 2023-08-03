import React, { useContext } from "react";
// import "./App.css";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const SignGoogle = () => {
  // const [user, setUser] = useState({});
  const {user,login} = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "1019910510939-r24tc7fng39qjktv8707knpu117cvkok.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    async function handleCallbackResponse(response) {
      console.log("Encoded JTW token:" + response.credential);
      var userObject = jwt_decode(response.credential);
      console.log(userObject);
      // setUser(userObject);
      // login(userObject);
      document.getElementById("signInDiv").hidden = true;
      // addUser();
      const email = userObject.email;
      const name = userObject.name;
      const password = userObject.given_name;
      const auser = { email, name, password };
     

      try {
        const response = await axios.post(
          "http://localhost:3001/users",
          auser,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        login(response.data.user);
        navigate("/");
        

      } catch (error) {
        console.log(error);
      }
    }

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);
  return (
    <>
      <div id="signInDiv"></div>
     
    </>
  );
};

export default SignGoogle;
