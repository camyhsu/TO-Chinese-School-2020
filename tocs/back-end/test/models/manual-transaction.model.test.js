import db from "../../src/models/index";
import { randPerson } from "../../src/utils/utilities";

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
