import { authHeader, accessToken } from "./auth-header";
import axios from "axios";
import config from "../app/config";

const API_URL = `${config.apiUrl}/api/`;
const getRequestConfig = () => {
  return { headers: authHeader() };
};

const get = async (path) => {
  const requestConfig = getRequestConfig();
  if (requestConfig.headers["x-access-token"]) {
    return axios.get(API_URL + path, requestConfig);
  } else {
    return Promise.reject("No access token");
  }
};

const post = async (path, obj) =>
  axios.post(API_URL + path, obj, getRequestConfig());
const put = async (path, obj) =>
  axios.put(API_URL + path, obj, getRequestConfig());
const _delete = async (path) =>
  axios.delete(API_URL + path, getRequestConfig());
const csv = (path) =>
  `${API_URL}${path}${
    path.includes("?") ? "&" : "?"
  }accesstoken=${accessToken()}`;

const exportObj = {
  get,
  post,
  put,
  delete: _delete,
  csv,
};

export default exportObj;
