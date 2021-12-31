export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: ["description", "note"],
  });
  const LibraryBook = sequelize.define("library_book", {
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
      field: "book_type",
      allowNull: false,
      validate: { notNull: true, notEmpty: true },
    },
    checkedOut: {
      type: Sequelize.BOOLEAN,
      field: "checked_out",
    },
  });

  /* Prototype */
  Object.assign(LibraryBook.prototype, {
    bookTypes: {
      MIXED: "S/T",
      SIMPLIFIED: "S",
      TRADITIONAL: "T",
    },
    findCurrentCheckoutRecord() {
      return sequelize.models.LibraryBookCheckOut.findFirstBy({
        library_book_id: this.id,
        returnDate: null,
      });
    },
  });

  /* Non-prototype */
  Object.assign(LibraryBook, {
    async findEligibleCheckoutPeople() {
      const instructors =
        await sequelize.models.InstructorAssignment.findInstructors();
      const {
        ROLE_NAME_PRINCIPAL,
        ROLE_NAME_INSTRUCTION_OFFICER,
        ROLE_NAME_LIBRARIAN,
      } = sequelize.models.Role.prototype.roleNames;
      const promises = [
        ROLE_NAME_PRINCIPAL,
        ROLE_NAME_INSTRUCTION_OFFICER,
        ROLE_NAME_LIBRARIAN,
      ].map((n) => sequelize.models.Role.findPeopleWithRole(n));
      const people = await Promise.all(promises);
      const obj = {};
      [instructors].concat(people).forEach((collection) =>
        collection.forEach((p) => {
          obj[p.id] = p;
        })
      );
      return Object.values(obj);
    },
  });

  return LibraryBook;
};
