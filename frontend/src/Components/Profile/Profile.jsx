import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.scss";
import loading from "../../assets/gif/loading.gif";

const Profile = () => {
  const TOKEN = localStorage.getItem("auth_token");
  const [userData, setUserData] = useState(null);
  const [editProfile, setEditProfile] = useState(true);
  // const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Створюємо новий об'єкт formData зі зміненим полем
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editProfileSend();
  };

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
        // localStorage.removeItem("auth_token");
        // window.location.reload();
      });
  }, [TOKEN]);

  const changeEditProfile = () => {
    setEditProfile(false);
  };

  const back = () => {
    setEditProfile(true);
  };

  const editProfileSend = () => {
    const requestData = {};

    // Перевірте, які поля були введені користувачем
    if (formData.email) {
      requestData.email = formData.email;
    }

    if (formData.first_name) {
      requestData.first_name = formData.first_name;
    }

    if (formData.last_name) {
      requestData.last_name = formData.last_name;
    }

    // Перевірте, чи є дані для відправлення
    if (Object.keys(requestData).length === 0) {
      // Якщо немає даних для відправлення, не робіть запит на сервер
      return;
    }
    axios
      .patch(`http://127.0.0.1:8000/api/v1/users/${userData.id}`, formData)
      .then((response) => {
        setEditProfile(true);
      })
      .catch((error) => {
        // Обработка ошибок
        console.error("Ошибка при обновлении данных:", error);
      });
  };

  return (
    <div className="container">
      {editProfile ? (
        <>
          <div className="profile"></div>
          <div className="profile_wrapper">
            {userData ? (
              <>
                <div className="profile_data">
                  <div className="profile_image">
                    <img src={userData.photo} alt="user" />
                    <div className="profile_text">
                      <h1>
                        {userData.first_name} {userData.last_name}
                      </h1>
                      <h1>
                        <p>{userData.username}</p>
                      </h1>
                    </div>
                    <div className="edit_profile">
                      <button className="edit_btn" onClick={changeEditProfile}>
                        Edit profile
                      </button>
                    </div>
                  </div>
                  {/* <div className="profile_teams">
                <p>Teams:</p>
                <ul>
                  {userData.teams.map((team) => (
                    <li key={team.id}>
                      {team.name}
                      <img src={team.image} alt="team" />
                    </li>
                  ))}
                </ul>
              </div> */}
                </div>
              </>
            ) : (
              <>
                <div className="loading">
                  <img src={loading} alt="loading" />
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="edit_profile_form">
          <div>
            <label>Email address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>First name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Last name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <button type="submit" onSubmit={editProfileSend}>
            Save changes
          </button>
          <p type="onClick" onClick={back}>
            Nothing edit
          </p>
        </form>
      )}
    </div>
  );
};

export default Profile;
