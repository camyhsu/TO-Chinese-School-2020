import request from "supertest";
import {
  TEST_API_BASE_URL,
  createRandomPersonFull,
  createRandomUser,
} from "../helpers";
import db from "../../src/models/index";

const { Person, Role, User } = db;

describe("People API", () => {
  let testPerson;
  let testUser;
  let studentParentRole;
  let accessToken;

  beforeAll(async () => {
    // Create the user with the associated person
    testUser = await User.createWith(
      createRandomUser(createRandomPersonFull())
    );
    testPerson = await testUser.getPerson();

    // Add the user role data
    studentParentRole = await Role.findFirstBy({
      name: Role.prototype.roleNames.ROLE_NAME_STUDENT_PARENT,
    });
    await testUser.addRole(studentParentRole);

    const response = await request(TEST_API_BASE_URL)
      .post("/signin")
      .send({ username: testUser.username, password: testUser.password });
    accessToken = response.body.accessToken;
  });

  afterAll(async () => {
    // Clean up the user role data
    await testUser.removeRole(studentParentRole);

    // Clean up the user / person data
    await User.deleteById(testUser.id);
    await Person.deleteById(testPerson.id);
  });

  it("should return person data", async () => {
    const response = await request(TEST_API_BASE_URL)
      .get(`/api/student/people/edit/${testPerson.id}`)
      .set("x-access-token", accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(testPerson.id);
    expect(response.body.firstName).toBe(testPerson.firstName);
    expect(response.body.lastName).toBe(testPerson.lastName);
    expect(response.body.chineseName).toBe(testPerson.chineseName);
    expect(response.body.nativeLanguage).toBe(testPerson.nativeLanguage);
    expect(response.body.gender).toBe(testPerson.gender);
    expect(response.body.birthMonth).toBe(testPerson.birthMonth);
    expect(response.body.birthYear).toBe(testPerson.birthYear);
  });
});
