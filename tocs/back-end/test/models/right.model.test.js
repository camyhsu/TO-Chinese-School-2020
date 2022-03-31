import db from "../../src/models/index";
import { modelTests } from "./model-test-utils";

const { Right } = db;

describe("Test Right", () => {
  describe("Right - CRUD", modelTests(Right));

  describe("Rights", () => {
    it("should have rights", async () => {
      const r = await Right.count();
      expect(r).toBeGreaterThan(0);
    });

    it("should have List People right", async () => {
      const r = await Right.findAll({
        where: {
          name: "List People",
        },
      });
      expect(r.length).toBe(1);
    });

    it("should have many roles", async () => {
      const r = await Right.findAll({
        where: {
          name: "班級人數清單",
        },
      });
      expect(r.length).toBe(1);
      const roles = await r[0].getRoles();
      expect(roles.length).toBeGreaterThan(2);
    });

    it("should have authorized", async () => {
      const r = await Right.findAll({
        where: {
          name: "班級人數清單",
        },
      });
      expect(r.length).toBe(1);
      expect(r[0].authorized("controller", "action")).toBe(false);
      expect(
        r[0].authorized(
          "registration/active_school_classes",
          "grade_class_student_count"
        )
      ).toBe(true);
    });
  });
});
