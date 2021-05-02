export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });
  const BookCharge = sequelize.define('book_charge', {
    ...fields,
    bookChargeInCents: {
      type: Sequelize.INTEGER,
      field: 'book_charge_in_cents',
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
  });

  /* Prototype */
  Object.assign(BookCharge.prototype, {

  });

  /* Non-prototype */
  Object.assign(BookCharge, {
    findAllForSchoolYear: async (schoolYearId) => BookCharge.findAll({
      where: { schoolYearId },
      include: [
        { model: sequelize.models.Grade, as: 'grade' },
        { model: sequelize.models.SchoolYear, as: 'schoolYear' },
      ],
    }),
  });

  return BookCharge;
};
