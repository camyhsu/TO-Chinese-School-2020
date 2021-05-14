export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });
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

  });

  /* Non-prototype */
  Object.assign(RegistrationPayment, {
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
  });

  return RegistrationPayment;
};
