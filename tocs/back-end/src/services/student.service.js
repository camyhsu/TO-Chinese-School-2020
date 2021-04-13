import db from '../models/index.js';

const {
  Address, Family, Person,
} = db;

export default {
  addParent: async (familyId, obj) => {
    const family = await Family.getById(familyId);
    const person = await Person.create(obj);
    await family.setParentTwo(person.id);
  },
  addChild: async (familyId, obj) => {
    const family = await Family.getById(familyId);
    const child = await Person.create(obj);
    await family.addChild(child.id);
  },
  getPerson: async (personId) => Person.getById(personId),
  savePerson: async (personId, obj) => {
    const person = await Person.getById(personId);
    Object.assign(person, obj);
    await person.save();
  },
  // Addresses
  getFamilyAddress: async (familyId) => {
    const family = await Family.getById(familyId);
    return family.getAddress();
  },
  getPersonalAddress: async (personId) => {
    const person = await Person.getById(personId);
    return person.getAddress();
  },
  saveFamilyAddress: async (familyId, obj) => {
    const family = await Family.getById(familyId);
    const address = await family.getAddress();
    Object.assign(address, obj);
    await address.save();
  },
  savePersonalAddress: async (personId, obj) => {
    const person = await Person.getById(personId);
    const address = await person.getAddress();
    Object.assign(address, obj);
    await address.save();
  },
  addPersonalAddress: async (personId, obj) => {
    const person = await Person.getById(personId);
    const savedAddress = await Address.create(obj);
    await person.setAddress(savedAddress.id);
  },
};
