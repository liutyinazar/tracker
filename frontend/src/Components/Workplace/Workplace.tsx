import "./Workplace.scss";
import axiosInstance from "../../axiosConfig";
import { useState, useEffect } from "react";

const Workplace = () => {
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);

  const [teams, setTeams] = useState<
    Array<{
      id: number;
      name: string;
      image?: string;
    }>
  >([]);

  const [channels, setChannels] = useState<
    Array<{
      id: number;
      title: string;
    }>
  >([]);

  const [tasks, setTasks] = useState<
    Array<{
      id: number;
      title: string;
      description: string;
      date_finish: string;
      date_created: string;
    }>
  >([]);

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

  const selectTeam = async (teamId: number) => {
    setSelectedTeam(teamId);
    setTasks([]);

    try {
      const channelResponse = await axiosInstance.get(
        `${BACKEND_HOST}/api/v1/teams/${teamId}/channel/`
      );
      const channels = channelResponse.data[0].channels;
      // console.log(`Channels: ${channels}`);

      setChannels(channels);
    } catch (error) {
      console.error("Помилка отримання даних:", error);
    }
  };

  const selectChannel = async (channelId: number) => {
    setSelectedChannel(channelId);

    try {
      const taskResponse = await axiosInstance.get(
        `${BACKEND_HOST}/api/v1/teams/${selectedTeam}/channel/${channelId}/`
      );
      const tasks = taskResponse.data;
      setTasks(tasks);
    } catch (error) {
      console.error("Помилка отримання даних:", error);
    }
  };

  const test = () => {
    console.log('add team test');
    
  }

  return (
    <div className="workplace">
      <div className="workplace-wrapper">
        <div className="teams_wrapper">
          <div className="add_team">
            <h1 onClick={test}>+</h1>
          </div>
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
                      onClick={() => selectTeam(team.id)}
                    />
                  )}
                </li>
              ))
            ) : (
              <li className="no-teams-message">
                Нажаль, ви ще не долучились до жодної команди
              </li>
            )}
          </ul>
        </div>
        <div className="channel_wrapper">
          <ul>
            {channels.length > 0 ? (
              channels.map((channel) => (
                <li key={channel.id} className="channel">
                  <h2
                    className="channel-name"
                    onClick={() => selectChannel(channel.id)}
                  >
                    {channel.title}
                  </h2>
                </li>
              ))
            ) : (
              <li className="no-teams-message">
                Оберіть команду для доступу до каналів
              </li>
            )}
          </ul>
        </div>
        <div className="task_wrapper">
          <ul>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id} className="task">
                  <h2 className="task-title">{task.title}</h2>
                  <h2 className="task-description">{task.description}</h2>
                  <h2 className="task-date_created">{task.date_created}</h2>
                  <h2 className="task-date_finish">{task.date_finish}</h2>
                </li>
              ))
            ) : (
              <li className="no-teams-message">
                Оберіть канал для доступу до завдань
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Workplace;
