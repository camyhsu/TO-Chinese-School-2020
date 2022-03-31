import db from "../../src/models/index";
import { modelTests } from "./model-test-utils";
import { randString } from "../../src/utils/utilities";

const { StaffAssignment } = db;

const createRandStaffAssignment = () => ({
  role: randString(),
  schoolYearId: 1,
  personId: 1,
  startDate: new Date(),
  endDate: new Date(),
});

describe("Test StaffAssignment", () => {
  describe(
    "StaffAssignment - CRUD",
    modelTests(StaffAssignment, {
      fieldToTest: "role",
      object: createRandStaffAssignment(),
    })
  );
});
