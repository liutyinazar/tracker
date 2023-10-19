import "./Header.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      // Відправляємо POST-запит на виход з передачею токену
      axios
        .post("http://127.0.0.1:8000/logout/", { token })
        .then((response) => {
          // Видалення токена з куків
          localStorage.removeItem("auth_token");
          setIsAuthenticated(false);
        })
        .catch((error) => {
          console.error("Помилка при виході:", error);
        });
    }
  };
  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <Link to="/" className="auth_login">
            <a href="/">
              <img src={logo} alt="logo" />
            </a>
          </Link>
        </div>
        <div className="menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/" className="auth_login">
                <a href="/" className="menu-link">
                  Home
                </a>
              </Link>
            </li>
            {isAuthenticated ? (
              <li className="menu-item">
                <Link to="/workplace" className="auth_login">
                  <a href="/" className="menu-link">
                    Workplace
                  </a>
                </Link>
              </li>
            ) : (
              <li className="menu-item">
                <Link to="/login" className="auth_login">
                  <a href="/" className="menu-link">
                    Workplace
                  </a>
                </Link>
              </li>
            )}
            <li className="menu-item">
              <Link to="/about" className="auth_login">
                <a href="/" className="menu-link">
                  About
                </a>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/contact" className="menu-link">
                <a href="/" className="menu-link">
                  Contact
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="auth_btn">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="auth_login">
                Profile
              </Link>
              <Link to="/" className="auth_login" onClick={handleLogout}>
                Logout
              </Link>
            </>
          ) : (
            <Link to="/login" className="auth_login">
              Login
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
