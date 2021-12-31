export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: ["name", "controller", "action"],
  });
  const Right = sequelize.define("right", fields);

  /* Prototype */
  Object.assign(Right.prototype, {
    authorized(controller, action) {
      return this.controller === controller && this.action === action;
    },
  });

  return Right;
};
