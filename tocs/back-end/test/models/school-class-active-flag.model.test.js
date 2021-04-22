/* global describe, it */
import chai from 'chai';
import db from '../../src/models/index.js';
import { randString } from '../../src/utils/utilities.js';

const { expect } = chai;

const { SchoolClass, SchoolClassActiveFlag, SchoolYear } = db;
const createRandSchoolClass = (c) => ({
  startDate: new Date(),
  endDate: new Date(),
  englishName: randString(),
  chineseName: randString(),
  schoolClassType: c || SchoolClass.prototype.schoolClassTypes.SCHOOL_CLASS_TYPE_MIXED,
  maxSize: 10,
});

const createRandSchoolYear = (obj) => ({
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
  ...obj,
});

describe('Test SchoolClassActiveFlag', () => {
  describe('SchoolClassActiveFlag', async () => {
    it('SchoolClassActiveFlag - create', async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const s = await SchoolClassActiveFlag.create();
      s.setSchoolClass(schoolClass.id);
      s.setSchoolYear(schoolYear.id);
      await s.save();

      const t = await SchoolClassActiveFlag.getById(s.id);
      expect(t.schoolClassId).to.eq(schoolClass.id);
      expect(t.schoolYearId).to.eq(schoolYear.id);
    });
  });

  describe('activeIn', async () => {
    it('activeIn', async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const s = await SchoolClassActiveFlag.create();
      s.setSchoolClass(schoolClass.id);
      s.setSchoolYear(schoolYear.id);
      await s.save();

      expect(await schoolClass.activeIn(schoolYear.id)).to.be.true;

      s.active = false;
      await s.save();
      expect(await schoolClass.activeIn(schoolYear.id)).to.be.false;
    });
  });
});
