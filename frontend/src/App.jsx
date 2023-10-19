import Header from "./Components/Header/Header";
import Title from "./Components/Title/Title";
import Footer from "./Components/Footer/Footer";

import Login from "./Components/Auth/Login";
import Sign from "./Components/Auth/Sign";

import Workplace from "./Components/Workplace/Workplace";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import Profile from "./Components/Profile/Profile";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Title />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Sign />} />
        <Route path="/workplace" element={<Workplace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
