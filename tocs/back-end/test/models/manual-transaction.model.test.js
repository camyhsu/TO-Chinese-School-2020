/* global describe it */
import db from "../../src/models/index.js";
import { randPerson } from "../../src/utils/utilities.js";

const { Person, ManualTransaction } = db;

describe("Test ManualTransaction", () => {
  describe("findTransactionBy", async () => {
    it("findTransactionBy", async () => {
      const person = await Person.create(randPerson());
      const payments = await ManualTransaction.findTransactionBy(person.id);
      expect(payments).not.toBeNull();
    });
  });
});
