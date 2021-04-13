export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: ['role'],
    withDates: [['startDate', 'start_date'], ['endDate', 'end_date']],
  });
  const StaffAssignment = sequelize.define('staff_assignment', {
    ...fields,
    schoolYearId: {
      type: Sequelize.INTEGER,
      field: 'school_year_id',
      allowNull: false,
    },
    personId: {
      type: Sequelize.INTEGER,
      field: 'person_id',
      allowNull: false,
    },
  });

  return StaffAssignment;
};
