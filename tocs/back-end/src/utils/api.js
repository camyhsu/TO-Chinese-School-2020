import axios from 'axios';

export default (config) => ({
  config,
  getAccessToken() {
    return this.config.accessToken;
  },
  signUp() {

  },
  async signIn(username, password) {
    return axios.post(`${config.apiUrl}signin`, {
      username: username || config.username,
      password: password || config.password,
    }).then((r) => {
      Object.assign(config, { accessToken: r.data.accessToken });
      return r.data;
    });
  },
});
