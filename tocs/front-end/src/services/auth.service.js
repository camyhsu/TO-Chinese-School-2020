import axios from "axios";
import config from "./config";

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

export const signIn = (credential) =>
  axios.post(`${API_URL}/signin`, credential);

const AuthService = { register, login, logout };
export default AuthService;
