/* global describe, it */
import db from "../../src/models/index.js";
import { modelTests } from "./model-test-utils.js";

const { Grade } = db;

describe("Test Grade", () => {
  describe("Grade - CRUD", modelTests(Grade, { fieldToTest: "englishName" }));
});
