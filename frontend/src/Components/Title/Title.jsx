import "./Title.scss";
import { Link } from "react-router-dom";
import screens from "../../assets/image/screens.png";

const Title = () => {
  return (
    <>
      <div className="container">
        <div className="title">
          <div className="title-text">
            <h1>Work at the speed of thought</h1>
            <p>
              Most calendars are designed for teams. Slate is designed for
              freelancers who want a simple way to plan their schedule.
            </p>
          </div>
          <div className="title-buttons">
            <Link to="/workplace">
              <button className="try-free">Try For Free</button>
            </Link>
            <button className="learn-more">Learn More</button>
          </div>
        </div>
      </div>
      <div className="screens">
        <img src={screens} alt="screens" />
        <span></span>
      </div>
    </>
  );
};

export default Title;
