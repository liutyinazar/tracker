import "./Auth.scss";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sign = () => {
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

  // Обробник відправки форми
  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = {
      username: formData.username,
      password: formData.password,
    };

    axios
      .post("http://127.0.0.1:8000/sign-in/", credentials)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Помилка:", error);
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
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button type="submit">Sign Up</button>
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

export default Sign;
