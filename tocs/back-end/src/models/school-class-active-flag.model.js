export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
  });
  const SchoolClassActiveFlag = sequelize.define('school_class_active_flag', {
    ...fields,
    active: {
      type: Sequelize.BOOLEAN,
      field: 'active',
      defaultValue: true,
    },
  });

  /* Non-prototype */
  Object.assign(SchoolClassActiveFlag, {

  });

  return SchoolClassActiveFlag;
};
