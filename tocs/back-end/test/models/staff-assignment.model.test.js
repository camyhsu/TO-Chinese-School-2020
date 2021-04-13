/* global describe, it */
import { expect } from 'chai';
import db from '../../src/models/index.js';
import { modelTests } from './model-test-utils.js';
import { randString } from '../../src/utils/utilities.js';

const { StaffAssignment } = db;

const createRandStaffAssignment = () => ({
  role: randString(),
  schoolYearId: 1,
  personId: 1,
});

describe('Test StaffAssignment', () => {
  describe('StaffAssignment - CRUD', modelTests(StaffAssignment, {
    fieldToTest: 'role', object: createRandStaffAssignment(),
  }));
});
