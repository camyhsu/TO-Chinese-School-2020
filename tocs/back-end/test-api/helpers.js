import Chance from "chance";
import { randPerson } from "../src/utils/utilities";
import db from "../src/models/index";

const { User } = db;

export const TEST_API_BASE_URL = "http://localhost:3001";

export const chance = new Chance();

export const createRandomUsername = () =>
  chance.string({ alpha: true, numeric: true });

export const createRandomPassword = () => chance.string({ length: 8 });

export const createRandomUser = () => {
  const user = { username: createRandomUsername() };
  user.person = randPerson();
  User.prototype.setPassword.call(user, createRandomPassword());
  return user;
};
