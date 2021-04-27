export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: [
      'description', 'location', ['shortName', 'short_name'], ['schoolClassType', 'school_class_type', true],
    ],
  });
  const SchoolClass = sequelize.define('school_class', {
    ...fields,
    englishName: {
      type: Sequelize.STRING,
      field: 'english_name',
      unique: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    chineseName: {
      type: Sequelize.STRING,
      field: 'chinese_name',
      unique: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    maxSize: {
      type: Sequelize.INTEGER,
      field: 'max_size',
      allowNull: false,
      validate: { min: 1 },
    },
    minAge: {
      type: Sequelize.INTEGER,
      field: 'min_age',
      validate: { min: 0 },
    },
    maxAge: {
      type: Sequelize.INTEGER,
      field: 'max_age',
      validate: { min: 0 },
    },
  }, {
    validate: {

    },
  });

  /* Prototype */
  Object.assign(SchoolClass.prototype, {
    schoolClassTypes: {
      SCHOOL_CLASS_TYPE_ELECTIVE: 'ELECTIVE',
      SCHOOL_CLASS_TYPE_ENGLISH_INSTRUCTION: 'SE',
      SCHOOL_CLASS_TYPE_MIXED: 'M',
      SCHOOL_CLASS_TYPE_SIMPLIFIED: 'S',
      SCHOOL_CLASS_TYPE_TRADITIONAL: 'T',
      SCHOOL_CLASS_TYPE_EVERYDAYCHINESE: 'EC',
    },
    name() {
      return `${this.chineseName}(${this.englishName})`;
    },
    elective() {
      return this.schoolClassType === this.schoolClassTypes.SCHOOL_CLASS_TYPE_ELECTIVE;
    },
    async activeIn(schoolYearId) {
      const schoolClassActiveFlags = await this.getSchoolClassActiveFlags({
        include: [
          { model: sequelize.models.SchoolYear, where: { id: schoolYearId }, as: 'schoolYear' },
        ],
      });
      return (schoolClassActiveFlags && schoolClassActiveFlags.length && !!schoolClassActiveFlags[0].active) || false;
    },
    async flipActiveTo(schoolYearId, active) {
      const schoolClassActiveFlags = await this.getSchoolClassActiveFlags({
        include: [
          { model: sequelize.models.SchoolYear, where: { id: schoolYearId }, as: 'schoolYear' },
        ],
      });
      if (schoolClassActiveFlags && schoolClassActiveFlags.length) {
        schoolClassActiveFlags[0].active = active;
        await schoolClassActiveFlags[0].save();
      } else {
        const s = await sequelize.models.SchoolClassActiveFlag.create({ active });
        s.setSchoolClass(this.id);
        s.setSchoolYear(schoolYearId);
      }
    },
  });

  /* Non-prototype */
  Object.assign(SchoolClass, {
    async getActiveSchoolClassesForCurrentNextSchoolYear() {
      const currentSchoolYear = await sequelize.models.SchoolYear.currentSchoolYear();
      const nextSchoolYear = await sequelize.models.SchoolYear.nextSchoolYear();
      const schoolClassActiveFlags = await sequelize.models.SchoolClassActiveFlag.findAll({
        where: { active: true },
        include: [
          {
            model: sequelize.models.SchoolYear,
            where: {
              id: { [Sequelize.Op.in]: [currentSchoolYear.id, nextSchoolYear.id] },
            },
            as: 'schoolYear',
          },
        ],
      });
      const r = {
        currentSchoolYear: { id: currentSchoolYear.id, name: currentSchoolYear.name, classes: [] },
      };
      if (nextSchoolYear) {
        r.nextSchoolYear = { id: nextSchoolYear.id, name: nextSchoolYear.name, classes: [] };
      }
      schoolClassActiveFlags.forEach((s) => {
        if (s.schoolYearId === currentSchoolYear.id) {
          r.currentSchoolYear.classes.push(s.schoolClassId);
        } else {
          r.nextSchoolYear.classes.push(s.schoolClassId);
        }
      });
      return r;
    },
  });

  return SchoolClass;
};