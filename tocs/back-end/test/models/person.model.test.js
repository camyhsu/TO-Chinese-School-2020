/* global describe, it */
import db from "../../src/models/index.js";
import { modelTests } from "./model-test-utils.js";
import {
  randAddress,
  randPerson,
  createRandSchoolYear,
} from "../../src/utils/utilities.js";

const { Person, Address, Family, SchoolYear, StudentStatusFlag } = db;
const testChineseName = "黄鹤楼";

const createRandPerson = (options) => {
  const person = randPerson();
  return { ...person, ...options };
};

describe("Test Person", () => {
  describe(
    "UPersonser - CRUD",
    modelTests(Person, { fieldToTest: "lastName", object: createRandPerson() })
  );

  describe("People", () => {
    it("englishName", async () => {
      const person = await Person.create(createRandPerson());
      expect(person.englishName()).toBe(`${person.firstName} ${person.lastName}`);
    });

    it("name", async () => {
      const person = await Person.create(
        createRandPerson({ chineseName: testChineseName })
      );
      expect(person.name()).toBe(`${testChineseName}(${person.firstName} ${person.lastName})`);
    });

    it("birthInfo", async () => {
      const birthYear = 2000;
      const birthMonth = 8;
      expect((await Person.create(createRandPerson())).birthInfo()).toBe("");
      expect(
        (await Person.create(createRandPerson({ birthYear }))).birthInfo()
      ).toBe("");
      expect(
        (await Person.create(createRandPerson({ birthMonth }))).birthInfo()
      ).toBe("");
      expect(
        (
          await Person.create(createRandPerson({ birthYear, birthMonth }))
        ).birthInfo()
      ).toBe("8/2000");
    });

    it("baselineMonths", async () => {
      expect(Person.baselineMonths(0, 0)).toBe(0);
      expect(Person.baselineMonths(0, 1)).toBe(1);
      expect(Person.baselineMonths(1, 0)).toBe(12);
      expect(Person.baselineMonths(1, 1)).toBe(13);
    });

    it("address", async () => {
      let person = createRandPerson();
      person.address = randAddress();
      person = await Person.createWith(person);
      expect(person.address.id).toBeGreaterThan(0);
      const address = await Address.getById(person.address.id);
      Object.keys(person.address).forEach((key) =>
        expect(address[key]).toBe(address[key])
      );
    });

    it("findFamiliesAsParent", async () => {
      const originalLength = await Family.count();
      const person = await Person.createWith(createRandPerson());

      const family1 = await Family.create();
      await family1.setParentOne(person.id);

      const family2 = await Family.create();
      await family2.setParentTwo(person.id);

      await Family.create({ parentOne: createRandPerson() });

      expect(await Family.count()).toBe(originalLength + 3);

      let families = await person.findFamiliesAsParent();
      expect(families.length).toBe(2);
      expect((await family1.getParentOne()).id).toBe(person.id);
      expect((await family2.getParentTwo()).id).toBe(person.id);

      families = await person.families();
      expect(families.length).toBe(2);
    });

    it("findFamiliesAsChild", async () => {
      const originalLength = await Family.count();
      const person = await Person.createWith(createRandPerson());

      const family1 = await Family.create();
      await family1.addChildren(person.id);

      await Family.create({ parentOne: createRandPerson() });

      expect(await Family.count()).toBe(originalLength + 2);

      let families = await person.findFamiliesAsChild();
      expect(families.length).toBe(1);
      const child = (await families[0].getChildren())[0];
      expect(child.id).toBe(person.id);

      families = await person.families();
      expect(families.length).toBe(1);
    });

    it("families", async () => {
      const originalLength = await Family.count();
      const person = await Person.createWith(createRandPerson());

      const family0 = await Family.create();
      await family0.addChildren(person.id);

      const family1 = await Family.create();
      await family1.setParentOne(person.id);

      const family2 = await Family.create();
      await family2.setParentTwo(person.id);

      expect(await Family.count()).toBe(originalLength + 3);

      let families = await person.findFamiliesAsChild();
      expect(families.length).toBe(1);
      families = await person.findFamiliesAsParent();
      expect(families.length).toBe(2);

      families = await person.families();
      expect(families.length).toBe(3);
    });

    it("isAParentOf", async () => {
      const person = await Person.createWith(createRandPerson());
      const family1 = await Family.create();
      await family1.setParentOne(person.id);

      const child = await Person.createWith(createRandPerson());
      expect(await person.isAParentOf(child.id)).toBe(false);

      await family1.addChildren(child.id);
      expect(await person.isAParentOf(child.id)).toBe(true);
    });
  });

  describe("isStudentRegisteredForSchoolYear", () => {
    it("isStudentRegisteredForSchoolYear", async () => {
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const student = await Person.create(randPerson());
      let bool = await student.isStudentRegisteredForSchoolYear(schoolYear.id);
      expect(bool).toBe(false);

      await StudentStatusFlag.create({
        studentId: student.id,
        schoolYearId: schoolYear.id,
        registered: true,
      });
      bool = await student.isStudentRegisteredForSchoolYear(schoolYear.id);
      expect(bool).toBe(true);
    });
  });

  describe("findPaidStudentFeePaymentAsStudentFor", () => {
    it("findPaidStudentFeePaymentAsStudentFor", async () => {
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const student = await Person.create(randPerson());
      const studentFeePayments =
        await student.findPaidStudentFeePaymentAsStudentFor(schoolYear.id);
      expect(studentFeePayments.length).toBe(0);
    });
  });
});
