import Sequelize from 'sequelize';
import db from '../models/index.js';

const { Op } = Sequelize;
const {
  Grade, SchoolClass, SchoolClassActiveFlag, SchoolYear, StaffAssignment, Person,
} = db;

const dollarFields = [
  'registrationFeeInCents',
  'tuitionInCents',
  'pvaMembershipDueInCents',
  'cccaMembershipDueInCents',
  'earlyRegistrationTuitionInCents',
  'tuitionDiscountForThreeOrMoreChildInCents',
  'tuitionDiscountForPreKInCents',
  'tuitionDiscountForInstructorInCents',
];

export default {
  getGrades: async () => Grade.findAll(),
  getSchoolClasses: async () => SchoolClass.findAll({ include: [{ model: Grade, as: 'grade' }] }),
  getSchoolClass: async (id) => SchoolClass.getById(id),
  getActiveSchoolClassesForCurrentNextSchoolYear:
    async () => SchoolClass.getActiveSchoolClassesForCurrentNextSchoolYear(),
  saveSchoolClass: async (id, obj) => {
    const schoolClass = await SchoolClass.getById(id);
    if (!obj.minAge) {
      Object.assign(obj, { minAge: null });
    }
    if (!obj.maxAge) {
      Object.assign(obj, { maxAge: null });
    }
    Object.assign(schoolClass, obj);
    await schoolClass.save();
  },
  toggleActiveSchoolClass: async (id, schoolYearId, active) => {
    const schoolClass = await SchoolClass.getById(id);
    await schoolClass.flipActiveTo(schoolYearId, active);
    return `ActiveSchoolClass updated ${id} ${schoolYearId}`;
  },
  addSchoolClass: async (obj) => {
    if (!obj.minAge) {
      Object.assign(obj, { minAge: null });
    }
    if (!obj.maxAge) {
      Object.assign(obj, { maxAge: null });
    }
    if (!obj.gradeId) {
      Object.assign(obj, { gradeId: null });
    }
    const schoolClass = await SchoolClass.create(obj);
    const schoolYears = await SchoolYear.findCurrentAndFutureSchoolYears();
    const promises = schoolYears.map(async (schoolYear) => {
      const s = await SchoolClassActiveFlag.create();
      await s.setSchoolClass(schoolClass.id);
      await s.setSchoolYear(schoolYear.id);
    });
    Promise.all(promises);
  },
  getSchoolYears: async () => SchoolYear.findAll(),
  getSchoolYear: async (id) => {
    const schoolYear = await SchoolYear.getById(id);
    dollarFields.forEach((s) => {
      schoolYear.dataValues[s.replace('InCents', '')] = schoolYear[s] / 100;
    });
    return schoolYear;
  },
  saveSchoolYear: async (id, obj) => {
    const schoolYear = await SchoolYear.getById(id);
    Object.assign(schoolYear, obj);
    dollarFields.forEach((s) => { schoolYear[s] = obj[s.replace('InCents', '')] * 100; });
    await schoolYear.save();
  },
  toggleAutoClassAssignment: async (id) => {
    const schoolYear = await SchoolYear.getById(id);
    schoolYear.autoClassAssignment = !schoolYear.autoClassAssignment;
    return schoolYear.save();
  },
  addSchoolYear: async (obj) => SchoolYear.create(obj),
  getStaffAssignments: async () => SchoolYear.findAll({ where: { id: { [Op.gt]: 8 } } }),
  getStaffAssignment: async (id) => {
    const schoolYear = await SchoolYear.getById(id);
    const staffAssignments = await StaffAssignment.findAll({
      include: [{ model: Person, as: 'person' }],
      where: { schoolYearId: { [Op.eq]: id } },
    });
    return { schoolYear, staffAssignments };
  },
};
