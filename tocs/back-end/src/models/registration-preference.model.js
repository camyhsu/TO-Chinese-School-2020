export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });
  const RegistrationPreference = sequelize.define('registration_preference', {
    ...fields,
  });

  /* Prototype */
  Object.assign(RegistrationPreference.prototype, {

  });

  /* Non-prototype */
  Object.assign(RegistrationPreference, {

  });

  return RegistrationPreference;
};
