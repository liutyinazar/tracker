import "./Auth.scss";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  // Створюємо стейт для збереження введених даних користувача
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Обробник зміни значень полів вводу
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const credentials = {
      username: formData.username,
      password: formData.password,
    };

    axios
      .post("http://127.0.0.1:8000/auth/token/login/", credentials)
      .then((response) => {
        const token = response.data.auth_token;
        localStorage.setItem("auth_token", token);
        navigate("/profile");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Помилка:", error);
      });
  };
  return (
    <div className="container">
      <div className="auth">
        <h1>Login</h1>
        <div className="auth_wrapper">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button type="submit">Login</button>
          </form>
        </div>
        <div className="have-acc">
          <p>If you have account -</p>
          <Link to="/sign-up" className="auth_login">
            <a href="/" className="have-acc-btn">
              Sign Up
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
