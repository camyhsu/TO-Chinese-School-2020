/* eslint-disable import/no-extraneous-dependencies */
/* global describe, it */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import apiFn from "../src/utils/api.js";

chai.use(chaiAsPromised);
const { expect } = chai;

const username = "admin";
const password = "123456";
const newPassword = "654321";

const api = apiFn();

describe("Test SignIn", () => {
  describe("SignIn", () => {
    it("Invalid signIn", async () => {
      await expect(api.signIn(username, "xyz")).to.eventually.be.rejectedWith(
        "Request failed with status code 401"
      );
      await expect(api.signIn("xyz", password)).to.eventually.be.rejectedWith(
        "Request failed with status code 401"
      );
    });

    it("Valid signIn", async () => {
      const r = await api.signIn();
      expect(api.getAccessToken()).eq(r.accessToken);
    });
  });

  describe("Change password", () => {
    it("change password", async () => {
      await api.signIn();
      await expect(
        api.changePassword({
          currentPassword: "1",
          newPassword: "2",
          newPasswordConfirmation: "3",
        })
      ).to.eventually.be.rejectedWith("Request failed with status code 400");
      await expect(
        api.changePassword({
          currentPassword: password,
          newPassword: "2",
          newPasswordConfirmation: "3",
        })
      ).to.eventually.be.rejectedWith("Request failed with status code 400");
      let r = await api.changePassword({
        currentPassword: password,
        newPassword,
        newPasswordConfirmation: newPassword,
      });
      expect(r.status).eq(200);
      r = await api.changePassword({
        currentPassword: newPassword,
        newPassword: password,
        newPasswordConfirmation: password,
      });
      expect(r.status).eq(200);
    });
  });
});
