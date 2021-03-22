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
  saveFamilyAddress: async (familyId, _obj) => {
    const obj = _obj;
    const family = await Family.getById(familyId);
    const { addressId } = family;
    if (addressId) {
      const address = await Address.getById(addressId);
      Object.assign(address, obj);
      await address.save();
    } else {
      const savedAddress = await Address.create(obj);
      await family.setAddress(savedAddress.id);
    }
  },
  savePerson: async (personId, obj) => {
    const person = await Person.getById(personId);
    Object.assign(person, obj);
    await person.save();
  },
  savePersonAddress: async (personId, _obj) => {
    const obj = _obj;
    const person = await Person.getById(personId);
    const { addressId } = person;
    if (addressId) {
      const address = await Address.getById(addressId);
      Object.assign(address, obj);
      await address.save();
    } else {
      const savedAddress = await Address.create(obj);
      await person.setAddress(savedAddress.id);
    }
  },
};
