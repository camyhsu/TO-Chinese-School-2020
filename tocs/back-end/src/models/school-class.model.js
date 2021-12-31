export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: [
      "description",
      "location",
      ["shortName", "short_name"],
      ["schoolClassType", "school_class_type", true],
    ],
  });
  const SchoolClass = sequelize.define(
    "school_class",
    {
      ...fields,
      englishName: {
        type: Sequelize.STRING,
        field: "english_name",
        unique: true,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      chineseName: {
        type: Sequelize.STRING,
        field: "chinese_name",
        unique: true,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      maxSize: {
        type: Sequelize.INTEGER,
        field: "max_size",
        allowNull: false,
        validate: { min: 1 },
      },
      minAge: {
        type: Sequelize.INTEGER,
        field: "min_age",
        validate: { min: 0 },
      },
      maxAge: {
        type: Sequelize.INTEGER,
        field: "max_age",
        validate: { min: 0 },
      },
    },
    {
      validate: {},
    }
  );

  /* Prototype */
  Object.assign(SchoolClass.prototype, {
    schoolClassTypes: {
      SCHOOL_CLASS_TYPE_ELECTIVE: "ELECTIVE",
      SCHOOL_CLASS_TYPE_ENGLISH_INSTRUCTION: "SE",
      SCHOOL_CLASS_TYPE_MIXED: "M",
      SCHOOL_CLASS_TYPE_SIMPLIFIED: "S",
      SCHOOL_CLASS_TYPE_TRADITIONAL: "T",
      SCHOOL_CLASS_TYPE_EVERYDAYCHINESE: "EC",
    },
    name() {
      return `${this.chineseName}(${this.englishName})`;
    },
    elective() {
      return (
        this.schoolClassType ===
        this.schoolClassTypes.SCHOOL_CLASS_TYPE_ELECTIVE
      );
    },
    async activeIn(schoolYearId) {
      const schoolClassActiveFlags = await this.getSchoolClassActiveFlags({
        include: [
          {
            model: sequelize.models.SchoolYear,
            where: { id: schoolYearId },
            as: "schoolYear",
          },
        ],
      });
      return (
        (schoolClassActiveFlags &&
          schoolClassActiveFlags.length &&
          !!schoolClassActiveFlags[0].active) ||
        false
      );
    },
    async flipActiveTo(schoolYearId, active) {
      const schoolClassActiveFlags = await this.getSchoolClassActiveFlags({
        include: [
          {
            model: sequelize.models.SchoolYear,
            where: { id: schoolYearId },
            as: "schoolYear",
          },
        ],
      });
      if (schoolClassActiveFlags && schoolClassActiveFlags.length) {
        schoolClassActiveFlags[0].active = active;
        await schoolClassActiveFlags[0].save();
      } else {
        const s = await sequelize.models.SchoolClassActiveFlag.create({
          active,
        });
        s.setSchoolClass(this.id);
        s.setSchoolYear(schoolYearId);
      }
    },
    async instructorAssignments(_schoolYearId) {
      let schoolYearId = _schoolYearId;
      if (!_schoolYearId) {
        const currentSchoolYear =
          await sequelize.models.SchoolYear.currentSchoolYear();
        schoolYearId = currentSchoolYear.id;
      }
      const instructorAssignments =
        await sequelize.models.InstructorAssignment.findAll({
          where: {
            schoolYearId,
            schoolClassId: this.id,
          },
          include: [
            {
              model: sequelize.models.Instructor,
              as: "instructor",
              include: [{ model: sequelize.models.Address, as: "address" }],
            },
          ],
        });
      return instructorAssignments.reduce((r, c) => {
        const { role } = c;
        if (!r[role]) {
          Object.assign(r, { [role]: [] });
        }
        r[role].push(c);
        return r;
      }, {});
    },
    async getClassSize(schoolYearId) {
      const key = this.elective() ? "elective_class_id" : "school_class_id";
      return sequelize.models.StudentClassAssignment.count({
        where: { schoolYearId, [key]: this.id },
      });
    },
    async studentClassAssignments(schoolYearId) {
      const key = this.elective() ? "elective_class_id" : "school_class_id";
      const studentClassAssignments =
        await await sequelize.models.StudentClassAssignment.findAll({
          where: {
            school_year_id: schoolYearId,
            [key]: this.id,
          },
          include: [
            { model: sequelize.models.Student, as: "student" },
            { model: sequelize.models.SchoolClass, as: "schoolClass" },
          ],
          order: [
            [
              { model: sequelize.models.Student, as: "student" },
              "lastName",
              "asc",
            ],
            [
              { model: sequelize.models.Student, as: "student" },
              "firstName",
              "asc",
            ],
          ],
        });
      return studentClassAssignments || [];
    },
  });

  /* Non-prototype */
  Object.assign(SchoolClass, {
    async getActiveSchoolClasses(_schoolYearId, criteria) {
      let schoolYearId = _schoolYearId;
      if (!_schoolYearId) {
        const currentSchoolYear =
          await sequelize.models.SchoolYear.currentSchoolYear();
        schoolYearId = currentSchoolYear.id;
      }

      const options = {
        include: [
          {
            model: sequelize.models.SchoolClassActiveFlag,
            where: {
              schoolYearId,
              active: true,
            },
            as: "schoolClassActiveFlags",
          },
        ],
        order: [["chineseName", "ASC"]],
      };

      if (criteria) {
        Object.assign(options, { where: criteria });
      }

      const schoolClasses = await SchoolClass.findAll(options);

      const promises = schoolClasses.map(async (sc) => {
        const instructorAssignments = await sc.instructorAssignments(
          schoolYearId
        );
        Object.assign(sc.dataValues, { instructorAssignments });
        return sc;
      });
      await Promise.all(promises);
      return schoolClasses;
    },
    async getElectiveSchoolClass(schoolYearId) {
      return SchoolClass.getActiveSchoolClasses(schoolYearId, {
        schoolClassType:
          SchoolClass.prototype.schoolClassTypes.SCHOOL_CLASS_TYPE_ELECTIVE,
      });
    },
    async getNonElectiveSchoolClass(schoolYearId) {
      return SchoolClass.getActiveSchoolClasses(schoolYearId, {
        [Sequelize.Op.not]: {
          schoolClassType:
            SchoolClass.prototype.schoolClassTypes.SCHOOL_CLASS_TYPE_ELECTIVE,
        },
      });
    },
    async getActiveSchoolClassesForCurrentNextSchoolYear() {
      const currentSchoolYear =
        await sequelize.models.SchoolYear.currentSchoolYear();
      const nextSchoolYear = await sequelize.models.SchoolYear.nextSchoolYear();
      const schoolClassActiveFlags =
        await sequelize.models.SchoolClassActiveFlag.findAll({
          where: { active: true },
          include: [
            {
              model: sequelize.models.SchoolYear,
              where: {
                id: {
                  [Sequelize.Op.in]: [currentSchoolYear.id, nextSchoolYear.id],
                },
              },
              as: "schoolYear",
            },
          ],
        });
      const r = {
        currentSchoolYear: {
          id: currentSchoolYear.id,
          name: currentSchoolYear.name,
          classes: [],
        },
      };
      if (nextSchoolYear) {
        r.nextSchoolYear = {
          id: nextSchoolYear.id,
          name: nextSchoolYear.name,
          classes: [],
        };
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
    async getActiveSchoolClassesForCurrentAndFutureSchoolYears() {
      const schoolYears =
        await sequelize.models.SchoolYear.findCurrentAndFutureSchoolYears();
      const schoolClassActiveFlags =
        await sequelize.models.SchoolClassActiveFlag.findAll({
          where: { active: true },
          include: [
            {
              model: sequelize.models.SchoolYear,
              where: {
                id: {
                  [Sequelize.Op.in]: schoolYears.map(
                    (schoolYear) => schoolYear.id
                  ),
                },
              },
              as: "schoolYear",
            },
            { model: sequelize.models.SchoolClass, as: "schoolClass" },
          ],
        });
      const schoolClasses = schoolClassActiveFlags.map(
        (schoolClassActiveFlag) => schoolClassActiveFlag.schoolClass
      );
      return Object.values(
        schoolClasses.reduce((r, c) => Object.assign(r, { [c.id]: c }), {})
      ).sort((a, b) => a.englishName.localeCompare(b.englishName));
    },
    getSchoolClassTypeName(schoolClassType) {
      switch (schoolClassType) {
        case SchoolClass.prototype.schoolClassTypes
          .SCHOOL_CLASS_TYPE_SIMPLIFIED:
          return "S(簡)";
        case SchoolClass.prototype.schoolClassTypes
          .SCHOOL_CLASS_TYPE_TRADITIONAL:
          return "T(繁)";
        case SchoolClass.prototype.schoolClassTypes
          .SCHOOL_CLASS_TYPE_ENGLISH_INSTRUCTION:
          return "SE(雙語)";
        case SchoolClass.prototype.schoolClassTypes
          .SCHOOL_CLASS_TYPE_EVERYDAYCHINESE:
          return "EC(實用中文)";
        default:
          return schoolClassType;
      }
    },
  });

  return SchoolClass;
};
