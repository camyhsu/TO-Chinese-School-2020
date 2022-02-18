import axios from "axios";
import config from "../app/config";

const API_URL = config.apiUrl;

export const register = (obj) => axios.post(API_URL + "/signup", obj);

export const login = (username, password) =>
  axios
    .post(API_URL + "/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        sessionStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });

export const logout = () => sessionStorage.removeItem("user");

const AuthService = { register, login, logout };
export default AuthService;
