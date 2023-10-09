import "./Footer.scss";
import point from "../../assets/icon/point.svg";
import phone from "../../assets/icon/phone.svg";
import twitter from "../../assets/icon/twitter.svg";
import facebook from "../../assets/icon/facebook.svg";
import linkedin from "../../assets/icon/linkedin.svg";

const Footer = () => {
  return (
    <div className="container">
      <footer className="footer">
        <div className="footer-menu">
          <ul className="footer-list">
            <h1>Fingertipe</h1>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Home
              </a>
            </li>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Examples
              </a>
            </li>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Pricing
              </a>
            </li>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Updates
              </a>
            </li>
          </ul>
          <ul className="footer-list">
            <h1>Resources</h1>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Home
              </a>
            </li>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Examples
              </a>
            </li>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Pricing
              </a>
            </li>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Updates
              </a>
            </li>
          </ul>
          <ul className="footer-list">
            <h1>About</h1>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Home
              </a>
            </li>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Examples
              </a>
            </li>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Pricing
              </a>
            </li>
            <li className="footer-item">
              <a href="/" className="footer-link">
                Updates
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-contact">
          <div className="footer-address">
            <img src={point} alt="point" />
            <p>7480 Mockingbird Hill undefined </p>
          </div>
          <div className="footer-phone">
            <img src={phone} alt="phone" />
            <a href="tel:+380731841610">(239) 555-0108 </a>
          </div>
          <div className="footer-social">
            <a href="/">
              <img src={twitter} alt="twitter" />
            </a>
            <a href="/">
              <img src={facebook} alt="facebook" />
            </a>
            <a href="/">
              <img src={linkedin} alt="linkedin" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
