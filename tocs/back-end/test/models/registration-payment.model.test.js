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

  describe('createWith', async () => {
    it('createWith', async () => {
      const payment = await RegistrationPayment.createWith({
        grandTotalInCents: 100000,
        cccaDueInCents: 1000,
        pvaDueInCents: 1000,
        paid_by_id: 1,
        schoolYearId: 1,
        studentFeePayments: [{
          studentId: 1,
          bookChargeInCents: 10000,
          registrationFeeInCents: 10000,
          tuitionInCents: 10000,
        }],
      });
      expect(payment).to.be.not.null;
      expect(payment.id).to.gt(0);
    });
  });
});
