import axios from "axios";

const API_URL = "http://localhost:3001/api/auth/";

const register = (obj) => {
  return axios.post(API_URL + "signup", obj);
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const obj = {
  register,
  login,
  logout,
};

export default obj;