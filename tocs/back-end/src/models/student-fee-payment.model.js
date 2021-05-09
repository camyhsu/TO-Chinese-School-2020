export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });
  const StudentFeePayment = sequelize.define('student_fee_payment', {
    ...fields,
  });

  /* Prototype */
  Object.assign(StudentFeePayment.prototype, {

  });

  /* Non-prototype */
  Object.assign(StudentFeePayment, {

  });

  return StudentFeePayment;
};
