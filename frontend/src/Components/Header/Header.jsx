import "./Header.scss";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";
import notifications_image from "../../assets/icon/notifications.svg";
import Modal from "../Modals/Modal";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await axiosInstance.get(
          `${BACKEND_HOST}/auth/users/me/`
        );
        const user = userResponse.data;
        console.log(user.id);
        setUserId(user.id);
      } catch (error) {
        console.error("Помилка отримання даних користувача:", error);
      }
    };

    const getNotification = async () => {
      try {
        const response = await axiosInstance.get(
          BACKEND_HOST + `/api/v1/users/${userId}/notifications/`
        );
        const userNotifications = response.data;
        setNotifications(userNotifications);

        // Підраховуємо кількість непрочитаних сповіщень
        const unreadCount = userNotifications.filter(
          (notification) => !notification.read
        ).length;
        setUnreadNotificationsCount(unreadCount);
      } catch (error) {
        console.error("Помилка при отриманні повідомлень:", error);
      }
    };
    // Викликаємо функцію для підрахунку непрочитаних сповіщень при завантаженні компонента
    fetchUserData();
    getNotification();
  }, [BACKEND_HOST, userId]);

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
                <div className="notification">
                  <button
                    onClick={() => {
                      openModal();
                    }}
                  >
                    <img
                      className="notifications"
                      src={notifications_image}
                      alt="notifications"
                    />
                    {unreadNotificationsCount > 0 && (
                      <span className="notification-count">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                  <Modal isOpen={isModalOpen} closeModal={closeModal}>
                    <ul>
                      {notifications
                        .slice()
                        .reverse()
                        .map((notification, index) => (
                          <li key={index}>
                            <p>{notification.message}</p>
                            <p>{notification.created_at}</p>
                          </li>
                        ))}
                    </ul>
                  </Modal>
                </div>
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
