/* global describe, it */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import db from '../../src/models/index.js';
import {
  randPerson, createRandSchoolClass, createRandSchoolYear, randString,
} from '../../src/utils/utilities.js';

chai.use(chaiAsPromised);
const { expect } = chai;
const {
  Grade, StudentClassAssignment, Person, SchoolClass, SchoolYear,
} = db;

describe('Test StudentClassAssignment', () => {
  describe('StudentClassAssignment', () => {
    it('StudentClassAssignment', async () => {
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const student = await Person.create(randPerson());
      const studentClassAssignment = await StudentClassAssignment.create({
        schoolYearId: schoolYear.id,
        schoolClassId: schoolClass.id,
        studentId: student.id,
      });
      expect(studentClassAssignment.id).to.greaterThan(0);
    });
  });

  describe('getGradeStudentCount', () => {
    it('getGradeStudentCount', async () => {
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const student = await Person.create(randPerson());
      const grade = await Grade.create({ englishName: randString() });
      await StudentClassAssignment.create({
        schoolYearId: schoolYear.id,
        schoolClassId: schoolClass.id,
        studentId: student.id,
        gradeId: grade.id,
      });
      const c = await StudentClassAssignment.getGradeStudentCount(schoolYear.id);
      expect(c.length).to.greaterThan(0);
    });
  });
});
