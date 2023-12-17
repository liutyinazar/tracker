import "./Header.scss";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";
import Modal from "../Modals/Modal";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const notifications_image =
  require("../../assets/icon/notifications.svg").default;
const logo = require("../../assets/icon/logo1.svg").default;

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTheme, setIsTheme] = useState(false);
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; created_at: string; is_read: boolean }[]
  >([]);
  const [userId, setUserId] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [userImage, setUserImage] = useState<string | never[]>([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const token = Cookies.get("auth_token");
    const theme = Cookies.get("theme");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // if (theme) {
    //   setIsTheme(true);
    // } else {
    //   setIsTheme(false);
    // }

    const fetchUserData = async () => {
      try {
        const userResponse = await axiosInstance.get(
          `${BACKEND_HOST}/auth/users/me/`
        );
        const user = userResponse.data;
        const userImage = await axiosInstance.get(
          BACKEND_HOST + `/api/v1/users/${user.id}/photo/`
        );
        setUserImage(userImage.data.photo);
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
          (notification: any) => !notification.read
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

  const changeTheme = () => {
    setIsTheme((prevTheme) => {
      const newTheme = !prevTheme;
      Cookies.set("theme", newTheme.toString());
      return newTheme;
    });
  };
  
  const handleNotificationClick = async (notificationId: number) => {
    try {
      // Відправляємо запит на сервер для оновлення статусу конкретного сповіщення
      await axiosInstance.patch(
        `${BACKEND_HOST}/api/v1/users/${userId}/notifications/${notificationId}/update/`,
        { is_read: true }
      );

      // Оновлюємо стан компонента, щоб позначити конкретне сповіщення як прочитане
      setUnreadNotificationsCount((prevCount) => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error(
        "Помилка при відзначенні сповіщення як прочитаного:",
        error
      );
    }
  };

  return (
    <div className="header_border">
      <div className="container">
        <header className="header">
          <div className="logo">
            <Link to="/" className="auth_login">
              <a href="/">
                <img src={logo} alt="logo" />
                <h1>SyncFlow</h1>
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
            <div className="theme">
              {isTheme ? (
                <h1 onClick={() => changeTheme()}>change to black</h1>
              ) : (
                <h1 onClick={() => changeTheme()}>change to light</h1>
              )}
            </div>
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
                          <li
                            key={index}
                            onClick={() =>
                              handleNotificationClick(notification.id)
                            }
                            className={`notification-item ${
                              notification.is_read ? "read" : ""
                            }`}
                          >
                            <p>{notification.message}</p>
                            <p>{notification.created_at}</p>
                          </li>
                        ))}
                    </ul>
                  </Modal>
                </div>
                <Link to="/profile" className="auth_login">
                  {/* Profile */}
                  <img
                    src={Array.isArray(userImage) ? "" : userImage}
                    alt="user"
                    className="header-profile"
                  />
                </Link>
                <Link to="/" className="auth_login2" onClick={handleLogout}>
                  Logout
                </Link>
              </>
            ) : (
              <Link to="/login" className="auth_login2">
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
