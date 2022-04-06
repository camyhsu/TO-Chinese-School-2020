import request from "supertest";
import { TEST_API_BASE_URL, createRandomUser } from "./helpers";
import db from "../src/models/index";

const { Role, User } = db;

describe("API Role Permission Authorization", () => {
  let testUser;
  let studentParentRole;
  let accessToken;

  beforeAll(async () => {
    // Create the user data
    testUser = await User.createWith(createRandomUser());

    // Add the user role data
    studentParentRole = await Role.findFirstBy({
      name: Role.prototype.roleNames.ROLE_NAME_STUDENT_PARENT,
    });
    await testUser.addRole(studentParentRole);

    // Sign in and obtain the access token
    const response = await request(TEST_API_BASE_URL)
      .post("/signin")
      .send({ username: testUser.username, password: testUser.password });
    accessToken = response.body.accessToken;
  });

  afterAll(async () => {
    // Clean up the user role data
    await testUser.removeRole(studentParentRole);

    // Clean up the user data
    await User.deleteById(testUser.id);
  });

  it("should return 403 if a student parent attempts to access student list", async () => {
    const response = await request(TEST_API_BASE_URL)
      .get("/api/instruction/school_classes/show")
      .set("x-access-token", accessToken);
    expect(response.statusCode).toBe(403);
  });

  it("should return 200 if a student parent attempts to access the parent resources", async () => {
    const response = await request(TEST_API_BASE_URL)
      .get("/api/board/student-parent")
      .set("x-access-token", accessToken);
    expect(response.statusCode).toBe(200);
  });
});
