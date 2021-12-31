import { dateBetween } from "../utils/utilities.js";

export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: ["role"],
    withDates: [
      ["startDate", "start_date", true],
      ["endDate", "end_date", true],
    ],
  });
  const InstructorAssignment = sequelize.define(
    "instructor_assignment",
    {
      ...fields,
    },
    {
      validate: {
        startEndDateOrder() {
          if (
            !this.startDate ||
            !this.endDate ||
            this.startDate > this.endDate
          ) {
            throw new Error(
              `${this.startDate} cannot be later than ${this.endDate}`
            );
          }
        },
        async noOverlapping() {
          const r = await this.findInSameSchoolYear();
          r.forEach((x) => {
            if (
              dateBetween(x.startDate, this) ||
              dateBetween(this.startDate, x)
            ) {
              throw new Error(
                `Cannot overlap with existing assignment for ${x.instructor.name()}`
              );
            }
          });
        },
      },
    }
  );

  /* Prototype */
  Object.assign(InstructorAssignment.prototype, {
    roleNames: {
      ROLE_PRIMARY_INSTRUCTOR: "Primary Instructor",
      ROLE_ROOM_PARENT: "Room Parent",
      ROLE_SECONDARY_INSTRUCTOR: "Secondary Instructor",
      ROLE_TEACHING_ASSISTANT: "Teaching Assistant",
    },
    isInstructor() {
      return (
        this.role ===
          InstructorAssignment.prototype.roleNames.ROLE_PRIMARY_INSTRUCTOR ||
        this.role ===
          InstructorAssignment.prototype.roleNames.ROLE_SECONDARY_INSTRUCTOR
      );
    },
    async findInSameSchoolYear() {
      return InstructorAssignment.findAll({
        where: {
          role: { [Sequelize.Op.eq]: this.role },
          id: { [Sequelize.Op.ne]: this.id },
        },
        include: [
          {
            model: sequelize.models.SchoolYear,
            as: "schoolYear",
            where: { id: this.schoolYearId },
          },
          {
            model: sequelize.models.SchoolClass,
            as: "schoolClass",
            where: { id: this.schoolClassId },
          },
          { model: sequelize.models.Instructor, as: "instructor" },
        ],
      });
    },
  });

  /* Non-prototype */
  Object.assign(InstructorAssignment, {
    async findInstructors(_schoolYearId) {
      let schoolYearId = _schoolYearId;
      if (!_schoolYearId) {
        const currentSchoolYear =
          await sequelize.models.SchoolYear.currentSchoolYear();
        schoolYearId = currentSchoolYear.id;
      }
      const instructorAssignments = await InstructorAssignment.findAll({
        where: {
          role: {
            [Sequelize.Op.in]: [
              InstructorAssignment.prototype.roleNames.ROLE_PRIMARY_INSTRUCTOR,
              InstructorAssignment.prototype.roleNames
                .ROLE_SECONDARY_INSTRUCTOR,
            ],
          },
        },
        include: [
          {
            model: sequelize.models.SchoolYear,
            as: "schoolYear",
            where: { id: schoolYearId },
          },
          { model: sequelize.models.Instructor, as: "instructor" },
        ],
      });
      return instructorAssignments.map((ia) => ia.instructor);
    },
  });

  return InstructorAssignment;
};
