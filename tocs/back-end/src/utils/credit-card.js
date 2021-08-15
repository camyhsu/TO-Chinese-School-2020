import cardValidator from 'card-validator';

function CreditCard(number, exp4Digits, cvv) {
  this.number = number;
  this.exp4Digits = exp4Digits;
  this.cvv = cvv;
}

Object.assign(CreditCard.prototype, {
  validate() {
    const cv = cardValidator.number(this.number);
    const cardType = cv.card.type;
    const rtn = Object.assign(this, { type: cardType, last4: this.number.slice(-4) });
    if (!cv.isValid) {
      return Object.assign(rtn, { isValid: false, error: 'Number' });
    }
    if (!['visa', 'mastercard', 'discover'].find((x) => x === cardType)) {
      return Object.assign(rtn, { isValid: false, error: `${cardType} is not accepted by Chinese School` });
    }
    if (!cardValidator.expirationDate(this.exp4Digits).isValid) {
      return Object.assign(rtn, { isValid: false, error: 'Expiration Date' });
    }
    if (!cardValidator.cvv(this.cvv).isValid) {
      return Object.assign(rtn, { isValid: false, error: 'CVV' });
    }
    return Object.assign(rtn, { isValid: true });
  },
  toPaymentGatewayCreditCard() {
    return { cardNumber: this.number, expirationDate: this.exp4Digits, cardCode: this.cvv };
  },
});

export default CreditCard;
