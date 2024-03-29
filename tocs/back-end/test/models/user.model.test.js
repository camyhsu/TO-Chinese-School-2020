import { modelTests, testRole } from "./model-test-utils";
import { randAddress, randPerson, randUser } from "../../src/utils/utilities";
import db from "../../src/models/index";

const { Address, Role, User } = db;

const testPassword = "123456";
const diffPassword = "678901";

const createRandUser = () => {
  const user = randUser();
  user.person = randPerson();
  User.prototype.setPassword.call(user, testPassword);
  return user;
};

describe("Test User", () => {
  describe(
    "User - CRUD",
    modelTests(User, {
      fieldToTest: "username",
      object: createRandUser(),
      createOptions: {
        include: [
          {
            association: User.Person,
          },
        ],
      },
    })
  );

  describe("passwordCorrect", () => {
    it("passwordCorrect", async () => {
      const user = await User.createWith(createRandUser());
      expect(user.passwordCorrect(testPassword)).toBe(true);
      expect(user.passwordCorrect(diffPassword)).toBe(false);
    });
  });

  describe("setPassword", () => {
    it("setPassword", async () => {
      const user = await User.createWith(createRandUser());
      const originalHash = user.passwordHash;
      const originalSalt = user.passwordSalt;

      user.setPassword(diffPassword);
      const updatedHash = user.passwordHash;
      const updatedSalt = user.passwordSalt;

      expect(updatedHash).not.toBe(originalHash);
      expect(updatedSalt).not.toBe(originalSalt);

      await user.save();

      const retrivied = await User.getById(user.id);
      expect(retrivied.passwordHash).toBe(updatedHash);
      expect(retrivied.passwordSalt).toBe(updatedSalt);
    });
  });

  describe("authorized", () => {
    it("authorized", async () => {
      const user = await User.createWith(createRandUser());
      expect(await user.authorized(testRole.controller, testRole.action)).toBe(
        false
      );
      const role = await Role.findFirstBy({ name: testRole.roleName });
      await user.addRole(role);
      expect(await user.authorized(testRole.controller, testRole.action)).toBe(
        true
      );
    });
  });

  describe("authenticate", () => {
    it("authenticate", async () => {
      const user = await User.createWith(createRandUser());
      expect(await User.authenticate(user.username, diffPassword)).toBe(false);
      expect(await User.authenticate(user.username, testPassword)).toBe(true);
      expect(await User.authenticate(`${user.username}x`, testPassword)).toBe(
        false
      );
    });
  });

  describe("userNameAlreadyExists", () => {
    it("userNameAlreadyExists", async () => {
      const user = createRandUser();
      expect(await User.userNameAlreadyExists(user.username)).toBe(false);
      await User.createWith(user);
      expect(await User.userNameAlreadyExists(user.username)).toBe(true);
    });
  });

  describe("hasRole", () => {
    it("hasRole", async () => {
      const user = await User.createWith(createRandUser());
      expect(await user.hasRole(testRole.roleName)).toBe(false);
      const role = await Role.findFirstBy({ name: testRole.roleName });
      await user.addRole(role);
      expect(await user.hasRole(testRole.roleName)).toBe(true);
    });
  });

  describe("with person and address", () => {
    it("with person and address", async () => {
      let user = createRandUser();
      user.person.address = randAddress();
      user = await User.createWith(user);
      expect(user.person.address.id).toBeGreaterThan(0);
      const address = await Address.getById(user.person.address.id);
      Object.keys(user.person.address).forEach((key) =>
        expect(address[key]).toBe(address[key])
      );
    });
  });
});
