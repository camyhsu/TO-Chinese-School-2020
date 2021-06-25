import Sequelize from 'sequelize';
import db from '../models/index.js';

const { Op } = Sequelize;
const {
  Address, Family, GatewayTransaction, Grade, ManualTransaction, Person,
  RegistrationPayment, PaidBy, RegistrationPreference, SchoolClass, SchoolYear, Student,
  StudentClassAssignment, StudentFeePayment, User,
} = db;

export default {
  addParent: async (familyId, obj) => {
    const family = await Family.getById(familyId);
    const person = await Person.create(obj);
    await family.setParentTwo(person.id);
  },
  addChild: async (familyId, obj) => {
    const family = await Family.getById(familyId);
    const child = await Person.create(obj);
    await family.addChild(child.id);
  },
  getPerson: async (personId) => Person.getById(personId),
  savePerson: async (personId, obj) => {
    const person = await Person.getById(personId);
    Object.assign(person, obj);
    await person.save();
  },
  // Addresses
  getFamilyAddress: async (familyId) => {
    const family = await Family.getById(familyId);
    return family.getAddress();
  },
  getPersonalAddress: async (personId) => {
    const person = await Person.getById(personId);
    return person.getAddress();
  },
  saveFamilyAddress: async (familyId, obj) => {
    const family = await Family.getById(familyId);
    const address = await family.getAddress();
    Object.assign(address, obj);
    await address.save();
  },
  savePersonalAddress: async (personId, obj) => {
    const person = await Person.getById(personId);
    const address = await person.getAddress();
    Object.assign(address, obj);
    await address.save();
  },
  addPersonalAddress: async (personId, obj) => {
    const person = await Person.getById(personId);
    const savedAddress = await Address.create(obj);
    await person.setAddress(savedAddress.id);
  },
  getTransactionHistoryByUser: async (userId) => {
    const user = await User.getById(userId);
    const { personId } = user;
    const manualTransactions = await ManualTransaction.findTransactionBy(personId);
    const registrationPayments = await RegistrationPayment.findPaidPaymentsPaidBy(personId);
    registrationPayments.forEach((registrationPayment) => ['grandTotalInCents', 'cccaDueInCents', 'pvaDueInCents']
      .forEach((s) => Object.assign(registrationPayment.dataValues,
        { [s.replace('InCents', '')]: registrationPayment[s] / 100 })));
    return { manualTransactions, registrationPayments };
  },
  getRegistrationPayment: async (id) => {
    const registrationPayment = await RegistrationPayment.findOne({
      where: { id },
      include: [{
        model: PaidBy,
        as: 'paidBy',
      }, {
        model: GatewayTransaction,
        as: 'gatewayTransactions',
        where: {
          approvalStatus: GatewayTransaction.prototype.status.APPROVAL_STATUS_APPROVED,
        },
      }, {
        model: StudentFeePayment,
        as: 'studentFeePayments',
        include: [{
          model: Student,
          as: 'student',
        }],
      }, { model: SchoolYear, as: 'schoolYear' }],
    });

    // Query student registrationPreferences here instead of including it in above to avoid long identifiers
    if (registrationPayment && registrationPayment.studentFeePayments) {
      const promises = registrationPayment.studentFeePayments
        .map(async (studentFeePayment) => {
          const { student } = studentFeePayment;
          const schoolYearId = registrationPayment.schoolYear.id;
          const registrationPreferences = await student.getRegistrationPreferenceForSchoolYear(schoolYearId);
          student.dataValues.registrationPreferences = registrationPreferences;
        });
      await Promise.all(promises);
    }
    return { registrationPayment };
  },
  saveRegistrationPreferences: async (personId, registrationPreferences) => {
    // There could be orphan registrationPreference
    const promises = registrationPreferences.map(async (registrationPreference) => {
      const existing = await RegistrationPreference.findOne({
        where: {
          studentId: registrationPreference.studentId,
          schoolYearId: registrationPreference.schoolYearId,
        },
      });
      if (existing) {
        Object.assign(existing, { ...registrationPreference });
        return existing.save();
      }
      const toBeSaved = Object.assign(registrationPreference, {
        entered_by_id: personId,
      });
      return RegistrationPreference.create(toBeSaved);
    });
    const saved = await Promise.all(promises);
    const students = await Person.findAll({
      where: { id: { [Op.in]: saved.map((p) => p.studentId) } },
      order: [['birth_year'], ['birth_month']],
    });
    const person = await Person.getById(personId);
    return { students, person, registrationPreferences: saved };
  },
  initializeRegistrationPayment: async (ids) => {
    console.log('initializeRegistrationPayment', ids);
  },
  getStudentRegistrationDisplayOptions: async (schoolYearId, personId) => {
    const schoolYear = await SchoolYear.findOne({
      where: { id: schoolYearId },
      include: [{ model: SchoolYear, as: 'previousSchoolYear' }],
    });
    const { previousSchoolYear } = schoolYear;
    const previousSchoolYearId = previousSchoolYear.id;
    const person = await Person.getById(personId);
    const children = await person.findChildren();
    const registeredStudents = [];
    const registrationPreferences = [];
    const electiveClasses = await SchoolClass.getElectiveSchoolClass(schoolYearId);
    const electiveClassSizes = await StudentClassAssignment.getElectiveClassSizes(schoolYearId);
    const filteredElectiveClasses = electiveClasses
      .filter((c) => !electiveClassSizes[c.id] || electiveClassSizes[c.id] < c.maxSize);
    const promises = children.map(async (student) => {
      const studentStatusFlag = await student.studentStatusFlagFor(schoolYearId);
      if (studentStatusFlag && studentStatusFlag.registered) {
        registeredStudents.push(student);
      } else {
        const registrationPreference = { schoolYear, student };

        const previousSchoolYearClassAssignment = await student
          .getStudentClassAssignmentForSchoolYear(previousSchoolYearId);
        const schoolAge = student.schoolAgeFor(schoolYear);
        if (previousSchoolYearClassAssignment) {
          registrationPreference.previousGrade = previousSchoolYearClassAssignment.grade;
          registrationPreference.grade = await Grade
            .snapDownToFirstActiveGrade(registrationPreference.previousGrade.nextGrade.id, schoolYearId);
        } else {
          registrationPreference.grade = await Grade.findBySchoolAge(schoolAge);
        }

        registrationPreference.gradeFull = await registrationPreference.grade.gradeFull(schoolYearId);
        registrationPreference.availableSchoolClassTypes = await registrationPreference
          .grade.findAvailableSchoolClassTypes(schoolYearId);

        const previousSchoolClassAssignment = await student
          .getStudentClassAssignmentForSchoolYear(previousSchoolYearId);
        /*
         * if previous grade is EC1, then only EC2 can be selected this year.
         * if previous grade is not EC1, then EC2 is not avaliable this year.
         */
        if (previousSchoolClassAssignment && previousSchoolClassAssignment.grade.id === 2) {
          if (previousSchoolClassAssignment.schoolClass.schoolClassType === 'EC') {
            registrationPreference.availableSchoolClassTypes = ['EC'];
          } else {
            registrationPreference.availableSchoolClassTypes = registrationPreference
              .availableSchoolClassTypes.filter((c) => c !== 'EC');
          }
        }

        // For K, EC only allow school year 5 to 8
        if (registrationPreference.grade.id === 2 && (schoolAge < 5 || schoolAge > 8)) {
          registrationPreference.availableSchoolClassTypes = registrationPreference
            .availableSchoolClassTypes.filter((c) => c !== 'EC');
        }

        const promisesSchoolClassTypes = registrationPreference.availableSchoolClassTypes
          .map(async (schoolClassType) => {
            const isFull = await registrationPreference.grade.fullFor(schoolYearId, schoolClassType);
            return {
              schoolClassType, isFull, text: SchoolClass.getSchoolClassTypeName(schoolClassType),
            };
          });

        registrationPreference.availableSchoolClassTypes = await Promise.all(promisesSchoolClassTypes);

        // Filter full
        registrationPreference.fullSchoolClassTypes = registrationPreference.availableSchoolClassTypes
          .filter((c) => c.isFull);
        registrationPreference.availableSchoolClassTypes = registrationPreference.availableSchoolClassTypes
          .filter((c) => !c.isFull);

        // Default to first available schoolClassType
        registrationPreference.schoolClassType = registrationPreference.availableSchoolClassTypes
          && registrationPreference.availableSchoolClassTypes.length
          && registrationPreference.availableSchoolClassTypes[0].schoolClassType;

        // Elective classes
        registrationPreference.availableElectiveSchoolClasses = filteredElectiveClasses
          .filter((c) => !((c.minAge && schoolAge < c.minAge) || (c.maxAge && schoolAge > c.maxAge)))
          .map((c) => ({ id: c.id, text: c.name() }));

        registrationPreferences.push(registrationPreference);
      }
    });

    await Promise.all(promises);

    return {
      person,
      schoolYear,
      registeredStudents,
      registrationPreferences: registrationPreferences.sort((a, b) => a.student.birthYear - b.student.birthYear),
    };
  },
};
