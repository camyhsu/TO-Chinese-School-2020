/* global describe, it */
import { expect } from 'chai';
import RegistrationService from '../../src/services/registration.service.js';
import { randAddress, randPerson } from '../../src/utils/utilities.js';

describe('Test Registration', () => {
  describe('addFamily/getFamily', () => {
    it('should add family and get family', async () => {
      const address = randAddress();
      const person = randPerson();
      const savedFamily = await RegistrationService.addFamily({ ...address, ...person });
      const family = await RegistrationService.getFamily(savedFamily.id);

      expect(family.id).to.eq(savedFamily.id);
      expect(family.address.id).to.eq(savedFamily.address.id);
      expect(family.parentOne.id).to.eq(savedFamily.parentOne.id);
    });
  });
});
