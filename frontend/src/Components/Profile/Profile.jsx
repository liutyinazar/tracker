import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.scss";

const Profile = () => {
  const TOKEN = localStorage.getItem("auth_token");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Выполнить GET-запрос при монтировании компонента
    axios
      .get("http://127.0.0.1:8000/auth/users/me/", {
        headers: {
          Authorization: `Token ${TOKEN}`,
        },
      })
      .then((response) => {
        // Сохранить полученные данные в состоянии

        // Здійснюємо запит для userData після успішного отримання userId
        axios
          .get(`http://127.0.0.1:8000/api/v1/users/${response.data.id}`)
          .then((userDataResponse) => {
            // Сохранить полученные данные userData в стані
            setUserData(userDataResponse.data);
          });
      })
      .catch((error) => {
        console.error("Помилка при отриманні даних користувача:", error);
        localStorage.removeItem("auth_token");
        window.location.reload();
      });
  }, [TOKEN]);

  return (
    <div className="container">
      <div className="profile">
        <div className="profile-title">
          <h1>Profile</h1>
        </div>
      </div>
      <div className="profile_data">
        {userData ? (
          <div>
            <p>Username: {userData.username}</p>
            <p>
              {userData.first_name} {userData.last_name}
            </p>
            <p>Teams:</p>
            <ul>
              {userData.teams.map((team) => (
                <li key={team.id}>
                  {team.name}
                  <img src={team.image} alt="team" />
                </li>
              ))}
            </ul>
            <p></p>
            <img src={userData.photo} alt="user" />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
