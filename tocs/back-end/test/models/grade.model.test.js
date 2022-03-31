import db from "../../src/models/index";
import { modelTests } from "./model-test-utils";

const { Grade } = db;

describe("Test Grade", () => {
  describe("Grade - CRUD", modelTests(Grade, { fieldToTest: "englishName" }));
});
