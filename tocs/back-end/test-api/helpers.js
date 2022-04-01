import Chance from "chance";
import { randPerson } from "../src/utils/utilities";
import db from "../src/models/index";

const { User } = db;

export const TEST_API_BASE_URL = "http://localhost:3001";

const chance = new Chance();

export const createRandomUser = () => {
  const user = { username: chance.string({ alpha: true, numeric: true }) };
  user.person = randPerson();
  User.prototype.setPassword.call(user, chance.string({ length: 8 }));
  return user;
};
