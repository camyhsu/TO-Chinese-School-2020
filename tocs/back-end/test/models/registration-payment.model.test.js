/* global describe it */
import { expect } from 'chai';
import db from '../../src/models/index.js';
import { randPerson } from '../../src/utils/utilities.js';

const { Person, RegistrationPayment } = db;

describe('Test RegistrationPayment', () => {
  describe('findPaidPaymentsPaidBy', async () => {
    it('findPaidPaymentsPaidBy', async () => {
      const person = await Person.create(randPerson());
      const payments = await RegistrationPayment.findPaidPaymentsPaidBy(person.id);
      expect(payments).to.be.not.null;
    });
  });
});
