import jwt from "jsonwebtoken";
import config from "config";
import db from "../models/index.js";
import { loginError } from "../utils/response-factory.js";

const authSecret = config.get("authSecret");
const { Family, User, Role } = db;
const { roleNames } = Role.prototype;

export default {
  signIn: async ({ username, password }) => {
    const user = await User.findFirstBy({ username });
    if (!user || !user.passwordCorrect(password)) {
      let msg = "Invalid username / password combination - ";
      msg += `For technical support, please email ${
        config.get("contacts").webSiteSupport
      }`;
      throw loginError(msg);
    }

    // 24 hours
    const accessToken = jwt.sign(
      { id: user.id, pid: user.personId },
      authSecret,
      { expiresIn: 86400 }
    );
    const roles = await user.getRoles();
    return {
      username: user.username,
      userId: user.id,
      roles: roles.map((role) => role.name),
      accessToken,
    };
  },
  signUp: async ({
    username,
    email,
    password,
    firstName,
    lastName,
    gender,
    street,
    city,
    state,
    zipcode,
    homePhone,
    cellPhone,
  }) => {
    const family = await Family.createWith({
      parentOne: { firstName, lastName, gender },
      address: {
        street,
        city,
        state,
        email,
        zipcode,
        homePhone,
        cellPhone,
      },
    });
    const user = User.build({ username });
    user.setPassword(password);
    await user.save();
    await user.setPerson(family.parentOne.id);
    const role = await Role.findFirstBy({
      name: roleNames.ROLE_NAME_STUDENT_PARENT,
    });
    await user.addRole(role);
  },
};
