export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });
  const InPersonRegistrationTransaction = sequelize.define('in_person_registration_transaction', {
    ...fields,
  });

  /* Prototype */
  Object.assign(InPersonRegistrationTransaction.prototype, {

  });

  /* Non-prototype */
  Object.assign(InPersonRegistrationTransaction, {

  });

  return InPersonRegistrationTransaction;
};
