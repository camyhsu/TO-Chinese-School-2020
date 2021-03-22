/* global describe, it */
import { expect } from 'chai';
import db from '../../src/models/index.js';
import { randAddress, randPerson } from '../../src/utils/utilities.js';

const {
  Address, Family, Person,
} = db;

const createRandFamily = async () => {
  const originalLength = await Family.count();
  const parentOne = randPerson();
  const family = await Family.createWith({ parentOne });
  expect(await Family.count()).eq(originalLength + 1);
  return family;
};

describe('Test Family', () => {
  describe('Families', () => {
    it('should have parentOne', async () => {
      const originalLength = await Family.count();
      const parentOne = randPerson();
      const family = await Family.createWith({ parentOne });
      expect(await Family.count()).eq(originalLength + 1);
      expect(family.parentOne.englishName()).eq(Person.prototype.englishName.call(parentOne));
    });

    it('should have parentOne and parentTwo', async () => {
      const originalLength = await Family.count();
      const parentOne = randPerson();
      const parentTwo = randPerson();
      const family = await Family.createWith({ parentOne, parentTwo });
      expect(await Family.count()).eq(originalLength + 1);
      expect(family.parentOne.englishName()).eq(Person.prototype.englishName.call(parentOne));
      expect(family.parentTwo.englishName()).eq(Person.prototype.englishName.call(parentTwo));

      expect(await family.isParentOne(null)).eq(false);
      expect(await family.isParentOne(family.parentOne)).eq(true);
      expect(await family.isParentOne(family.parentTwo)).eq(false);

      expect(await family.isParentTwo(null)).eq(false);
      expect(await family.isParentTwo(family.parentOne)).eq(false);
      expect(await family.isParentTwo(family.parentTwo)).eq(true);
    });

    it('should have parentOne and address', async () => {
      const originalLength = await Family.count();
      const parentOne = randPerson();
      const address = randAddress();
      const family = await Family.createWith({ parentOne, address });
      expect(await Family.count()).eq(originalLength + 1);
      expect(family.parentOne.englishName()).eq(Person.prototype.englishName.call(parentOne));
      expect(family.address.streetAddress()).eq(Address.prototype.streetAddress.call(address));
    });

    it('should have children', async () => {
      const family = await createRandFamily();
      let children = await family.getChildren();
      expect(children.length).eq(0);
      const child = await Person.create(randPerson());
      await family.addChild(child.id);
      children = await family.getChildren();
      expect(children.length).eq(1);
      const savedChild = children[0];
      expect(savedChild.name()).eq(child.name());
    });

    it('childrenNames', async () => {
      const family = await createRandFamily();
      expect(await family.childrenNames()).to.be.empty;

      const child1 = await Person.create(randPerson());
      const child2 = await Person.create(randPerson());
      await family.addChildren([child1.id, child2.id]);
      expect(await family.childrenNames()).eql([child1.name(), child2.name()]);
    });
  });
});
