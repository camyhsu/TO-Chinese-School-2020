import request from "supertest";
import {
  TEST_API_BASE_URL,
  createRandomPassword,
  createRandomUser,
} from "./helpers";
import db from "../src/models/index";

const { User } = db;

describe("Sign In API", () => {
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

describe("Change Password API", () => {
  let testUser;
  let accessToken;
  let fakePassword;

  beforeAll(async () => {
    testUser = await User.createWith(createRandomUser());
    const response = await request(TEST_API_BASE_URL)
      .post("/signin")
      .send({ username: testUser.username, password: testUser.password });
    accessToken = response.body.accessToken;
    fakePassword = createRandomPassword();
  });

  afterAll(async () => {
    await User.deleteById(testUser.id);
  });

  it("should return 400 if the current password is not correct", async () => {
    const response = await request(TEST_API_BASE_URL)
      .put("/api/change-password")
      .set("x-access-token", accessToken)
      .send({
        currentPassword: "badpassword",
        newPassword: fakePassword,
        newPasswordConfirmation: fakePassword,
      });
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if the new password confirmation does not match", async () => {
    const response = await request(TEST_API_BASE_URL)
      .put("/api/change-password")
      .set("x-access-token", accessToken)
      .send({
        currentPassword: testUser.password,
        newPassword: fakePassword,
        newPasswordConfirmation: "noMatchPassword",
      });
    expect(response.statusCode).toBe(400);
  });

  it("should return 200 if the current password is correct and the new password confirmation does match", async () => {
    const response = await request(TEST_API_BASE_URL)
      .put("/api/change-password")
      .set("x-access-token", accessToken)
      .send({
        currentPassword: testUser.password,
        newPassword: fakePassword,
        newPasswordConfirmation: fakePassword,
      });
    expect(response.statusCode).toBe(200);
    // Sign in again with the old password should now get a 401 response
    const newSignInResponse = await request(TEST_API_BASE_URL)
      .post("/signin")
      .send({ username: testUser.username, password: testUser.password });
    expect(newSignInResponse.statusCode).toBe(401);
  });
});
