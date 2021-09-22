import axios from 'axios';
import config from './config';

const API_URL = config.apiUrl;

const register = (obj) => axios.post(API_URL + 'signup', obj);

const login = (username, password) => axios
    .post(API_URL + '/signin', {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    });

const logout = () => localStorage.removeItem('user');

const obj = {
  register,
  login,
  logout,
};

export default obj;