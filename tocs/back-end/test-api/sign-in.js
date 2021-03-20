/* eslint-disable import/no-extraneous-dependencies */
/* global describe, it */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import apiFn from '../src/utils/api.js';

chai.use(chaiAsPromised);
const { expect } = chai;
const apiUrl = 'http://localhost:3001/';
const username = 'admin';
const password = '123456';

const api = apiFn({ apiUrl, username, password });

describe('Test SignIn', () => {
  describe('SignIn', () => {
    it('Invalid signIn', async () => {
      await expect(api.signIn(username, 'xyz')).to.eventually.be.rejectedWith('Request failed with status code 401');
      await expect(api.signIn('xyz', password)).to.eventually.be.rejectedWith('Request failed with status code 401');
    });

    it('Valid signIn', async () => {
      const r = await api.signIn();
      expect(api.getAccessToken()).eq(r.accessToken);
    });
  });
});
