export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: [
      ['chineseName', 'chinese_name'],
      ['englishName', 'english_name'],
      ['shortName', 'short_name'],
      ['jerseyNumberPrefix', 'jersey_number_prefix'],
    ],
  });
  const Grade = sequelize.define('grade', { ...fields });

  /* Prototype */
  Object.assign(Grade.prototype, {
    name() {
      return `${this.chineseName}(${this.englishName})`;
    },
    async getAllowedMaxStudentCount(schoolYearId) {
      const schoolClasses = await this.getActiveGradeClasses(schoolYearId);
      return schoolClasses.reduce((r, c) => r + c.maxSize, 0);
    },
    async hasActiveGradeClassesIn(schoolYearId) {
      const count = await sequelize.models.SchoolClass.count({
        include: [{
          model: Grade, as: 'grade', where: { id: this.id },
        }, {
          model: sequelize.models.SchoolClassActiveFlag,
          as: 'schoolClassActiveFlags',
          where: { active: true, school_year_id: schoolYearId },
        }],
      });
      return count > 0;
    },
    async getStudentCount(schoolYearId) {
      return sequelize.models.StudentClassAssignment.count({
        where: { schoolYearId, gradeId: this.id },
      });
    },
    async gradeFull(schoolYearId) {
      const allowedStudentCount = await this.getAllowedMaxStudentCount(schoolYearId);
      const studentCount = await this.getStudentCount(schoolYearId);
      return studentCount >= allowedStudentCount;
    },
    async findAvailableSchoolClassTypes(schoolYearId) {
      const schoolClasses = await this.getActiveGradeClasses(schoolYearId);
      const classTypes = Array.from(new Set(schoolClasses.map((s) => s.schoolClassType))).sort();
      const filtered = classTypes.filter((c) => c !== 'EC');
      return classTypes.length === filtered.length ? filtered : filtered.concat('EC');
    },
    async getActiveGradeClasses(schoolYearId) {
      return sequelize.models.SchoolClass.findAll({
        include: [{
          model: Grade, as: 'grade', where: { id: this.id },
        }, {
          model: sequelize.models.SchoolClassActiveFlag,
          as: 'schoolClassActiveFlags',
          where: { active: true, school_year_id: schoolYearId },
        }],
      });
    },
    async fullFor(schoolYearId, schoolClassType) {
      const classes = await this.getActiveGradeClasses(schoolYearId);
      const filteredClasses = classes.filter((c) => c.schoolClassType === schoolClassType);
      const maxAllowed = filteredClasses.reduce((r, c) => r + c.maxSize, 0);
      const assignStudentCount = await sequelize.models.StudentClassAssignment.count({
        where: { schoolYearId, schoolClassId: { [Sequelize.Op.in]: filteredClasses.map((c) => c.id) } },
      });

      let sql = 'SELECT COUNT(*) FROM student_class_assignments sca, registration_preferences rp';
      sql += ` WHERE sca.school_year_id = ${schoolYearId}`;
      sql += ` AND sca.grade_id = ${this.id}`;
      sql += ' AND sca.school_class_id IS NULL AND sca.student_id = rp.student_id';
      sql += ` AND rp.school_year_id = ${schoolYearId}`;
      sql += ` AND rp.school_class_type = '${schoolClassType}'`;
      const [result] = await sequelize.query(sql);
      const unassignStudentCount = result[0].count;

      return assignStudentCount + unassignStudentCount >= maxAllowed;
    },
    gradePreschool() {
      return this.shortName === 'Pre';
    },
  });

  /* Non-prototype */
  Object.assign(Grade, {
    async snapDownToFirstActiveGrade(gradeId, schoolYearId) {
      const fn = async (gid) => {
        const grade = await Grade.findOne({
          where: { id: gid },
          include: [{ model: Grade, as: 'previousGrade' }],
        });
        const b = await grade.hasActiveGradeClassesIn(schoolYearId);
        if (b) {
          return grade;
        }
        return grade.previousGrade && fn(grade.previousGrade.id);
      };
      return fn(gradeId);
    },
    async findBySchoolAge(schoolAge) {
      if (schoolAge < 4) {
        return null;
      }
      let grade = await Grade.findOne({ where: { shortName: 'Pre' } });
      let count = schoolAge - 4;
      const fn = async () => {
        if (count > 0) {
          grade = await Grade.findOne({ where: { id: grade.next_grade } });
          count -= 1;
        }
        return count > 0 && grade !== null ? fn() : grade;
      };
      return fn();
    },
  });

  return Grade;
};
