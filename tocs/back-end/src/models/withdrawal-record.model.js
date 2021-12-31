export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withDates: [
      ["registrationDate", "registration_date"],
      ["withdrawalDate", "withdrawal_date"],
    ],
  });
  const WithdrawalRecord = sequelize.define("withdrawal_record", {
    ...fields,
  });

  /* Prototype */
  Object.assign(WithdrawalRecord.prototype, {});

  /* Non-prototype */
  Object.assign(WithdrawalRecord, {});

  return WithdrawalRecord;
};
