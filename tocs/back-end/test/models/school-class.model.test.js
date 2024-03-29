import chai from "chai";
import db from "../../src/models/index";
import { createRandSchoolClass } from "../../src/utils/utilities";
import { modelTests } from "./model-test-utils";

const { expect } = chai;

const { SchoolClass, SchoolClassActiveFlag, SchoolYear } = db;

describe("Test SchoolClass", () => {
  describe(
    "SchoolClass - CRUD",
    modelTests(SchoolClass, {
      fieldToTest: "englishName",
      object: createRandSchoolClass(),
    })
  );

  describe("elective", () => {
    it("elective", async () => {
      const c1 = await SchoolClass.create(createRandSchoolClass());
      expect(c1.name()).not.toBeNull();
      expect(c1.elective()).toBe(false);
      const c2 = await SchoolClass.create(
        createRandSchoolClass(
          SchoolClass.prototype.schoolClassTypes.SCHOOL_CLASS_TYPE_ELECTIVE
        )
      );
      expect(c2.name()).not.toBeNull();
      expect(c2.elective()).toBe(true);
    });
  });

  describe("getActiveSchoolClassesForCurrentNextSchoolYear", async () => {
    it("getActiveSchoolClassesForCurrentNextSchoolYear", async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const currentSchoolYear = await SchoolYear.currentSchoolYear();
      const s = await SchoolClassActiveFlag.create();
      s.setSchoolClass(schoolClass.id);
      s.setSchoolYear(currentSchoolYear.id);
      const x =
        await SchoolClass.getActiveSchoolClassesForCurrentNextSchoolYear();
      expect(x.currentSchoolYear.id).toBe(currentSchoolYear.id);
    });
  });

  describe("flipActiveTo", async () => {
    it("flipActiveTo", async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const currentSchoolYear = await SchoolYear.currentSchoolYear();
      const s = await SchoolClassActiveFlag.create();
      await s.setSchoolClass(schoolClass.id);
      await s.setSchoolYear(currentSchoolYear.id);
      let a = await schoolClass.getSchoolClassActiveFlags();
      expect(a[0].active).toBe(true);

      await schoolClass.flipActiveTo(currentSchoolYear.id, false);
      a = await schoolClass.getSchoolClassActiveFlags();
      expect(a[0].active).toBe(false);
    });
  });
});
