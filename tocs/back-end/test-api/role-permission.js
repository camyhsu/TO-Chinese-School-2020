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

describe('Test Role Permission', () => {
  describe('student/families/add_parent', () => {
    it('should be able to add parent', async () => {
      let r = await axios.post(`${API_URL}signin`, { username, password });
      const token = r.data.accessToken;
      expect(token).not.null;
      r = await axios.post(`${API_URL}api/student/families/add_parent?familyId=123`, {}, {
        headers: { 'x-access-token': token },
      });
      console.log(JSON.stringify(r.data, null, 2));

      await expect(axios.get(`${API_URL}api/instruction/school_classes/show`, {
        headers: { 'x-access-token': token },
      })).to.eventually.be.rejectedWith('Request failed with status code 403');
    });
  });
});
