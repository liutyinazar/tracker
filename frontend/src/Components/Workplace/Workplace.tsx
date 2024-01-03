import axios from "axios";
import "./Workplace.scss";
import axiosInstance from "../../axiosConfig";
import { useState, useEffect } from "react";
import Modal from "./Team/Modal";
// import plus from '../../assets/icon/plus.svg';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

const Workplace = () => {
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamImage, setTeamImage] = useState<File | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
        console.error("Error getting user data:", error);
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
      console.error("Error getting data:", error);
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
      console.error("Error getting data:", error);
    }
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  const handleTeamImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setTeamImage(file || null);
  };

  const addTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userResponse = await axiosInstance.get(
        `${BACKEND_HOST}/auth/users/me/`
      );
      const user = userResponse.data;

      const formData = new FormData();
      formData.append("name", teamName);
      formData.append("users", user.id);
      if (teamImage !== null) {
        formData.append("image", teamImage);
      }

      const response = await axios.post(
        `${BACKEND_HOST}/api/v1/teams/add/`,
        formData
      );

      console.log("Відповідь від сервера:", response.data);
      console.log(response);

      if (response.status === 200 || response.status === 201) {
        console.log("Team successfully added");
        closeModal(); // Закриття модального вікна після додавання команди
        window.location.reload();
      } else {
        console.error("Error adding command");
        // Додатковий код для обробки помилки, якщо потрібно
      }
    } catch (error) {
      console.error("Error sending request:", error);
      // Додатковий код для обробки помилки, якщо потрібно
    }
  };

  const openModals = () => {
    openModal();
  };

  return (
    <div className="workplace">
      <div className="teams_wrapper">
        <div className="add_team_wrapper">
          <h1 onClick={openModals}>+</h1>
          <div className={`add_team ${isModalOpen ? "open_modal" : ""}`}>
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
              <form
                onSubmit={addTeam}
                className="add_team_form"
                encType="multipart/form-data"
              >
                <label>
                  Name:
                  <input
                    type="text"
                    value={teamName}
                    onChange={handleTeamNameChange}
                    placeholder="Enter team name"
                  />
                </label>
                <label>
                  Image:
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleTeamImageChange}
                  />
                </label>
                <button type="submit">Create</button>
              </form>
            </Modal>
          </div>
        </div>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          <ul>
            {teams.length > 0 ? (
              teams.map((team) => (
                <SwiperSlide
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
                </SwiperSlide>
              ))
            ) : (
              <li className="no-teams-message">
                Нажаль, ви ще не долучились до жодної команди
              </li>
            )}
          </ul>
        </Swiper>
      </div>
      <div className="workplace-wrapper">
        <div className="channel_wrapper">
          <div className="add_channel_wrapper">
            <h1>+</h1>
          </div>
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
