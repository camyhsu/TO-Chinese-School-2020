export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });
  const Family = sequelize.define('family', fields);

  /* Prototype */
  Object.assign(Family.prototype, {
    async childrenNames() {
      const children = await this.getChildren();
      return children.map((child) => child.name());
    },
    isParentOne(person) {
      return !!(this.parentOne && person && this.parentOne.id === person.id);
    },
    isParentTwo(person) {
      return !!(this.parentTwo && person && this.parentTwo.id === person.id);
    },
    /* TODO Not yet implemented
      def has_staff_for?(school_year)
      def has_instructor_for?(school_year)
    */
  });

  /* Non-prototype */
  Object.assign(Family, {
    createWith: async (obj) => Family.create(obj,
      {
        include: [
          { association: Family.ParentOne },
          { association: Family.ParentTwo },
          { association: Family.Address }],
      }),
  });

  return Family;
};
