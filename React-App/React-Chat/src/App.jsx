import React from "react";
import axios from "axios";
import { useState } from "react";
import ChatApp from "./components/chatApp/ChatApp";
import LoginForm from "./components/loginForm/LoginForm";
import "./App.css";
const App = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userdata, setUserdata] = useState();
  const handleLogin = (credentials) => {
    // console.log("Logging in with", credentials);
    axios
      .post("http://localhost:8000/users/login", {
        login: credentials.username,
        password: credentials.password,
      })
      .then(function (response) {
        setUserdata(response.data);
        // console.log(response.data.token, "Login!!!!!!!!!!!!!!!");
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
  };

  const handleRegister = (credentials) => {
    axios
      .post("http://localhost:8000/users/register", {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      })
      .then(function (response) {
        console.log(response.data.token, "Register!!!!!!!!!!!!!!!");
        setIsRegistered(true);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
    console.log("Registering with", credentials);
  };

  return (
    <div className="App">
      {!userdata ? (
        <LoginForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          Registered={isRegistered}
        />
      ) : (
        <ChatApp userdata={userdata} setUserdata={setUserdata} />
      )}
    </div>
  );
};

export default App;
