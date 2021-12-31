import { formatPhoneNumber, toNumeric } from "../utils/utilities.js";

export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: ["street", "city", "state", "email"],
  });
  const Address = sequelize.define(
    "address",
    {
      ...fields,
      homePhone: {
        type: Sequelize.STRING,
        field: "home_phone",
        allowNull: true,
        validate: { len: 10 },
      },
      cellPhone: {
        type: Sequelize.STRING,
        field: "cell_phone",
        allowNull: true,
        validate: { len: 10 },
      },
      zipcode: {
        type: Sequelize.INTEGER,
        validate: { max: 99999 },
      },
    },
    {
      hooks: {
        beforeValidate: (obj) =>
          ["homePhone", "cellPhone"].reduce(
            (r, current) =>
              Object.assign(r, {
                [current]: r[current] ? toNumeric(r[current]) : null,
              }),
            obj
          ),
      },
    }
  );

  /* Prototype */
  Object.assign(Address.prototype, {
    streetAddress() {
      return `${this.street}, ${this.city}, ${this.state} ${this.zipcode}`;
    },
  });

  /* Non-prototype */
  Object.assign(Address, {
    formatPhoneNumber: (phone) => formatPhoneNumber(phone),
    emailAlreadyExists: async (email) =>
      !!(await Address.findFirstBy({ email })),
  });

  return Address;
};
