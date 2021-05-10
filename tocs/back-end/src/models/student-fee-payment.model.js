export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withIntegers: [
      ['registrationFeeInCents', 'registration_fee_in_cents', true],
      ['tuitionInCents', 'tuition_in_cents', true],
      ['bookChargeInCents', 'book_charge_in_cents', true],
    ],
  });

  const StudentFeePayment = sequelize.define('student_fee_payment', {
    ...fields,
    earlyRegistration: {
      type: Sequelize.BOOLEAN,
      field: 'early_registration',
      defaultValue: false,
    },
    multipleChildDiscount: {
      type: Sequelize.BOOLEAN,
      field: 'multiple_child_discount',
      defaultValue: false,
      allowNull: false,
    },
    preKDiscount: {
      type: Sequelize.BOOLEAN,
      field: 'pre_k_discount',
      defaultValue: false,
      allowNull: false,
    },
    prorate75: {
      type: Sequelize.BOOLEAN,
      field: 'prorate_75',
      defaultValue: false,
      allowNull: false,
    },
    prorate50: {
      type: Sequelize.BOOLEAN,
      field: 'prorate_50',
      defaultValue: false,
      allowNull: false,
    },
    instructorDiscount: {
      type: Sequelize.BOOLEAN,
      field: 'instructor_discount',
      defaultValue: false,
      allowNull: false,
    },
    staffDiscount: {
      type: Sequelize.BOOLEAN,
      field: 'staff_discount',
      defaultValue: false,
      allowNull: false,
    },
  });

  /* Prototype */
  Object.assign(StudentFeePayment.prototype, {

  });

  /* Non-prototype */
  Object.assign(StudentFeePayment, {

  });

  return StudentFeePayment;
};
