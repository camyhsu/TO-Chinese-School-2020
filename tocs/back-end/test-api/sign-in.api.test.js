import request from "supertest";
import { TEST_API_BASE_URL, createRandomUser } from "./helpers";
import db from "../src/models/index";

const { User } = db;

describe("SignIn API", () => {
  let testUser;

  beforeAll(async () => {
    testUser = await User.createWith(createRandomUser());
  });

  afterAll(async () => {
    await User.deleteById(testUser.id);
  });

  it("should return 401 given invalid username", async () => {
    const response = await request(TEST_API_BASE_URL)
      .post("/signin")
      .send({ username: "badusername", password: testUser.password });
    expect(response.statusCode).toBe(401);
  });

  it("should return 401 given invalid password", async () => {
    const response = await request(TEST_API_BASE_URL)
      .post("/signin")
      .send({ username: testUser.username, password: "badpassword" });
    expect(response.statusCode).toBe(401);
  });

  it("should return the user object with valid sign-in", async () => {
    const response = await request(TEST_API_BASE_URL)
      .post("/signin")
      .send({ username: testUser.username, password: testUser.password });
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.userId).toBeTruthy();
    expect(response.body.roles).toBeDefined();
    expect(response.body.accessToken).toBeTruthy();
  });
});

// import chai from "chai";
// import chaiAsPromised from "chai-as-promised";
// import apiFn from "../src/utils/api.js";
//
// chai.use(chaiAsPromised);
// const { expect } = chai;
//
// const username = "admin";
// const password = "123456";
// const newPassword = "654321";
//
// const api = apiFn();
//
//
//   describe("Change password", () => {
//     it("change password", async () => {
//       await api.signIn();
//       await expect(
//         api.changePassword({
//           currentPassword: "1",
//           newPassword: "2",
//           newPasswordConfirmation: "3",
//         })
//       ).to.eventually.be.rejectedWith("Request failed with status code 400");
//       await expect(
//         api.changePassword({
//           currentPassword: password,
//           newPassword: "2",
//           newPasswordConfirmation: "3",
//         })
//       ).to.eventually.be.rejectedWith("Request failed with status code 400");
//       let r = await api.changePassword({
//         currentPassword: password,
//         newPassword,
//         newPasswordConfirmation: newPassword,
//       });
//       expect(r.status).eq(200);
//       r = await api.changePassword({
//         currentPassword: newPassword,
//         newPassword: password,
//         newPasswordConfirmation: password,
//       });
//       expect(r.status).eq(200);
//     });
//   });
// });
