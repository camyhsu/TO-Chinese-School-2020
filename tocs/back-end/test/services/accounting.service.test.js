/* global describe, it */
import { expect } from "chai";
import AccountingService from "../../src/services/accounting.service.js";
import {
  createRandSchoolYear,
  createRandSchoolClass,
  today,
  randString,
  randPerson,
} from "../../src/utils/utilities.js";
import db from "../../src/models/index.js";

const {
  Grade,
  SchoolClass,
  SchoolYear,
  SchoolClassActiveFlag,
  StudentStatusFlag,
  StudentClassAssignment,
  WithdrawalRecord,
  Person,
} = db;

describe("Test AccountingService", () => {
  describe("getDiscounts", () => {
    it("getDiscounts", async () => {
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

  describe("createManualTransactionWithSideEffects", async () => {
    it("createManualTransactionWithSideEffects", async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const schoolYear = await SchoolYear.currentSchoolYear();
      const student = await Person.create(randPerson());
      const grade = await Grade.create({ englishName: randString() });

      const studentStatusFlag = await StudentStatusFlag.create({
        studentId: student.id,
        schoolYearId: schoolYear.id,
        schoolClassId: schoolClass.id,
        registered: true,
      });
      expect(studentStatusFlag.registered).to.be.true;

      const studentClassAssignment = await StudentClassAssignment.create({
        schoolYearId: schoolYear.id,
        schoolClassId: schoolClass.id,
        studentId: student.id,
        gradeId: grade.id,
      });
      expect(studentClassAssignment).to.be.not.null;

      let studentClassAssignments = await StudentClassAssignment.findAll({
        where: { studentId: student.id },
      });
      expect(studentClassAssignments.length).to.eq(1);

      const obj = {
        paymentMethod: "Check",
        checkNumber: "101",
        transactionType: "Withdrawal",
        amountInCents: 10,
        transaction_by_id: student.id,
        recorded_by_id: student.id,
        studentId: student.id,
      };

      const withdrawalRecords = await WithdrawalRecord.findAll({
        where: { studentId: student.id },
      });
      expect(withdrawalRecords.length).to.eq(0);

      const tx = await AccountingService.createManualTransactionWithSideEffects(
        obj
      );
      expect(tx).to.be.not.null;
      expect(tx.transactionDate).eq(today());

      const modifiedStudentStatusFlag = await StudentStatusFlag.getById(
        studentStatusFlag.id
      );
      expect(modifiedStudentStatusFlag.registered).to.be.false;

      studentClassAssignments = await StudentClassAssignment.findAll({
        where: { studentId: student.id },
      });
      expect(studentClassAssignments.length).to.eq(0);
    });
  });
});
