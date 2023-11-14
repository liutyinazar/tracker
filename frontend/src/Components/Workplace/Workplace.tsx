import "./Workplace.scss";
import axiosInstance from "../../axiosConfig";
import React, { useState, useEffect } from "react";

const Workplace = () => {
  const [teams, setTeams] = useState<
    Array<{ id: number; name: string; image?: string }>
  >([]);
  const [tasks, setTasks] = useState<
    Array<{
      id: number;
      title: string;
      chanel: string;
      description: string;
      date_start: string;
      date_finish: string;
    }>
  >([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axiosInstance.get(
          `${BACKEND_HOST}/auth/users/me/`
        );
        const user = userResponse.data;
        const teamsResponse = await axiosInstance.get(
          `${BACKEND_HOST}/api/v1/users/${user.id}/teams/`
        );
        setTeams(teamsResponse.data);
      } catch (error) {
        console.error("Помилка отримання даних користувача:", error);
      }
    };

    fetchUserData();
  }, [BACKEND_HOST]);

  const selectTask = async (teamId: number) => {
    setSelectedTeam(teamId);
    try {
      const taskResponse = await axiosInstance.get(
        `${BACKEND_HOST}/api/v1/teams/${teamId}/tasks/`
      );
      const tasks = taskResponse.data;
      setTasks(tasks);
    } catch (error) {
      console.error("Помилка отримання даних:", error);
    }
  };

  return (
    // <div className="container">
    <div className="workplace">
      {/* <div className="workplace-title">
          <h1>Your Workplace</h1>
        </div> */}
      <div className="workplace-wrapper">
        <div className="teams_wrapper">
          {/* <h1>Teams</h1> */}
          <ul>
            {teams.length > 0 ? (
              teams.map((team) => (
                <li
                  key={team.id}
                  className={`team ${
                    team.id === selectedTeam ? "selected" : ""
                  }`}
                >
                  <span></span>
                  {team.image && (
                    <img
                      src={team.image}
                      alt={team.name}
                      onClick={() => selectTask(team.id)}
                    />
                  )}
                  {/* <h2 className="team-name">{team.name}</h2> */}
                </li>
              ))
            ) : (
              <li className="no-teams-message">
                Нажаль, ви ще не долучились до жодної команди
              </li>
            )}
          </ul>
        </div>
        <div className="task_wrapper">
          <h1>Tasks</h1>
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="task">
                <h2 className="task-name">Title {task.title}</h2>
                <p>Description {task.description}</p>
                <p>Chanel {task.chanel}</p>
                <h2>
                  Date from {task.date_start}
                  to {task.date_finish}
                </h2>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Workplace;
