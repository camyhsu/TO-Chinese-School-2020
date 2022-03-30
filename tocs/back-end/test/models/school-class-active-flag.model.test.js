/* global describe, it */
import chai from "chai";
import db from "../../src/models/index.js";
import {
  createRandSchoolYear,
  createRandSchoolClass,
} from "../../src/utils/utilities.js";

const { expect } = chai;

const { SchoolClass, SchoolClassActiveFlag, SchoolYear } = db;

describe("Test SchoolClassActiveFlag", () => {
  describe("SchoolClassActiveFlag", async () => {
    it("SchoolClassActiveFlag - create", async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const s = await SchoolClassActiveFlag.create();
      s.setSchoolClass(schoolClass.id);
      s.setSchoolYear(schoolYear.id);
      await s.save();

      const t = await SchoolClassActiveFlag.getById(s.id);
      expect(t.schoolClassId).toBe(schoolClass.id);
      expect(t.schoolYearId).toBe(schoolYear.id);
    });
  });

  describe("activeIn", async () => {
    it("activeIn", async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const s = await SchoolClassActiveFlag.create();
      s.setSchoolClass(schoolClass.id);
      s.setSchoolYear(schoolYear.id);
      await s.save();

      expect(await schoolClass.activeIn(schoolYear.id)).toBe(true);

      s.active = false;
      await s.save();
      expect(await schoolClass.activeIn(schoolYear.id)).toBe(false);
    });
  });
});
