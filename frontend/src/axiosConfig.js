import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create();

// Додавання інтерцептора для автоматичного додавання заголовків авторизації до всіх запитів
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default axiosInstance;