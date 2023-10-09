import logo from "../../assets/image/logo.png";
import { Link } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <a href="/">
            <img src={logo} alt="logo" />
          </a>
        </div>
        <div className="menu">
          <ul className="menu-list">
            <li className="menu-item">
              <a href="/" className="menu-link">
                Home
              </a>
            </li>
            <li className="menu-item">
              <Link to="/workplace" className="auth_login">
                <a href="/" className="menu-link">
                  Workplace
                </a>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/about" className="auth_login">
                <a href="/" className="menu-link">
                  About
                </a>
              </Link>
            </li>
            <li className="menu-item">
              <a href="/" className="menu-link">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="auth_btn">
          <Link to="/login" className="auth_login">
            Login
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
