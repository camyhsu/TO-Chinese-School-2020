import db from '../models/index.js';

const {
  Address, Family, GatewayTransaction, ManualTransaction, Person,
  RegistrationPayment, PaidBy, SchoolYear, Student, StudentFeePayment, User,
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
};
