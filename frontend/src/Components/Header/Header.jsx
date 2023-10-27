import "./Header.scss";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;

  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    // Відправляємо POST-запит на виход з передачею токену
    axiosInstance
      .post(BACKEND_HOST + "/auth/token/logout/")
      .then((response) => {
        // Видалення токена з куків

        Cookies.remove("auth_token");
        setIsAuthenticated(false);
      })
      .catch((error) => {
        console.error("Помилка при виході:", error);
      });
  };
  return (
    <div className="header_border">
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
                  <Link to="/workplace" className="auth_login">
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
    </div>
  );
};

export default Header;
