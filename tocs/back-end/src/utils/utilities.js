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

const randBook = () => ({
  title: chance.string(),
  publisher: chance.string(),
  bookType: chance.pickset(['S/T', 'S', 'T'], 1)[0],
});

const toNumeric = (s) => s && s.replace(/\D/g, '');

const formatPhoneNumber = (s) => (s && toNumeric(s).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')) || '';

const randString = () => chance.string();

const pick = (array, quantity) => chance.pickset(array, quantity || 1);

const toObj = (obj) => JSON.parse(JSON.stringify(obj));

const collectionToObj = (collection) => collection
  .reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

const datePart = (_s) => {
  const s = (_s.toISOString && _s.toISOString()) || _s;
  return s.split('T')[0];
};

const isoToPacific = (s) => new Date(s).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

const isoToPacificDate = (s) => new Date(s).toLocaleString('fr-CA', {
  timeZone: 'America/Los_Angeles',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const today = () => datePart(new Date().toISOString());

const todayPacific = () => isoToPacificDate(today());

const dateBetween = (_date, duration) => {
  const date = datePart(_date);
  return date >= duration.startDate && date <= duration.endDate;
};

const datePlus = (n) => new Date(new Date().getTime() + n * 1000 * 60 * 60 * 24);

const tomorrow = () => datePart(datePlus(1).toISOString());

const createRandSchoolYear = () => ({
  name: randString(),
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

const createRandSchoolClass = (c) => ({
  startDate: new Date(),
  endDate: new Date(),
  englishName: randString(),
  chineseName: randString(),
  schoolClassType: c || 'M',
  maxSize: 10,
});

const toExp4Digits = (year, month) => String(month).padStart(2, '0') + String(year).substring(2);

export {
  dateBetween, datePlus, formatPhoneNumber, randAddress, randObj, randBook, datePart, isoToPacific, isoToPacificDate,
  randPerson, randSalt, randUser, sha256Hex, today, todayPacific, createRandSchoolYear, tomorrow,
  toNumeric, uuid, randString, pick, toObj, collectionToObj, createRandSchoolClass, toExp4Digits,
};
