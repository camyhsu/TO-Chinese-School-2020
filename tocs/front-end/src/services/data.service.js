import { authHeader, accessToken } from './auth-header';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/';
const headers = { headers: authHeader() };

const get = async (path) => axios.get(API_URL + path, headers);
const post = async (path, obj) => axios.post(API_URL + path, obj, headers);
const put = async (path, obj) => axios.put(API_URL + path, obj, headers);
const _delete = async (path) => axios.delete(API_URL + path, headers);
const csv = (path) => `${API_URL}${path}${path.includes('?') ? '&' : '?'}accesstoken=${accessToken()}`;

const exportObj = {
    get, post, put, delete: _delete, csv
};

export default exportObj;