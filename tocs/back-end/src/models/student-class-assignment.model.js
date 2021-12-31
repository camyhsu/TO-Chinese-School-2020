export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });
  const StudentClassAssignment = sequelize.define(
    "student_class_assignment",
    {
      ...fields,
    },
    {
      validate: {},
    }
  );

  /* Prototype */
  Object.assign(StudentClassAssignment.prototype, {});

  /* Non-prototype */
  Object.assign(StudentClassAssignment, {
    getGradeStudentCount: async (schoolYearId) =>
      StudentClassAssignment.findAll({
        where: { schoolYearId, gradeId: { [Sequelize.Op.ne]: null } },
        include: [
          {
            attributes: ["id", "chinese_name", "english_name"],
            model: sequelize.models.Grade,
            as: "grade",
          },
        ],
        attributes: [
          "grade.chinese_name",
          "grade.english_name",
          [sequelize.fn("count", sequelize.col("grade.id")), "cnt"],
        ],
        group: ["grade.id", "grade.chinese_name", "grade.english_name"],
      }),
    getElectiveClassSizes: async (schoolYearId) => {
      let sql =
        "SELECT elective_class_id,COUNT(*) FROM student_class_assignments";
      sql += ` WHERE school_year_id=${schoolYearId}`;
      sql += " AND elective_class_id IS NOT NULL";
      sql += " GROUP BY elective_class_id";
      const [results] = await sequelize.query(sql);
      return results.reduce(
        (r, c) => Object.assign(r, { [c.elective_class_id]: c.count }),
        {}
      );
    },
    getLowestSchoolClassByGender: async (
      schoolYearId,
      gender,
      schoolClassIds
    ) => {
      let sql =
        "SELECT s.school_class_id,COUNT(*) FROM student_class_assignments s";
      sql += " LEFT JOIN people p ON s.student_id=p.id";
      sql += ` WHERE school_year_id=${schoolYearId}`;
      sql += ` AND gender='${gender}' AND school_class_id in(${schoolClassIds.join(
        ","
      )})`;
      sql += " GROUP BY s.school_class_id ORDER BY COUNT(*) ASC";
      const [results] = await sequelize.query(sql);
      return results && results.length && results[0].school_class_id;
    },
  });

  return StudentClassAssignment;
};
