/* global describe, it */
import { expect } from 'chai';
import RegistrationService from '../../src/services/registration.service.js';
import StudentService from '../../src/services/student.service.js';
import {
  randAddress, randPerson, createRandSchoolYear, createRandSchoolClass,
} from '../../src/utils/utilities.js';
import db from '../../src/models/index.js';

const {
  BookCharge, Grade, SchoolClass,
} = db;

describe('Test Registration', () => {
  describe('addFamily/getFamily', () => {
    it('should add family and get family', async () => {
      const address = randAddress();
      const person = randPerson();
      const savedFamily = await RegistrationService.addFamily({ ...address, ...person });
      const family = await RegistrationService.getFamily(savedFamily.id);

      expect(family.id).to.eq(savedFamily.id);
      expect(family.address.id).to.eq(savedFamily.address.id);
      expect(family.parentOne.id).to.eq(savedFamily.parentOne.id);
      expect(family.children.length).to.eq(0);

      const child1 = randPerson();
      await StudentService.addChild(family.id, child1);

      let familyWithChildren = await RegistrationService.getFamily(savedFamily.id);
      expect(familyWithChildren.children.length).to.eq(1);
      expect(familyWithChildren.children[0].firstName).to.eq(child1.firstName);

      const child2 = randPerson();
      await StudentService.addChild(family.id, child2);

      familyWithChildren = await RegistrationService.getFamily(savedFamily.id);
      expect(familyWithChildren.children.length).to.eq(2);
      expect(familyWithChildren.children[1].firstName).to.eq(child2.firstName);
    });
  });

  describe('addSchoolYear', () => {
    it('should add SchoolYear', async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const schoolYear = await RegistrationService.addSchoolYear(createRandSchoolYear());
      expect(await schoolClass.activeIn(schoolYear.id)).to.be.true;
      const bookCharges = await BookCharge.findAllForSchoolYear(schoolYear.id);
      const grades = await Grade.findAll();
      expect(bookCharges.length).to.eq(grades.length);
    });
  });
});
