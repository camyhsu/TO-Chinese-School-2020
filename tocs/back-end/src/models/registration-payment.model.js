/* eslint-disable no-param-reassign */
export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true, withBooleans: ['paid'] });
  const RegistrationPayment = sequelize.define('registration_payment', {
    ...fields,
    grandTotalInCents: {
      type: Sequelize.INTEGER,
      field: 'grand_total_in_cents',
      allowNull: false,
    },
    cccaDueInCents: {
      type: Sequelize.INTEGER,
      field: 'ccca_due_in_cents',
      allowNull: false,
    },
    pvaDueInCents: {
      type: Sequelize.INTEGER,
      field: 'pva_due_in_cents',
      allowNull: false,
    },
  });

  /* Prototype */
  Object.assign(RegistrationPayment.prototype, {
    getStudentStatusFlags() {
      if (this.studentFeePayments) {
        return this.studentFeePayments.reduce((r, c) => r.concat(c.student.studentStatusFlags
          .filter((x) => x.schoolYearId === this.schoolYearId)), []);
      }
      return [];
    },
  });

  /* Non-prototype */
  Object.assign(RegistrationPayment, {
    createWith: async (obj) => RegistrationPayment.create(obj,
      { include: [{ association: RegistrationPayment.StudentFeePayment }] }),
    findPaidPaymentsPaidBy: async (paidById) => RegistrationPayment.findAll({
      where: { paid_by_id: paidById, paid: true },
      order: [['updated_at', 'DESC']],
    }),
    getPvaDueInCents: async (schoolYearId) => RegistrationPayment.sum('pva_due_in_cents', {
      where: { school_year_id: schoolYearId, paid: true },
    }),
    getCccaDueInCents: async (schoolYearId) => RegistrationPayment.sum('ccca_due_in_cents', {
      where: { school_year_id: schoolYearId, paid: true },
    }),
    findPaidPaymentsForSchoolYear: async (schoolYearId) => {
      const tmp = await RegistrationPayment.findAll({
        where: { school_year_id: schoolYearId, paid: true },
        include: [{ model: sequelize.models.StudentFeePayment, as: 'studentFeePayments' }],
        order: [['updated_at', 'DESC']],
      });
      return tmp;
    },
    fillInDue: async (obj, paidStudentFeePaymentsInFamilySize, schoolYear) => {
      obj.pvaDueInCents = RegistrationPayment.calculatePvaDueInCents(obj,
        paidStudentFeePaymentsInFamilySize, schoolYear);
      obj.cccaDueInCents = await RegistrationPayment.calculateCccaDueInCents(obj,
        paidStudentFeePaymentsInFamilySize, schoolYear);
    },
    calculatePvaDueInCents: (obj, paidStudentFeePaymentsInFamilySize, schoolYear) => {
      if (paidStudentFeePaymentsInFamilySize > 1) {
        return 0;
      }
      if (paidStudentFeePaymentsInFamilySize === 1 || obj.studentFeePayments.length < 2) {
        return schoolYear.pvaMembershipDueInCents;
      }
      return schoolYear.pvaMembershipDueInCents * 2;
    },
    calculateCccaDueInCents: async (obj, paidStudentFeePaymentsInFamilySize, schoolYear) => {
      if (paidStudentFeePaymentsInFamilySize > 0) {
        return 0;
      }

      const familyCccaLifetimeMember = await sequelize.models.Family.familyCccaLifetimeMember(obj.paid_by_id);
      if (familyCccaLifetimeMember) {
        return 0;
      }
      return schoolYear.cccaMembershipDueInCents;
    },
    calculateGrandTotal: (obj) => {
      let total = obj.studentFeePayments
        .reduce((r, c) => r + c.registrationFeeInCents + c.bookChargeInCents + c.tuitionInCents, 0);
      total += obj.pvaDueInCents + obj.cccaDueInCents;
      obj.grandTotalInCents = total;
    },
  });

  return RegistrationPayment;
};
