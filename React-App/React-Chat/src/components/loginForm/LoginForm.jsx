import React, { useState } from "react";
import "./LoginForm.css";
const LoginForm = ({ onLogin, onRegister, Registered }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Обработка отправки формы
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoginMode) {
      if ((username != "") & (password != "")) onLogin({ username, password });
    } else {
      if ((username != "") & (password != ""))
        onRegister({ username, password, email });
    }
  };

  // Переключение между режимом входа и регистрации
  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <div className="login-form">
      <h2>{isLoginMode ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nickname or mail:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {!isLoginMode && (
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLoginMode ? "Login" : "Register"}</button>
      </form>
      <p>
        {isLoginMode ? (
          <>
            Don't have an account?{" "}
            <button onClick={toggleMode} className="toggle-button">
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={toggleMode} className="toggle-button">
              Login
            </button>
          </>
        )}
      </p>
      {Registered ? <p>successfully</p> : <></>}
    </div>
  );
};

export default LoginForm;
