/* global describe, it */
import { expect } from 'chai';
import db from '../../src/models/index.js';
import { modelTests } from './model-test-utils.js';

const { SchoolYear } = db;
const createRandSchoolYear = () => ({
  startDate: new Date(),
  endDate: new Date(),
  registrationStartDate: new Date(),
  registration75PercentDate: new Date(),
  registrationEndDate: new Date(),
  refundEndDate: new Date(),
  refund50PercentDate: new Date(),
  earlyRegistrationStartDate: new Date(),
  earlyRegistrationEndDate: new Date(),
  ageCutoffMonth: 12,
});

describe('Test SchoolYear', () => {
  describe('SchoolYear - CRUD', modelTests(SchoolYear, { object: createRandSchoolYear() }));
});
