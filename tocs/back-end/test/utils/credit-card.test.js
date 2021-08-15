/* eslint-disable max-len */
/* global describe, it */
import { expect } from 'chai';
import CreditCard from '../../src/utils/credit-card.js';
import { process } from '../../src/utils/payment-gateway.js';

describe('Credit Card', () => {
  describe('creditCardCreator', () => {
    it('creditCardCreator', async () => {
      expect(new CreditCard('4532928211171666', '1221', '123').validate().isValid).to.be.true;
      expect(new CreditCard('4532928211171666', '1221').validate().isValid).to.be.false;
      expect(new CreditCard('4532928211171666', '1221').validate().error).to.eq('CVV');

      expect(new CreditCard('4532928211171666', '1321').validate().isValid).to.be.false;
      expect(new CreditCard('4532928211171666', '1321').validate().error).to.eq('Expiration Date');

      expect(new CreditCard('453292821117166').validate().isValid).to.be.false;
      expect(new CreditCard('453292821117166').validate().error).to.eq('Number');
    });

    it('card type', async () => {
      expect(new CreditCard('342826328808014', '1221', '123').validate().type).eq('american-express');
      expect(new CreditCard('3014481532938230', '1221', '123').validate().type).eq('diners-club');
      expect(new CreditCard('6011229168236619', '1221', '123').validate().type).eq('discover');
      expect(new CreditCard('5323052417528049', '1221', '123').validate().type).eq('mastercard');
      expect(new CreditCard('6222023945730720', '1221', '123').validate().type).eq('unionpay');
      expect(new CreditCard('4532928211171666', '1221', '123').validate().type).eq('visa');
    });
  });

  describe('authorize.net', () => {
    it('authorize.net', async () => {
      const amount = 430.00;
      const gatewayId = Date.now();
      const creditCard = {
        cardNumber: '4242424242424242', expirationDate: '0822', cardCode: '999',
      };

      const rtn = await process({
        invoiceNumber: gatewayId, amount, creditCard,
      });
      console.log('===========\n', rtn);
      expect(rtn.description).to.eq('This transaction has been approved.');
    });
  });

  describe('last 4', () => {
    it('last 4', async () => {
      expect(new CreditCard('342826328808014', '1221', '123').validate().last4).to.eq('8014');
    });
  });
});
