import request from "supertest";
import {
  TEST_API_BASE_URL,
  chance,
  createRandomPassword,
  createRandomUsername,
} from "./helpers";

describe("Sign Up API", () => {
  it("should allow sign-in after a successful sign-up", async () => {
    const testUsername = createRandomUsername();
    const testPassword = createRandomPassword();

    // Sign-in should fail before signing up
    const preSignUpResponse = await request(TEST_API_BASE_URL)
      .post("/signin")
      .send({ username: testUsername, password: testPassword });
    expect(preSignUpResponse.statusCode).toBe(401);

    // Sign-up with minimal required data
    const requiredSignUpData = {
      username: testUsername,
      password: testPassword,
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      gender: "F",
      street: chance.street(),
      city: chance.city(),
      state: chance.state(),
      zipcode: chance.zip(),
    };
    const signUpResponse = await request(TEST_API_BASE_URL)
      .post("/signup")
      .send(requiredSignUpData);
    expect(signUpResponse.statusCode).toBe(200);
    expect(signUpResponse.body.message).toBe("Account successfully created");

    // Should allow sign-in after the successful sign-up
    const postSignUpResponse = await request(TEST_API_BASE_URL)
      .post("/signin")
      .send({ username: testUsername, password: testPassword });
    expect(postSignUpResponse.statusCode).toBe(200);

    // TODO - should clean up after the test, but this involves at least
    // 5 records, in users, people, families, addresses, roles_users
    // const testUserId = postSignUpResponse.body.userId;
  });

  // TODO - should check all records are setup and linked properly
});
