/* global describe, it */
import chai from 'chai';
import db from '../../src/models/index.js';
import { datePlus, randString } from '../../src/utils/utilities.js';
import { modelTests } from './model-test-utils.js';

const { expect } = chai;
const { SchoolYear } = db;
const createRandSchoolYear = () => ({
  name: randString(),
  startDate: new Date(),
  endDate: new Date(),
  registrationStartDate: new Date(),
  registration75PercentDate: new Date(),
  registrationEndDate: new Date(),
  refundEndDate: new Date(),
  refund50PercentDate: new Date(),
  earlyRegistrationStartDate: new Date(),
  earlyRegistrationEndDate: new Date(),
  ageCutoffMonth: 12,
});

describe('Test SchoolYear', () => {
  describe('SchoolYear - CRUD', modelTests(SchoolYear, { object: createRandSchoolYear() }));

  describe('findCurrentAndFutureSchoolYears', () => {
    it('findCurrentAndFutureSchoolYears', async () => {
      let r = await SchoolYear.findCurrentAndFutureSchoolYears();
      const originalSize = r.length;
      const obj = createRandSchoolYear();
      obj.endDate = datePlus(1);
      await SchoolYear.create(obj);
      r = await SchoolYear.findCurrentAndFutureSchoolYears();
      expect(r.length).to.eq(originalSize + 1);

      const c1 = await SchoolYear.currentSchoolYear();
      const c2 = await SchoolYear.nextSchoolYear();
      expect(c1.id).to.not.eq(c2.id);
    });
  });
});
