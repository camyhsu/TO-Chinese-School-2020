import axios from "axios";

export default (config) => ({
  config: config || {
    apiUrl: "http://localhost:3001/",
    username: "admin",
    password: "123456",
  },
  getAccessToken() {
    return this.config.accessToken;
  },
  getHeaders() {
    return { headers: { "x-access-token": this.getAccessToken() } };
  },
  async signUp(obj) {
    return axios.post(`${this.config.apiUrl}signup`, obj);
  },
  get(path) {
    return axios
      .get(`${this.config.apiUrl}${path}`, this.getHeaders())
      .then((r) => r.data);
  },
  put(path, obj) {
    return axios.put(`${this.config.apiUrl}${path}`, obj, this.getHeaders());
  },
  async signIn(username, password) {
    return axios
      .post(`${this.config.apiUrl}signin`, {
        username: username || this.config.username,
        password: password || this.config.password,
      })
      .then((r) => {
        Object.assign(this.config, { accessToken: r.data.accessToken });
        return r.data;
      });
  },
  async changePassword({
    currentPassword,
    newPassword,
    newPasswordConfirmation,
  }) {
    return this.put("api/change-password", {
      currentPassword,
      newPassword,
      newPasswordConfirmation,
    });
  },
  async getStudentBoard() {
    return this.get("api/board/student-parent");
  },
  async getInstructorBoard() {
    return this.get("api/board/instructor");
  },
  async showStudentList() {
    return this.get("api/instruction/school_classes/show");
  },
});
