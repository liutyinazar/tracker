import "./Workplace.scss";
import axiosInstance from "../../axiosConfig";
import { useState, useEffect } from "react";

const Workplace = () => {
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  // const [selectedChanel, setChanel] = useState<number | null>(null);

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

    try {
      const channelResponse = await axiosInstance.get(
        `${BACKEND_HOST}/api/v1/teams/${teamId}/chanel/`
      );
      const channels = channelResponse.data[0].chanels;
      setChannels(channels);
    } catch (error) {
      console.error("Помилка отримання даних:", error);
    }
  };



  return (
    <div className="workplace">
      <div className="workplace-wrapper">
        <div className="teams_wrapper">
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
                  <h2 className="channel-name">{channel.title}</h2>
                </li>
              ))
            ) : (
              <li className="no-teams-message">
                Оберіть команду для доступу до каналів
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Workplace;
