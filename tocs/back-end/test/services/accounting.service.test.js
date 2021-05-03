/* global describe, it */
import { expect } from 'chai';
import AccountingService from '../../src/services/accounting.service.js';
import {
  createRandSchoolYear, createRandSchoolClass,
} from '../../src/utils/utilities.js';
import db from '../../src/models/index.js';

const { SchoolClass, SchoolYear, SchoolClassActiveFlag } = db;

describe('Test AccountingService', () => {
  describe('getDiscounts', () => {
    it('getDiscounts', async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const s = await SchoolClassActiveFlag.create();
      s.setSchoolClass(schoolClass.id);
      s.setSchoolYear(schoolYear.id);
      await s.save();

      const ds = await AccountingService.getInstructorDiscounts();
      expect(ds).to.be.not.null;
    });
  });
});
