export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true, withStrings: ['description', 'note'] });
  const LibraryBook = sequelize.define('library_book', {
    ...fields,
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { notNull: true, notEmpty: true },
    },
    publisher: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { notNull: true, notEmpty: true },
    },
    bookType: {
      type: Sequelize.STRING,
      field: 'book_type',
      allowNull: false,
      validate: { notNull: true, notEmpty: true },
    },
    checkedOut: {
      type: Sequelize.BOOLEAN,
      field: 'checked_out',
    },
  });

  /* Prototype */
  Object.assign(LibraryBook.prototype, {
    bookTypes: {
      MIXED: 'S/T',
      SIMPLIFIED: 'S',
      TRADITIONAL: 'T',
    },
    findCurrentCheckoutRecord() {
      return sequelize.models.LibraryBookCheckOut.findFirstBy({
        library_book_id: this.id,
        returnDate: null,
      });
    },
  });

  return LibraryBook;
};
