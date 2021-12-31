import { randSalt, sha256Hex } from "../utils/utilities.js";

export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: ["password_hash", "password_salt"],
  });
  const User = sequelize.define(
    "user",
    {
      ...fields,
      username: {
        type: Sequelize.STRING,
        field: "username",
        unique: true,
        allowNull: false,
        validate: { notNull: true, notEmpty: true },
      },
      password: Sequelize.VIRTUAL,
      passwordHash: {
        type: Sequelize.STRING,
        field: "password_hash",
        allowNull: false,
        validate: { notNull: true, notEmpty: true },
      },
      passwordSalt: {
        type: Sequelize.STRING,
        field: "password_salt",
        allowNull: false,
        validate: { notNull: true, notEmpty: true },
      },
    },
    {
      validate: {
        validatePassword() {
          // Only validates password when exist. If not, record will be validated by hash and salt.
          if (this.password && this.password.length < 6) {
            throw new Error("password must be 6 characters or longer");
          }
        },
      },
    }
  );

  /* Prototype */
  Object.assign(User.prototype, {
    passwordCorrect(passwd) {
      return sha256Hex(passwd, this.passwordSalt) === this.passwordHash;
    },
    setPassword(passwd) {
      if (passwd) {
        this.password = passwd;
        this.passwordSalt = randSalt();
        this.passwordHash = sha256Hex(passwd, this.passwordSalt);
      }
    },
    async authorized(controller, action) {
      const roles = await this.getRoles();
      return !!roles.find((role) => role.authorized(controller, action));
    },
    async hasRole(roleName) {
      const roles = await this.getRoles();
      return !!roles.find((role) => role.name === roleName);
    },
    async adjustInstructorRoles() {
      // TODO Not yet implemented
    },
  });

  /* Non-prototype */
  Object.assign(User, {
    createWith: async (obj) =>
      User.create(obj, {
        include: [{ association: User.Person, include: [User.PersonAddress] }],
      }),
    authenticate: async function authenticate(username, passwd) {
      const user = await User.findFirstBy({ username });
      return !!(user && user.passwordCorrect(passwd));
    },
    userNameAlreadyExists: async (username) =>
      !!(await User.findFirstBy({ username })),
  });

  return User;
};
