/* global describe, it */
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
      expect(ds).not.toBeNull();
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
      expect(studentStatusFlag.registered).toBe(true);

      const studentClassAssignment = await StudentClassAssignment.create({
        schoolYearId: schoolYear.id,
        schoolClassId: schoolClass.id,
        studentId: student.id,
        gradeId: grade.id,
      });
      expect(studentClassAssignment).not.toBeNull();

      let studentClassAssignments = await StudentClassAssignment.findAll({
        where: { studentId: student.id },
      });
      expect(studentClassAssignments.length).toBe(1);

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
      expect(withdrawalRecords.length).toBe(0);

      const tx = await AccountingService.createManualTransactionWithSideEffects(
        obj
      );
      expect(tx).not.toBeNull();
      expect(tx.transactionDate).toBe(today());

      const modifiedStudentStatusFlag = await StudentStatusFlag.getById(
        studentStatusFlag.id
      );
      expect(modifiedStudentStatusFlag.registered).toBe(false);

      studentClassAssignments = await StudentClassAssignment.findAll({
        where: { studentId: student.id },
      });
      expect(studentClassAssignments.length).toBe(0);
    });
  });
});
