export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: [['schoolClassType', 'school_class_type']],
    withIntegers: [
      ['schoolYearId', 'school_year_id'],
      ['studentId', 'student_id'],
      ['enteredById', 'entered_by_id'],
      ['previousGradeId', 'previous_grade_id'],
      ['gradeId', 'grade_id'],
      ['electiveClassId', 'elective_class_id'],
    ],
  });
  const RegistrationPreference = sequelize.define('registration_preference', {
    ...fields,
  });

  /* Prototype */
  Object.assign(RegistrationPreference.prototype, {

  });

  /* Non-prototype */
  Object.assign(RegistrationPreference, {

  });

  return RegistrationPreference;
};
