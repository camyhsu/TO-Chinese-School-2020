import RegistrationService from "../../src/services/registration.service";
import StudentService from "../../src/services/student.service";
import {
  randAddress,
  randPerson,
  createRandSchoolYear,
  createRandSchoolClass,
} from "../../src/utils/utilities";
import db from "../../src/models/index";

const { BookCharge, Grade, SchoolClass } = db;

describe("Test Registration", () => {
  describe("addFamily/getFamily", () => {
    it("should add family and get family", async () => {
      const address = randAddress();
      const person = randPerson();
      const savedFamily = await RegistrationService.addFamily({
        ...address,
        ...person,
      });
      const family = await RegistrationService.getFamily(savedFamily.id);

      expect(family.id).toBe(savedFamily.id);
      expect(family.address.id).toBe(savedFamily.address.id);
      expect(family.parentOne.id).toBe(savedFamily.parentOne.id);
      expect(family.children.length).toBe(0);

      const child1 = randPerson();
      await StudentService.addChild(family.id, child1);

      let familyWithChildren = await RegistrationService.getFamily(
        savedFamily.id
      );
      expect(familyWithChildren.children.length).toBe(1);
      expect(familyWithChildren.children[0].firstName).toBe(child1.firstName);

      const child2 = randPerson();
      await StudentService.addChild(family.id, child2);

      familyWithChildren = await RegistrationService.getFamily(savedFamily.id);
      expect(familyWithChildren.children.length).toBe(2);
      expect(familyWithChildren.children[1].firstName).toBe(child2.firstName);
    });
  });

  describe("addSchoolYear", () => {
    it("should add SchoolYear", async () => {
      const schoolClass = await SchoolClass.create(createRandSchoolClass());
      const schoolYear = await RegistrationService.addSchoolYear(
        createRandSchoolYear()
      );
      expect(await schoolClass.activeIn(schoolYear.id)).toBe(true);
      const bookCharges = await BookCharge.findAllForSchoolYear(schoolYear.id);
      const grades = await Grade.findAll();
      expect(bookCharges.length).toBe(grades.length);
    });

    it("should have previous school year", async () => {
      const sy1 = createRandSchoolYear();
      const schoolYear1 = await RegistrationService.addSchoolYear(sy1);

      const sy2 = createRandSchoolYear();
      sy2.startDate = new Date(sy1.endDate.getTime() + 1);
      sy2.endDate = new Date(
        sy2.startDate.getTime() + 30 * 1000 * 60 * 60 * 24
      );
      const schoolYear2 = await RegistrationService.addSchoolYear(sy2);

      expect(schoolYear1.id).not.toBeNull();
      expect(schoolYear2.id).not.toBeNull();
      expect(schoolYear2.previousSchoolYearId).not.toBeNull();
    });
  });
});
