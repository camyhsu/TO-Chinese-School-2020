/* global describe, it */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import db from "../../src/models/index.js";
import { modelTests } from "./model-test-utils.js";
import {
  datePlus,
  randPerson,
  createRandSchoolClass,
  createRandSchoolYear,
} from "../../src/utils/utilities.js";

chai.use(chaiAsPromised);
const { expect } = chai;
const { InstructorAssignment, Person, SchoolClass, SchoolYear } = db;

const { ROLE_ROOM_PARENT, ROLE_SECONDARY_INSTRUCTOR } =
  InstructorAssignment.prototype.roleNames;

const createRandInstructorAssignment = (c) => ({
  role: c || ROLE_ROOM_PARENT,
  schoolYearId: 1,
  schoolClassId: 1,
  instructorId: 1,
  startDate: new Date(),
  endDate: new Date(),
});

describe("Test InstructorAssignment", () => {
  describe(
    "InstructorAssignment - CRUD",
    modelTests(InstructorAssignment, {
      fieldToTest: "role",
      object: createRandInstructorAssignment(),
    })
  );

  describe("isInstructor", () => {
    it("isInstructor", async () => {
      const c1 = await InstructorAssignment.create(
        createRandInstructorAssignment()
      );
      expect(c1.isInstructor()).to.eq(false);
      const c2 = await InstructorAssignment.create(
        createRandInstructorAssignment(ROLE_SECONDARY_INSTRUCTOR)
      );
      expect(c2.isInstructor()).to.eq(true);
    });
  });

  describe("findInSameSchoolYear", () => {
    it("findInSameSchoolYear", async () => {
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const p1 = await Person.create(randPerson());
      const p2 = await Person.create(randPerson());

      const c1 = await InstructorAssignment.create(
        Object.assign(createRandInstructorAssignment(), {
          schoolYearId: schoolYear.id,
          schoolClassId: schoolClass.id,
          instructorId: p1.id,
        })
      );
      const c2 = await InstructorAssignment.create(
        Object.assign(createRandInstructorAssignment(), {
          schoolYearId: schoolYear.id,
          schoolClassId: schoolClass.id,
          instructorId: p2.id,
          startDate: datePlus(-30),
          endDate: datePlus(-20),
        })
      );
      const r1 = await c1.findInSameSchoolYear();
      expect(r1.map((x) => x.id)).to.eql([c2.id]);
      const r2 = await c2.findInSameSchoolYear();
      expect(r2.map((x) => x.id)).to.eql([c1.id]);

      await expect(
        InstructorAssignment.create(
          Object.assign(createRandInstructorAssignment(), {
            schoolYearId: schoolYear.id,
            schoolClassId: schoolClass.id,
            instructorId: p2.id,
          })
        )
      ).to.eventually.be.rejectedWith(
        /Validation error: Cannot overlap with existing assignment for.*/g
      );
    });
  });

  describe("findInstructors", () => {
    it("findInstructors", async () => {
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const p1 = await Person.create(randPerson());

      await InstructorAssignment.create(
        Object.assign(
          createRandInstructorAssignment(ROLE_SECONDARY_INSTRUCTOR),
          {
            schoolYearId: schoolYear.id,
            schoolClassId: schoolClass.id,
            instructorId: p1.id,
          }
        )
      );
      const r = await InstructorAssignment.findInstructors(schoolYear.id);
      expect(r.map((p) => p.id)).to.include(p1.id);
    });
  });
});
