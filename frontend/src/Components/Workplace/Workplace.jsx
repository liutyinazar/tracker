import "./Workplace.scss";
import axiosInstance from "../../axiosConfig";
import React, { useState, useEffect } from "react";

const Workplace = () => {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axiosInstance.get(`${BACKEND_HOST}/auth/users/me/`);
        const user = userResponse.data;
        const teamsResponse = await axiosInstance.get(`${BACKEND_HOST}/api/v1/users/${user.id}/teams/`);
        setTeams(teamsResponse.data);
      } catch (error) {
        console.error("Помилка отримання даних користувача:", error);
      }
    };
  
    fetchUserData();
  }, [BACKEND_HOST]);
  
  const selectTask = async (teamId) => {
    setSelectedTeam(teamId);
    try {
      const taskResponse = await axiosInstance.get(`${BACKEND_HOST}/api/v1/teams/${teamId}/tasks/`);
      const tasks = taskResponse.data;
      setTasks(tasks);
    } catch (error) {
      console.error("Помилка отримання даних:", error);
    }
  }

  return (
    <div className="container">
      <div className="workplace">
        <div className="workplace-title">
          <h1>Your Workplace</h1>
        </div>
        <div className="workplace-wrapper">
          <div className="teams_wrapper">
            <h1>Teams</h1>
            <ul>
              {teams.map((team) => (
                <li
                  key={team.id}
                  className={`team ${
                    team.id === selectedTeam ? "selected" : ""
                  }`}
                >
                  {team.image && (
                    <img
                      src={team.image}
                      alt={team.name}
                      onClick={() => selectTask(team.id)}
                    />
                  )}
                  <h2 className="team-name">{team.name}</h2>
                </li>
              ))}
            </ul>
          </div>
          <div className="task_wrapper">
            <h1>Tasks</h1>
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="task">
                  <h2 className="task-name">{task.title}</h2>
                  <p>{task.description}</p>
                  <h2>
                    from {task.date_start}
                    to {task.date_finish}
                  </h2>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workplace;
