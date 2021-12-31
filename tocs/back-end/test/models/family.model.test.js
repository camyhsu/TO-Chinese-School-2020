/* global describe, it */
import { expect } from "chai";
import db from "../../src/models/index.js";
import {
  randString,
  randAddress,
  randPerson,
  createRandSchoolYear,
} from "../../src/utils/utilities.js";

const {
  Address,
  Family,
  InstructorAssignment,
  Person,
  SchoolYear,
  StaffAssignment,
} = db;

const createRandFamily = async () => {
  const originalLength = await Family.count();
  const parentOne = randPerson();
  const family = await Family.createWith({ parentOne });
  expect(await Family.count()).eq(originalLength + 1);
  return family;
};

describe("Test Family", () => {
  describe("Families", () => {
    it("should have parentOne", async () => {
      const originalLength = await Family.count();
      const parentOne = randPerson();
      const family = await Family.createWith({ parentOne });
      expect(await Family.count()).eq(originalLength + 1);
      expect(family.parentOne.englishName()).eq(
        Person.prototype.englishName.call(parentOne)
      );
    });

    it("should have parentOne and parentTwo", async () => {
      const originalLength = await Family.count();
      const parentOne = randPerson();
      const parentTwo = randPerson();
      const family = await Family.createWith({ parentOne, parentTwo });
      expect(await Family.count()).eq(originalLength + 1);
      expect(family.parentOne.englishName()).eq(
        Person.prototype.englishName.call(parentOne)
      );
      expect(family.parentTwo.englishName()).eq(
        Person.prototype.englishName.call(parentTwo)
      );

      expect(await family.isParentOne(null)).eq(false);
      expect(await family.isParentOne(family.parentOne)).eq(true);
      expect(await family.isParentOne(family.parentTwo)).eq(false);

      expect(await family.isParentTwo(null)).eq(false);
      expect(await family.isParentTwo(family.parentOne)).eq(false);
      expect(await family.isParentTwo(family.parentTwo)).eq(true);
    });

    it("should have parentOne and address", async () => {
      const originalLength = await Family.count();
      const parentOne = randPerson();
      const address = randAddress();
      const family = await Family.createWith({ parentOne, address });
      expect(await Family.count()).eq(originalLength + 1);
      expect(family.parentOne.englishName()).eq(
        Person.prototype.englishName.call(parentOne)
      );
      expect(family.address.streetAddress()).eq(
        Address.prototype.streetAddress.call(address)
      );
    });

    it("should have children", async () => {
      const family = await createRandFamily();
      let children = await family.getChildren();
      expect(children.length).eq(0);
      const child = await Person.create(randPerson());
      await family.addChild(child.id);
      children = await family.getChildren();
      expect(children.length).eq(1);
      const savedChild = children[0];
      expect(savedChild.name()).eq(child.name());
    });

    it("childrenNames", async () => {
      const family = await createRandFamily();
      expect(await family.childrenNames()).to.be.empty;

      const child1 = await Person.create(randPerson());
      const child2 = await Person.create(randPerson());
      await family.addChildren([child1.id, child2.id]);
      expect(await family.childrenNames()).eql([child1.name(), child2.name()]);
    });
  });

  describe("getFamilyMemberIds", () => {
    it("getFamilyMemberIds - One parent", async () => {
      const parentOne = randPerson();
      const family = await Family.createWith({ parentOne });
      const memberIds = await Family.getFamilyMemberIds(family.parentOne.id);
      expect(memberIds.length).to.eq(1);
    });

    it("getFamilyMemberIds - Two parents", async () => {
      const parentOne = randPerson();
      const parentTwo = randPerson();
      const family = await Family.createWith({ parentOne, parentTwo });
      let memberIds = await Family.getFamilyMemberIds(family.parentOne.id);
      expect(memberIds.length).to.eq(2);

      memberIds = await Family.getFamilyMemberIds(family.parentTwo.id);
      expect(memberIds.length).to.eq(2);
    });

    it("getFamilyMemberIds - child", async () => {
      const parentOne = randPerson();
      const family = await Family.createWith({ parentOne });
      const child1 = await Person.create(randPerson());
      await family.addChildren([child1.id]);
      let memberIds = await Family.getFamilyMemberIds(family.parentOne.id);
      expect(memberIds.length).to.eq(2);

      memberIds = await Family.getFamilyMemberIds(child1.id);
      expect(memberIds.length).to.eq(2);
    });
  });

  describe("memberStaffInstructorInfo", () => {
    it("memberStaffInstructorInfo", async () => {
      const obj = createRandSchoolYear();
      const schoolYear = await SchoolYear.create(obj);
      const schoolYearId = schoolYear.id;
      const parentOne = randPerson();
      const parentTwo = randPerson();
      const family = await Family.createWith({ parentOne, parentTwo });
      const parentOneId = family.parentOne.id;
      const parentTwoId = family.parentTwo.id;
      const child1 = await Person.create(randPerson());
      await family.addChildren([child1.id]);
      let result = await Family.memberStaffInstructorInfo(
        child1.id,
        schoolYearId
      );
      expect(result.instructor).to.be.false;
      expect(result.staff).to.be.false;

      await StaffAssignment.create({
        role: randString(),
        schoolYearId,
        personId: parentOneId,
        startDate: new Date(),
        endDate: new Date(),
      });

      result = await Family.memberStaffInstructorInfo(child1.id, schoolYearId);
      expect(result.instructor).to.be.false;
      expect(result.staff).to.be.true;

      await InstructorAssignment.create({
        role: InstructorAssignment.prototype.roleNames.ROLE_ROOM_PARENT,
        schoolYearId,
        schoolClassId: 1,
        instructorId: parentTwoId,
        startDate: new Date(),
        endDate: new Date(),
      });

      result = await Family.memberStaffInstructorInfo(child1.id, schoolYearId);
      expect(result.instructor).to.be.true;
      expect(result.staff).to.be.true;
    });
  });

  describe("familyCccaLifetimeMember", () => {
    it("familyCccaLifetimeMember", async () => {
      const parentOne = randPerson();
      const parentTwo = randPerson();
      const family = await Family.createWith({ parentOne, parentTwo });
      const parentOneId = family.parentOne.id;
      const parentTwoId = family.parentTwo.id;

      expect(await Family.familyCccaLifetimeMember(parentOneId)).to.be.false;
      expect(await Family.familyCccaLifetimeMember(parentTwoId)).to.be.false;

      family.cccaLifetimeMember = true;
      await family.save();

      expect(await Family.familyCccaLifetimeMember(parentOneId)).to.be.true;
      expect(await Family.familyCccaLifetimeMember(parentTwoId)).to.be.true;
    });
  });
});
