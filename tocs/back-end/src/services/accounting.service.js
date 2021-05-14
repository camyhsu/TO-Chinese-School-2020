import Sequelize from 'sequelize';
import db from '../models/index.js';

const { Op } = Sequelize;
const {
  Instructor, RegistrationPayment, SchoolClass, SchoolClassActiveFlag, SchoolYear, InstructorAssignment,
} = db;

export default {
  getBoard: async () => {
    const currentAndFutureSchoolYears = await SchoolYear.findCurrentAndFutureSchoolYears();
    return { currentAndFutureSchoolYears };
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
};
