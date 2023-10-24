import "./Workplace.scss";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Workplace = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Визиваємо функцію для отримання команд після завантаження компонента
    getTeams();
  }, []);

  const getTeams = () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/teams/")
      .then((response) => {
        // Оновлюємо стан "teams" з отриманими даними з сервера
        setTeams(response.data);

        // Виводимо дані у консоль
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Помилка отримання даних:", error);
      });
  };

  return (
    <div className="container">
      <div className="workplace">
        <div className="workplace-title">
          <h1>Your Workplace</h1>
        </div>
        <div className="workplace-wrapper">
          <div className="workplace-type">
            <h1>TEAMS</h1>
            <ul>
              {teams.map((team) => (
                <li key={team.id}>
                  {team.image && <img src={team.image} alt={team.name} />}
                  <h2>{team.name}</h2>
                </li>
              ))}
            </ul>
            <h1>PERSONAL</h1>
            <ul>
              {teams.map((team) => (
                <li key={team.id}>
                  {team.image && <img src={team.image} alt={team.name} />}
                  <h2>{team.name}</h2>
                </li>
              ))}
            </ul>
            <h1>TEAMS</h1>
            <ul>
              {teams.map((team) => (
                <li key={team.id}>
                  {team.image && <img src={team.image} alt={team.name} />}
                  <h2>{team.name}</h2>
                </li>
              ))}
            </ul>
            <h1>PERSONAL</h1>
            <ul>
              {teams.map((team) => (
                <li key={team.id}>
                  {team.image && <img src={team.image} alt={team.name} />}
                  <h2>{team.name}</h2>
                </li>
              ))}
            </ul>
          </div>
          <div className="tasks">
            <h1>TASKS</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workplace;
