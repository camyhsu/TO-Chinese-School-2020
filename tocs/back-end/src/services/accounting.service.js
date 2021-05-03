import Sequelize from 'sequelize';
import db from '../models/index.js';

const { Op } = Sequelize;
const {
  Instructor, SchoolClass, SchoolClassActiveFlag, SchoolYear, InstructorAssignment,
} = db;

export default {
  getInstructorDiscounts: async () => {
    const currentSchoolYear = await SchoolYear.currentSchoolYear();
    const instructorAssignments = await InstructorAssignment.findAll({
      where: {
        role: {
          [Op.in]: [
            InstructorAssignment.prototype.roleNames.ROLE_PRIMARY_INSTRUCTOR,
            InstructorAssignment.prototype.roleNames.ROLE_SECONDARY_INSTRUCTOR,
          ],
        },
        schoolYearId: currentSchoolYear.id,
      },
      include: [
        {
          model: SchoolClass,
          as: 'schoolClass',
          include: [
            {
              model: SchoolClassActiveFlag,
              where: {
                schoolYearId: currentSchoolYear.id,
                active: true,
              },
              as: 'schoolClassActiveFlags',
            },
          ],
        },
        { model: Instructor, as: 'instructor' },
      ],
      order: [['schoolClass', 'englishName', 'asc']],
    });
    if (instructorAssignments) {
      const promises = instructorAssignments.map(async (instructorAssignment) => {
        const { instructor } = instructorAssignment;
        if (instructor) {
          const children = await instructor.findChildren();
          instructor.dataValues.children = children;
          instructor.dataValues.discount = Math.min(2, children.length) * 60;
        }
        return instructor;
      });
      await Promise.all(promises);
    }
    return instructorAssignments;
  },
};
