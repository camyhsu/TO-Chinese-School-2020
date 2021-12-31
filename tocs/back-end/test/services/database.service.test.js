/* global describe before, it */
import { expect } from "chai";
import {
  databaseName,
  generateChangeLog,
  snapshot,
  update,
} from "../../src/services/database.service.js";

describe("Test Database Setup", () => {
  before(() => {
    it("ensure we are in test environment and using test_db", async () => {
      expect(process.env.NODE_ENV).eq("test");
      expect(databaseName).eq("test_db");
    });
  });

  describe("Run liquibase update", () => {
    it("should run update", async () => {
      const r = await update();
      expect(r.stdout).include("Liquibase: Update has been successful");
    });
  });

  describe("Run liquibase snapshot", () => {
    it("should run snapshot", async () => {
      const r = await snapshot();
      expect(r.stdout).include("command 'snapshot' was executed successfully");
    });
  });

  describe("Run liquibase generateChangeLog", () => {
    it("should run generateChangeLog", async () => {
      const r = await generateChangeLog();
      expect(r.stdout).include(
        "command 'generateChangeLog' was executed successfully"
      );
    });
  });
});
