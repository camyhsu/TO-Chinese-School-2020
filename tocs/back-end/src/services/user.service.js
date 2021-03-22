import db from '../models/index.js';

const {
  Address, Person, User,
} = db;

export default {
  studentParentBoard: async (userId) => {
    const user = await User.getById(userId);
    const person = await user.getPerson();
    const dbFamilies = await person.families();

    if (person.addressId) {
      person.address = await Address.getById(person.addressId);
    }

    const families = dbFamilies.map((family) => ({
      familyId: family.id,
      addressId: family.addressId,
      address: family.addressId === person.addressId ? person.address : null,
      parent_one_id: family.parent_one_id,
      parentOne: family.parent_one_id === person.id ? person : null,
      parent_two_id: family.parent_two_id,
      parentTwo: family.parent_two_id === person.id ? person : null,
    }));

    const promises = families.map((family) => {
      const fn = async () => {
        const obj = {};
        if (family.addressId && !family.address) {
          obj.address = await Address.getById(family.addressId);
        }
        if (family.parent_one_id && !family.parentOne) {
          obj.parentOne = await Person.getById(family.parent_one_id);
        }
        if (family.parent_two_id && !family.parentTwo) {
          obj.parentTwo = await Person.getById(family.parent_two_id);
        }
        return { ...family, ...obj };
      };
      return fn();
    });

    const allFamilies = await Promise.all(promises);

    return {
      person, families: allFamilies,
    };
  },
};
