export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });

  const Role = sequelize.define('role', {
    ...fields,
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
  });

  /* Prototype */
  Object.assign(Role.prototype, {
    roleNames: {
      ROLE_NAME_SUPER_USER: 'Super User',
      ROLE_NAME_PRINCIPAL: 'Principal',
      ROLE_NAME_ACADEMIC_VICE_PRINCIPAL: 'Academic Vice Principal',
      ROLE_NAME_REGISTRATION_OFFICER: 'Registration Officer',
      ROLE_NAME_ACCOUNTING_OFFICER: 'Accounting Officer',
      ROLE_NAME_ACTIVITY_OFFICER: 'Activity Officer',
      ROLE_NAME_COMMUNICATION_OFFICER: 'Communication Officer',
      ROLE_NAME_INSTRUCTION_OFFICER: 'Instruction Officer',
      ROLE_NAME_LIBRARIAN: 'Librarian',
      ROLE_NAME_INSTRUCTOR: 'Instructor',
      ROLE_NAME_ROOM_PARENT: 'Room Parent',
      ROLE_NAME_STUDENT_PARENT: 'Student Parent',
      ROLE_NAME_CCCA_STAFF: 'CCCA Staff',
    },
    async authorized(controller, action) {
      if (this.name === this.ROLE_NAME_SUPER_USER) {
        return true;
      }
      const rights = await this.getRights();
      return !!rights.find((right) => right.authorized(controller, action));
    },
  });

  /* Non-prototype */
  Object.assign(Role, {
    async findPeopleWithRole(name) {
      /*
      * Protect against searching for superuser
      * Not searching for student parent since that will return too many people
      */
      if (name !== this.ROLE_NAME_SUPER_USER && name !== this.ROLE_NAME_STUDENT_PARENT) {
        const roles = await Role.findAll({
          where: { name: { [Sequelize.Op.eq]: name } },
          include: [
            {
              model: sequelize.models.User,
              as: 'users',
              include: [{ model: sequelize.models.Person, as: 'person' }],
            },
          ],
        });
        const obj = {};
        roles.forEach((role) => role.users.forEach((user) => { obj[user.person.id] = user.person; }));
        return Object.values(obj);
      }

      return [];
    },
  });

  return Role;
};
