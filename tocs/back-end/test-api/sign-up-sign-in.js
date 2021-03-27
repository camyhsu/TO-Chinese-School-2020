/* eslint-disable import/no-extraneous-dependencies */
/* global describe, it */
import chai from 'chai';
import { Chance } from 'chance';
import apiFn from '../src/utils/api.js';

const chance = new Chance();
const { expect } = chai;
const username = chance.first();
const password = '123456';

const api = apiFn();

describe('Test SignUp/SignIn', () => {
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
      let r = await api.signUp(formData);
      expect(r.data.message).eq('Account successfully created');

      r = await api.signIn(username, password);
      console.log(JSON.stringify(r, null, 2));
      r = await api.getStudentBoard();
      console.log(JSON.stringify(r, null, 2));
    });
  });
});
