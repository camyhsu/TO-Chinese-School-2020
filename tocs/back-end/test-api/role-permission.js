/* eslint-disable import/no-extraneous-dependencies */
/* global describe, it */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import apiFn from '../src/utils/api.js';

const api = apiFn();
chai.use(chaiAsPromised);
const { expect } = chai;

describe('Test Role Permission', () => {
  describe('student/families/add_parent', () => {
    it('should be able to add parent', async () => {
      await api.signIn();
      await expect(api.showStudentList()).to.eventually.be.rejectedWith('Request failed with status code 403');
      const r = await api.getStudentBoard();
      expect(r.person.id).gt(0);
    });
  });
});
