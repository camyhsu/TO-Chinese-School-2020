import { authHeader, accessToken } from "./auth-header";
import axios from "axios";
import config from "./config";

const API_URL = `${config.apiUrl}/api/`;
const headers = { headers: authHeader() };

const get = async (path) =>
  headers.headers["x-access-token"]
    ? axios.get(API_URL + path, headers)
    : Promise.reject("No access token");
const post = async (path, obj) => axios.post(API_URL + path, obj, headers);
const put = async (path, obj) => axios.put(API_URL + path, obj, headers);
const _delete = async (path) => axios.delete(API_URL + path, headers);
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
