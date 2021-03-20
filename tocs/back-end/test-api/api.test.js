/* global describe, it */
import chai from 'chai';
import axios from 'axios';
import { Chance } from 'chance';

const chance = new Chance();
const { expect } = chai;
const API_URL = 'http://localhost:3001/api/';
const username = chance.first();
const password = '123456';

describe('Test API', () => {
  describe('SignUp', () => {
    it('Valid signUp and signIn', async () => {
      const formData = {
        username,
        password,
        email: chance.email(),
        firstName: chance.first(),
        lastName: chance.last(),
        gender: 'M',
        street: chance.street(),
        city: chance.city(),
        state: chance.state(),
        zipcode: chance.zip(),
      };
      let r = await axios.post(`${API_URL}auth/signup`, formData);
      expect(r.data.message).eq('Account successfully created');

      r = await axios.post(`${API_URL}auth/signin`, { username, password });
      console.log(JSON.stringify(r.data, null, 2));
      r = await axios.get(`${API_URL}user/student-parent`, {
        headers: { 'x-access-token': r.data.accessToken },
      });
      console.log(JSON.stringify(r.data, null, 2));
    });
  });
});
