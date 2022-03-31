/* eslint-disable import/no-extraneous-dependencies */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import apiFn from "../src/utils/api";

const api = apiFn();

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Test Get Board", () => {
  describe("studentBoard", () => {
    it("should be able to get Board", async () => {
      let r = await api.signIn();
      r = await api.getStudentBoard();
      expect(r.person.id).not.null;

      await expect(api.getInstructorBoard()).to.eventually.be.rejectedWith(
        "Request failed with status code 403"
      );
    });
  });
});
