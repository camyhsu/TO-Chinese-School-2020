import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import db from "../../src/models/index";
import { modelTests } from "./model-test-utils";
import { randAddress } from "../../src/utils/utilities";

chai.use(chaiAsPromised);
const { expect } = chai;
const { Address } = db;

describe("Test Address", () => {
  describe("Address - CRUD", modelTests(Address, { fieldToTest: "street" }));

  describe("Address", () => {
    it("zipcode - invalid", async () => {
      await expect(
        Address.create({ zipcode: 100000 })
      ).to.eventually.be.rejectedWith("Validation error");
    });

    it("zipcode - valid", async () => {
      expect((await Address.create({ zipcode: 99999 })).zipcode).eq("99999");
    });

    it("zipcode - undefined", async () => {
      expect((await Address.create()).zipcode).to.be.null;
    });

    it("formatPhoneNumber", async () => {
      expect(Address.formatPhoneNumber()).eq("");
      expect(Address.formatPhoneNumber(null)).eq("");
      expect(Address.formatPhoneNumber("1234567890")).eq("(123) 456-7890");
    });

    it("emailAlreadyExists", async () => {
      const address = randAddress();
      expect(await Address.emailAlreadyExists(address.email)).eq(false);
      await Address.create(address);
      expect(await Address.emailAlreadyExists(address.email)).eq(true);
    });
  });
});
