export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory(
    {
      withId: true,
      withDates: [
        ['lastStatusChangeDate', 'last_status_change_date'],
      ],
      withBooleans: ['registered'],
    },
  );
  const StudentStatusFlag = sequelize.define('student_status_flag', {
    ...fields,
  });

  /* Prototype */
  Object.assign(StudentStatusFlag.prototype, {

  });

  /* Non-prototype */
  Object.assign(StudentStatusFlag, {
    async isStudentRegisteredForSchoolYear(studentId, schoolYearId) {
      const obj = await StudentStatusFlag.findOne({ where: { studentId, schoolYearId, registered: true } });
      return !!obj;
    },
  });

  return StudentStatusFlag;
};
