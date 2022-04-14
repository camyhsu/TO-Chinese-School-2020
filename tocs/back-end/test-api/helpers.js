import Chance from "chance";
import { randPerson } from "../src/utils/utilities";
import db from "../src/models/index";

const { User } = db;

export const TEST_API_BASE_URL = "http://localhost:3001";

export const chance = new Chance();

export const createRandomUsername = () =>
  chance.string({ alpha: true, numeric: true });

export const createRandomPassword = () => chance.string({ length: 8 });

export const createRandomPersonFull = () => ({
  firstName: chance.first(),
  lastName: chance.last(),
  chineseName: "假名字",
  nativeLanguage: chance.pickone(["Mandarin", "English", "Cantonese", "Other"]),
  gender: chance.pickone(["F", "M", "O"]),
  birthMonth: chance.month({ raw: true }).numeric,
  birthYear: chance.year({ min: 1901, max: 2022 }),
});

export const createRandomUser = (personData = randPerson()) => {
  const user = { username: createRandomUsername() };
  user.person = personData;
  User.prototype.setPassword.call(user, createRandomPassword());
  return user;
};
