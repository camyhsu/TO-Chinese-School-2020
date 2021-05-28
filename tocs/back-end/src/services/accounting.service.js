import Sequelize from 'sequelize';
import db from '../models/index.js';
import { today, tomorrow } from '../utils/utilities.js';
import { withdrawalMailer } from '../utils/mailers.js';

const { Op } = Sequelize;
const {
  Instructor, RegistrationPayment, SchoolClass, SchoolClassActiveFlag, SchoolYear, InstructorAssignment, Person,
  ManualTransaction, Student, TransactionBy, WithdrawalRecord,
} = db;

export default {
  getBoard: async () => {
    const currentAndFutureSchoolYears = await SchoolYear.findCurrentAndFutureSchoolYears();
    const currentSchoolYear = await SchoolYear.currentSchoolYear();
    const nextSchoolYear = await SchoolYear.nextSchoolYear();
    return { currentAndFutureSchoolYears, currentSchoolYear, nextSchoolYear };
  },
  getInstructorDiscounts: async () => {
    const currentSchoolYear = await SchoolYear.currentSchoolYear();
    const instructorAssignments = await InstructorAssignment.findAll({
      where: {
        role: {
          [Op.in]: [
            InstructorAssignment.prototype.roleNames.ROLE_PRIMARY_INSTRUCTOR,
            InstructorAssignment.prototype.roleNames.ROLE_SECONDARY_INSTRUCTOR,
          ],
        },
        schoolYearId: currentSchoolYear.id,
      },
      include: [
        {
          model: SchoolClass,
          as: 'schoolClass',
          include: [
            {
              model: SchoolClassActiveFlag,
              where: {
                schoolYearId: currentSchoolYear.id,
                active: true,
              },
              as: 'schoolClassActiveFlags',
            },
          ],
        },
        { model: Instructor, as: 'instructor' },
      ],
      order: [['schoolClass', 'englishName', 'asc']],
    });
    if (instructorAssignments) {
      const promises = instructorAssignments.map(async (instructorAssignment) => {
        const { instructor } = instructorAssignment;
        if (instructor) {
          const children = await instructor.findChildren();
          instructor.dataValues.children = children;
          instructor.dataValues.discount = Math.min(2, children.length) * 60;
        }
        return instructor;
      });
      await Promise.all(promises);
    }
    return instructorAssignments;
  },

  getChargesCollected: async (schoolYearId) => {
    let sql = 'SELECT SUM(student_fee_payments.registration_fee_in_cents) as registration_fee_total,';
    sql += ' SUM(student_fee_payments.tuition_in_cents) as tuition_total,';
    sql += ' SUM(student_fee_payments.book_charge_in_cents) as book_charge_total';
    sql += ' FROM student_fee_payments';
    sql += ' JOIN registration_payments ON student_fee_payments.registration_payment_id = registration_payments.id';
    sql += ` WHERE registration_payments.paid = TRUE AND registration_payments.school_year_id =${schoolYearId}`;
    const [rows] = await db.sequelize.query(sql);
    const result = {};

    if (rows && rows.length) {
      Object.assign(result, rows[0]);
    }

    result.pvaDueInCents = await RegistrationPayment.getPvaDueInCents(schoolYearId);
    result.cccaDueInCents = await RegistrationPayment.getCccaDueInCents(schoolYearId);

    return result;
  },

  async createManualTransactionWithSideEffects(obj) {
    if (!obj.transactionDate) {
      Object.assign(obj, { transactionDate: today() });
    }
    const manualTransaction = await ManualTransaction.create(obj);
    await this.moveStudentClassAssignmentToWithdrawalRecord(manualTransaction);
    return manualTransaction;
  },

  async moveStudentClassAssignmentToWithdrawalRecord(manualTransaction) {
    const schoolYear = await SchoolYear.currentSchoolYear();
    const schoolYearId = schoolYear.id;
    const withdrawalRecord = {
      schoolYearId,
      studentId: manualTransaction.studentId,
      withdrawalDate: manualTransaction.transactionDate,
    };

    // Grab the registration time and set the student status to NOT registered
    const student = await Person.getById(manualTransaction.studentId);
    const studentStatusFlag = await student.studentStatusFlagFor(schoolYearId);
    if (studentStatusFlag) {
      withdrawalRecord.registrationDate = studentStatusFlag.lastStatusChangeDate;
      studentStatusFlag.registered = false;
      studentStatusFlag.lastStatusChangeDate = manualTransaction.transactionDate;
      await studentStatusFlag.save();
    }

    // Move class assignment data to withdrawal record and destroy the class assignment
    const studentClassAssignment = await student.getStudentClassAssignmentForSchoolYear(schoolYearId);
    if (studentClassAssignment) {
      withdrawalRecord.gradeId = studentClassAssignment.gradeId;
      withdrawalRecord.schoolClassId = studentClassAssignment.schoolClassId;
      withdrawalRecord.electiveClassId = studentClassAssignment.electiveClassId;
      await studentClassAssignment.destroy();
    }

    await WithdrawalRecord.create(withdrawalRecord);

    // Notify instructors about the withdrawal
    if (new Date(tomorrow()) >= new Date(schoolYear.startDate)) {
      withdrawalMailer.notifyInstructor(student, studentClassAssignment && studentClassAssignment.schoolClass);
    }
  },

  async initializeManualTransaction(personId) {
    const person = await Person.getById(personId);
    const parents = await person.findParents();
    return { person, parents };
  },

  async addManualTransaction(obj, userId) {
    const manualTransaction = { ...obj };
    if (manualTransaction.amount) {
      manualTransaction.amountInCents = manualTransaction.amount * 100;
    }

    manualTransaction.transaction_by_id = manualTransaction.transactionById;
    manualTransaction.recorded_by_id = userId;
    console.log('manualTransaction', manualTransaction);
    await this.createManualTransactionWithSideEffects(manualTransaction);
    return 'Added';
  },

  async getManualTransactionsForLastTwoYears() {
    const currentSchoolYear = await SchoolYear.currentSchoolYear();
    return ManualTransaction.findAll({
      where: { updated_at: { [Op.gt]: currentSchoolYear.previousSchoolYear.earlyRegistrationStartDate } },
      include: [{ model: TransactionBy, as: 'transactionBy' }, { model: Student, as: 'student' }],
      order: [['updated_at', 'DESC']],
    });
  },
};
