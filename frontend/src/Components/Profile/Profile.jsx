import "./Profile.scss";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import loading from "../../assets/gif/loading.gif";
import axiosInstance from "../../axiosConfig";

const Profile = () => {
  const TOKEN = Cookies.get("auth_token");
  const [userData, setUserData] = useState(null);
  const [editProfile, setEditProfile] = useState(true);
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;
  const [teams, setTeams] = useState([]);

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    axiosInstance
      .get(`${BACKEND_HOST}/auth/users/me/`)
      .then((response) => {
        // Сохранить полученные данные в состоянии
        console.log(response.data.id);

        // Здійснюємо запит для userData після успішного отримання userId
        axiosInstance
          .get(`${BACKEND_HOST}/api/v1/users/${response.data.id}/`)
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
  }, [TOKEN, BACKEND_HOST]);

  const changeEditProfile = () => {
    setEditProfile(false);
  };

  const back = () => {
    setEditProfile(true);
  };

  const changeUserPhoto = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.onchange = (e) => {
      const file = e.target.files[0];

      if (file) {
        const formData = new FormData();
        formData.append("photo", file);

        axiosInstance
          .put(`${BACKEND_HOST}/api/v1/update_photo/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            // Обновить отображение фотографии пользователя или выполнить другие действия при успешном обновлении
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error change userPhoto:", error);
          });
      }
    };

    inputElement.click();
  };

  const editProfileSend = () => {
    const requestData = {
      ...(formData.email && { email: formData.email }),
      ...(formData.first_name && { first_name: formData.first_name }),
      ...(formData.last_name && { last_name: formData.last_name }),
    };

    if (Object.keys(requestData).length > 0) {
      axiosInstance
        .patch(`${process.env.URL}/api/v1/users/${userData.id}`, requestData)
        .then((response) => {
          setEditProfile(true);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Ошибка при обновлении данных:", error);
        });
    }

    // Перевірте, чи є дані для відправлення
    if (Object.keys(requestData).length === 0) {
      // Якщо немає даних для відправлення, не робіть запит на сервер
      return;
    }
    axiosInstance
      .patch(BACKEND_HOST + `/api/v1/users/${userData.id}`, formData)
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
                    <div
                      className="profile_image_wrapper"
                      onClick={changeUserPhoto}
                    >
                      <img src={userData.photo} alt="user" />
                      <h5>Change Photo</h5>
                    </div>
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
                  <div className="profile_team">
                    <h1>Your Teams</h1>
                    {teams.length > 0 ? (
                      <ul>
                        {teams.map((team) => (
                          <li key={team.id}>
                            <img src={team.image} alt="" />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>You are not a member of any teams.</p>
                    )}
                  </div>
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
          <div className="form-group">
            <label>Email address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>First name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="edit_btn">
            <button type="submit" onSubmit={editProfileSend}>
              Save changes
            </button>
            <h1>or</h1>
            <p type="onClick" onClick={back}>
              Go back
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
