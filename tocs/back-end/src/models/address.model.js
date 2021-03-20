export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    // eslint-disable-next-line no-sparse-arrays
    withStrings: [
      'street', 'city', 'state', 'email',
      ['homePhone', 'home_phone'], ['cellPhone', 'cell_phone']],
  });
  const Address = sequelize.define('address', {
    ...fields,
    zipcode: {
      type: Sequelize.INTEGER,
      validate: { max: 99999 },
    },
  });

  /* Prototype */
  Object.assign(Address.prototype, {
    streetAddress() {
      return `${this.street}, ${this.city}, ${this.state} ${this.zipcode}`;
    },
  });

  /* Non-prototype */
  Object.assign(Address, {
    formatPhoneNumber: (phone) => (phone && phone.replace(/\D+/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')) || '',
    emailAlreadyExists: async (email) => !!(await Address.findFirstBy({ email })),
  });

  return Address;
};
