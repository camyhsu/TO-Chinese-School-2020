export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true, withStrings: ['note'] });
  const LibraryBookCheckOut = sequelize.define('library_book_checkout', {
    ...fields,
    checkedOutDate: {
      type: Sequelize.DATE,
      field: 'checked_out_date',
      allowNull: false,
      validate: { notNull: true, notEmpty: true },
    },
    returnDate: {
      type: Sequelize.DATE,
      field: 'return_date',
      allowNull: true,
    },
  });

  /* Non-prototype */
  Object.assign(LibraryBookCheckOut, {
    notReturned: async () => LibraryBookCheckOut.findAll({ where: { returnDate: null } }),
    getBorrowers: async () => {
      let sql = 'SELECT DISTINCT b.* FROM library_book_checkouts a,people b';
      sql += ' WHERE a.checked_out_by_id=b.id AND a.return_date IS NULL';

      const people = await sequelize.query(sql, {
        model: sequelize.models.Person,
        mapToModel: true, // pass true here if you have any mapped fields
      });
      return people;
    },
  });

  return LibraryBookCheckOut;
};
