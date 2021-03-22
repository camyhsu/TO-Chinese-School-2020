import { v4 as uuid } from 'uuid';
import Chance from 'chance';
import sha256 from 'crypto-js/sha256.js';
import CryptoJS from 'crypto-js';

const { Base64, Hex } = CryptoJS.enc;
const { WordArray } = CryptoJS.lib;
const chance = new Chance();

const randObj = (fieldName) => ({
  [fieldName]: uuid(),
});

const randPerson = () => ({
  firstName: chance.first(),
  lastName: chance.last(),
  gender: 'F',
});

const randUser = () => ({ username: chance.name() });

const sha256Hex = (nonce, message) => sha256(nonce + message).toString(Hex);

// Default to 6 bytes Base64 encoded
const randSalt = (n, hex) => WordArray.random(n || 6).toString(hex ? Hex : Base64);

const randAddress = () => ({
  street: chance.street(),
  city: chance.city(),
  state: chance.state(),
  zipcode: chance.zip(),
  homePhone: chance.phone(),
  cellPhone: chance.phone(),
  email: chance.email(),
});

const toNumeric = (s) => s && s.replace(/\D/g, '');

const formatPhoneNumber = (s) => (s && toNumeric(s).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')) || '';

export {
  formatPhoneNumber, randAddress, randObj, randPerson, randSalt, randUser, sha256Hex, toNumeric, uuid,
};
