/* eslint-disable import/no-extraneous-dependencies */
/* global describe, it */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import axios from 'axios';

chai.use(chaiAsPromised);
const { expect } = chai;
const API_URL = 'http://localhost:3001/';
const username = 'Herbert';
const password = '123456';

describe('Test Get Board', () => {
  describe('studentBoard', () => {
    it('should be able to get Board', async () => {
      let r = await axios.post(`${API_URL}signin`, { username, password });
      console.log(JSON.stringify(r.data, null, 2));
      const token = r.data.accessToken;
      r = await axios.get(`${API_URL}api/board/student-parent`, {
        headers: { 'x-access-token': token },
      });
      console.log(JSON.stringify(r.data, null, 2));

      await expect(axios.get(`${API_URL}api/board/instructor`, {
        headers: { 'x-access-token': token },
      })).to.eventually.be.rejectedWith('Request failed with status code 403');
    });
  });
});
