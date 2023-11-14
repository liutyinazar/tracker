import "./Auth.scss";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
// import axiosInstance from "../../axiosConfig";

const Sign = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const token = Cookies.get('auth_token')
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;

  if (token) {
    alert("Ви вже ввійшли в свій аккаунт!");
    navigate("/");
    return null; // Завершуємо компонент, не відображаючи решту форми
  }

  // Обробник зміни значень полів вводу
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Обробник відправки форми
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const credentials = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
    };

    axios
      .post(BACKEND_HOST + `/auth/users/`, credentials)
      .then((response) => {
        setError("Ви успішног створили аккаунт");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          const errorMessage =
            error.response.data.email ||
            error.response.data.password ||
            error.response.data.username ||
            "Помилка при реєстрації";
          setError(errorMessage);
        } else {
          console.error("Помилка:", error);
        }
      });
    console.log("Вхідні дані:", formData);

  };
  return (
    <div className="container">
      <div className="auth">
        <h1>Sign Up</h1>
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
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="have-acc">
          <p>If you have account -</p>
          <Link to="/login" className="auth_login">
            <a href="/" className="have-acc-btn">
              Login
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sign;
