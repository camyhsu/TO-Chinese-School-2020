/* global describe, it */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import db from "../../src/models/index.js";
import { modelTests, testRole } from "./model-test-utils.js";
import { randPerson, randUser } from "../../src/utils/utilities.js";

chai.use(chaiAsPromised);
const { expect } = chai;
const { Role, User } = db;
const {
  ROLE_NAME_PRINCIPAL,
  ROLE_NAME_SUPER_USER,
  ROLE_NAME_STUDENT_PARENT,
  ROLE_NAME_CCCA_STAFF,
} = Role.prototype.roleNames;

describe("Test Role", () => {
  describe("Role - CRUD", modelTests(Role));

  describe("Roles", () => {
    it("should have roles", async () => {
      const r = await Role.count();
      expect(r).gt(0);
    });

    it("should have all roles exception Super User", async () => {
      const ps = Object.values(Role.prototype.roleNames)
        .filter((name) => name !== ROLE_NAME_SUPER_USER)
        .map(async (name) => {
          const r = await Role.findFirstBy({ name });
          expect(r.name).eq(name);
        });
      await Promise.all(ps);
    });

    it("should have many rights", async () => {
      const r = await Role.findAll({
        where: {
          name: "Student Parent",
        },
      });
      expect(r.length).eq(1);
      const roles = await r[0].getRights();
      expect(roles.length).gt(2);
    });

    it("should not create role with empty/blank name", async () => {
      const s = "Validation error";
      await expect(Role.create({ name: "" })).to.eventually.be.rejectedWith(s);
      await expect(Role.create({ name: " " })).to.eventually.be.rejectedWith(s);
    });

    it("should not create role with null name", async () => {
      const s = "notNull Violation: role.name cannot be null";
      await expect(Role.create({ name: null })).to.eventually.be.rejectedWith(
        s
      );
    });

    it("should not create role with duplicate name and delete", async () => {
      await expect(
        Role.create({ name: ROLE_NAME_STUDENT_PARENT })
      ).to.eventually.be.rejectedWith("Validation error");
    });

    it("should find Super User", async () => {
      const role = await Role.findFirstBy({ name: ROLE_NAME_SUPER_USER });
      expect(role).to.be.not.null;
    });

    it("should be able to find by role name and check authorized", async () => {
      const role = await Role.findFirstBy({ name: ROLE_NAME_PRINCIPAL });
      expect(role.id).gt(0);

      const r = await role.authorized(testRole.controller, testRole.action);
      expect(r).eq(true);
    });

    it("CCCA Staff should not have this right", async () => {
      const role = await Role.findFirstBy({ name: ROLE_NAME_CCCA_STAFF });
      expect(role.id).gt(0);

      const r = await role.authorized(testRole.controller, testRole.action);
      expect(r).eq(false);
    });

    it("find people by role", async () => {
      let people = await Role.findPeopleWithRole(ROLE_NAME_CCCA_STAFF);
      const count = people.length;
      let user = randUser();
      user.person = randPerson();
      User.prototype.setPassword.call(user, "123456");
      user = await User.createWith(user);
      const role = await Role.findFirstBy({ name: ROLE_NAME_CCCA_STAFF });
      await user.addRole(role);
      const testPerson = randPerson();
      const person = await user.createPerson(testPerson);
      people = await Role.findPeopleWithRole(ROLE_NAME_CCCA_STAFF);

      expect(people.length).eq(count + 1);
      expect(people.find((p) => p.id === person.id).lastName).eq(
        testPerson.lastName
      );
    });
  });
});
