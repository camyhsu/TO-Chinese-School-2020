import Sequelize from 'sequelize';
import db from '../models/index.js';
import { formatAddressPhoneNumbers } from '../utils/mutator.js';

const { Op } = Sequelize;
const {
  Address, BookCharge, Family, Grade, SchoolClass, SchoolClassActiveFlag, SchoolYear, StaffAssignment, Person,
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

const initializeSchoolClassActiveFlags = async (schoolYear) => {
  const schoolClasses = await SchoolClass.findAll();
  const promises = schoolClasses.map(async (schoolClass) => {
    const s = await SchoolClassActiveFlag.create({
      schoolClassId: schoolClass.id,
      schoolYearId: schoolYear.id,
    });
    return s;
  });
  return Promise.all(promises);
};

const initializeBookCharges = async (schoolYear) => {
  const grades = await Grade.findAll();
  const promises = grades.map(async (grade) => BookCharge.create({
    gradeId: grade.id,
    schoolYearId: schoolYear.id,
  }));
  return Promise.all(promises);
};

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
  getBookCharges: async (schoolYearId) => {
    const bookCharges = await BookCharge.findAllForSchoolYear(schoolYearId);
    bookCharges.forEach((bookCharge) => ['bookChargeInCents']
      .forEach((s) => Object.assign(bookCharge.dataValues, { [s.replace('InCents', '')]: bookCharge[s] / 100 })));
    return bookCharges;
  },
  saveBookCharges: async (schoolYearId, obj) => {
    const bookCharges = await BookCharge.findAllForSchoolYear(schoolYearId);
    const bcObj = bookCharges.reduce((result, current) => Object.assign(result, { [current.id]: current }), {});
    const promises = Object.entries(obj).map(async ([key, value]) => {
      bcObj[key].bookChargeInCents = value * 100;
      await bcObj[key].save();
    });
    return Promise.all(promises);
  },
  toggleAutoClassAssignment: async (id) => {
    const schoolYear = await SchoolYear.getById(id);
    schoolYear.autoClassAssignment = !schoolYear.autoClassAssignment;
    return schoolYear.save();
  },
  addSchoolYear: async (obj) => {
    const schoolYear = await SchoolYear.create(obj);
    await initializeSchoolClassActiveFlags(schoolYear);
    await initializeBookCharges(schoolYear);
    return schoolYear;
  },
  getStaffAssignments: async () => SchoolYear.findAll({ where: { id: { [Op.gt]: 8 } } }),
  getStaffAssignment: async (id) => {
    const schoolYear = await SchoolYear.getById(id);
    const staffAssignments = await StaffAssignment.findAll({
      include: [{ model: Person, as: 'person' }],
      where: { schoolYearId: { [Op.eq]: id } },
    });
    return { schoolYear, staffAssignments };
  },
  addFamily: async ({
    email, firstName, lastName, gender, street, city, state, zipcode, homePhone, cellPhone,
  }) => {
    const family = await Family.createWith({
      parentOne: { firstName, lastName, gender },
      address: {
        street, city, state, email, zipcode, homePhone, cellPhone,
      },
    });
    return family;
  },
  getFamily: async (id) => {
    const families = await Family.findAll({
      include: [
        { model: Person, as: 'parentOne' },
        { model: Person, as: 'parentTwo' },
        { model: Person, as: 'children' },
        { model: Address, as: 'address' },
      ],
      where: { id: { [Op.eq]: id } },
    });
    if (families && families.length) {
      return formatAddressPhoneNumbers(JSON.parse(JSON.stringify(families[0])));
    }
    return null;
  },
  getPeople: async ({ limit, offset, searchText }) => {
    const obj = { limit, offset };
    if (searchText) {
      obj.where = {
        [Op.or]: [
          { lastName: { [Op.iLike]: `%${searchText}%` } },
          { firstName: { [Op.iLike]: `%${searchText}%` } },
          { chineseName: { [Op.iLike]: `%${searchText}%` } },
        ],
      };
    }
    return Person.findAndCountAll(obj);
  },
  getPerson: async (id) => {
    const list = await Person.findAll({
      where: { id },
      include: [
        { model: Address, as: 'address' },
      ],
    });
    const person = list && list.length && list[0];
    let allFamilies = [];
    if (person) {
      const dbFamilies = await person.families();
      if (dbFamilies && dbFamilies.length > 0) {
        allFamilies = await Family.findAll({
          include: [
            { model: Person, as: 'parentOne' },
            { model: Person, as: 'parentTwo' },
            { model: Person, as: 'children' },
            { model: Address, as: 'address' },
          ],
          where: { id: { [Op.in]: dbFamilies.map((f) => f.id) } },
        });
      }
    }
    return formatAddressPhoneNumbers(JSON.parse(JSON.stringify({
      person, families: allFamilies,
    })));
  },
};
