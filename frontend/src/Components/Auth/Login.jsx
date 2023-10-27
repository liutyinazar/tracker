import "./Auth.scss";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

const Login = () => {
  const navigate = useNavigate();
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;
  const [error, setError] = useState("");

  // Формуємо данні в state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const credentials = {
        username: formData.username,
        password: formData.password,
      };

      const response = await axiosInstance.post(
        `${BACKEND_HOST}/auth/token/login/`,
        credentials
      );
      const token = response.data.auth_token;
      Cookies.set("auth_token", token);
      navigate("/profile");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Неправильне ім'я користувача або пароль");
      } else {
        console.error("Помилка:", error);
        setError("Помилка сервера");
      }
    }
  };

  // Обробник зміни значень полів вводу
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
        {error && <p className="error">{error}</p>}
        <div className="have-acc">
          <p>Don't have an account? -</p>
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
