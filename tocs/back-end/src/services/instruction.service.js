import Sequelize from "sequelize";
import db from "../models/index";

const { Op } = Sequelize;

const { SchoolClass, SchoolYear } = db;

export default {
  getSchoolClass: async (id, schoolYearId) => {
    const schoolClass = await SchoolClass.getById(id);
    const schoolYear = await SchoolYear.getById(schoolYearId);
    const instructorAssignments = await schoolClass.instructorAssignments(
      schoolYearId
    );
    const studentClassAssignments = await schoolClass.studentClassAssignments(
      schoolYearId
    );
    const promises = studentClassAssignments.map(
      async (studentClassAssignment) => {
        const families = await studentClassAssignment.student.families();
        if (families && families.length) {
          const family = families[0];
          Object.assign(studentClassAssignment.student.dataValues, { family });
        }
      }
    );
    await Promise.all(promises);
    return {
      schoolClass,
      schoolYear,
      studentClassAssignments,
      instructorAssignments,
    };
  },
};
