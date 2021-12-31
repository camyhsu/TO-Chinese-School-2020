/* global describe, it */
import { expect } from "chai";
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
      expect(person.englishName()).eq(`${person.firstName} ${person.lastName}`);
    });

    it("name", async () => {
      const person = await Person.create(
        createRandPerson({ chineseName: testChineseName })
      );
      expect(person.name()).eq(
        `${testChineseName}(${person.firstName} ${person.lastName})`
      );
    });

    it("birthInfo", async () => {
      const birthYear = 2000;
      const birthMonth = 8;
      expect((await Person.create(createRandPerson())).birthInfo()).eq("");
      expect(
        (await Person.create(createRandPerson({ birthYear }))).birthInfo()
      ).eq("");
      expect(
        (await Person.create(createRandPerson({ birthMonth }))).birthInfo()
      ).eq("");
      expect(
        (
          await Person.create(createRandPerson({ birthYear, birthMonth }))
        ).birthInfo()
      ).eq("8/2000");
    });

    it("baselineMonths", async () => {
      expect(Person.baselineMonths(0, 0)).eq(0);
      expect(Person.baselineMonths(0, 1)).eq(1);
      expect(Person.baselineMonths(1, 0)).eq(12);
      expect(Person.baselineMonths(1, 1)).eq(13);
    });

    it("address", async () => {
      let person = createRandPerson();
      person.address = randAddress();
      person = await Person.createWith(person);
      expect(person.address.id).gt(0);
      const address = await Address.getById(person.address.id);
      Object.keys(person.address).forEach((key) =>
        expect(address[key]).eq(address[key])
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

      expect(await Family.count()).eq(originalLength + 3);

      let families = await person.findFamiliesAsParent();
      expect(families.length).eq(2);
      expect((await family1.getParentOne()).id).eq(person.id);
      expect((await family2.getParentTwo()).id).eq(person.id);

      families = await person.families();
      expect(families.length).eq(2);
    });

    it("findFamiliesAsChild", async () => {
      const originalLength = await Family.count();
      const person = await Person.createWith(createRandPerson());

      const family1 = await Family.create();
      await family1.addChildren(person.id);

      await Family.create({ parentOne: createRandPerson() });

      expect(await Family.count()).eq(originalLength + 2);

      let families = await person.findFamiliesAsChild();
      expect(families.length).eq(1);
      const child = (await families[0].getChildren())[0];
      expect(child.id).eq(person.id);

      families = await person.families();
      expect(families.length).eq(1);
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

      expect(await Family.count()).eq(originalLength + 3);

      let families = await person.findFamiliesAsChild();
      expect(families.length).eq(1);
      families = await person.findFamiliesAsParent();
      expect(families.length).eq(2);

      families = await person.families();
      expect(families.length).eq(3);
    });

    it("isAParentOf", async () => {
      const person = await Person.createWith(createRandPerson());
      const family1 = await Family.create();
      await family1.setParentOne(person.id);

      const child = await Person.createWith(createRandPerson());
      expect(await person.isAParentOf(child.id)).to.eq(false);

      await family1.addChildren(child.id);
      expect(await person.isAParentOf(child.id)).to.eq(true);
    });
  });

  describe("isStudentRegisteredForSchoolYear", () => {
    it("isStudentRegisteredForSchoolYear", async () => {
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const student = await Person.create(randPerson());
      let bool = await student.isStudentRegisteredForSchoolYear(schoolYear.id);
      expect(bool).to.be.false;

      await StudentStatusFlag.create({
        studentId: student.id,
        schoolYearId: schoolYear.id,
        registered: true,
      });
      bool = await student.isStudentRegisteredForSchoolYear(schoolYear.id);
      expect(bool).to.be.true;
    });
  });

  describe("findPaidStudentFeePaymentAsStudentFor", () => {
    it("findPaidStudentFeePaymentAsStudentFor", async () => {
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const student = await Person.create(randPerson());
      const studentFeePayments =
        await student.findPaidStudentFeePaymentAsStudentFor(schoolYear.id);
      expect(studentFeePayments.length).to.eq(0);
    });
  });
});
