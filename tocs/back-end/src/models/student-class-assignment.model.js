export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });
  const StudentClassAssignment = sequelize.define('student_class_assignment', {
    ...fields,
  }, {
    validate: {

    },
  });

  /* Prototype */
  Object.assign(StudentClassAssignment.prototype, {

  });

  /* Non-prototype */
  Object.assign(StudentClassAssignment, {
    getGradeStudentCount: async (schoolYearId) => StudentClassAssignment.findAll({
      where: { schoolYearId, gradeId: { [Sequelize.Op.ne]: null } },
      include: [{ attributes: ['id', 'chinese_name', 'english_name'], model: sequelize.models.Grade, as: 'grade' }],
      attributes: ['grade.chinese_name', 'grade.english_name',
        [sequelize.fn('count', sequelize.col('grade.id')), 'cnt']],
      group: ['grade.id', 'grade.chinese_name', 'grade.english_name'],
    }),
  });

  return StudentClassAssignment;
};
