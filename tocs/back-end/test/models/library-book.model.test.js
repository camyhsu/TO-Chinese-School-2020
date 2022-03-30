/* global describe, it */
import db from "../../src/models/index.js";
import { modelTests } from "./model-test-utils.js";
import { randPerson, randBook } from "../../src/utils/utilities.js";

const { LibraryBook, LibraryBookCheckOut, Person } = db;

describe("Test LibraryBook", () => {
  describe(
    "LibraryBook - CRUD",
    modelTests(LibraryBook, {
      fieldToTest: "title",
      object: randBook(),
    })
  );

  describe("Checkouts", () => {
    it("should have checkouts", async () => {
      const book = await LibraryBook.create(randBook());
      let checkouts = await book.getCheckOuts();
      const originalLength = checkouts.length;

      const person1 = await Person.createWith(randPerson());
      const r1 = await LibraryBookCheckOut.create({
        checkedOutDate: new Date(),
        library_book_id: book.id,
        checked_out_by_id: person1.id,
      });
      expect((await r1.getLibraryBook()).id).toBe(book.id);
      expect((await r1.getCheckedOutBy()).id).toBe(person1.id);

      checkouts = await book.getCheckOuts();
      expect(checkouts.length).toBe(originalLength + 1);

      const person2 = await Person.createWith(randPerson());
      const r2 = await LibraryBookCheckOut.create({
        checkedOutDate: new Date(),
        library_book_id: book.id,
        checked_out_by_id: person2.id,
      });
      expect((await r2.getLibraryBook()).id).toBe(book.id);
      expect((await r2.getCheckedOutBy()).id).toBe(person2.id);

      checkouts = await book.getCheckOuts();
      expect(checkouts.length).toBe(originalLength + 2);
    });
  });

  describe("Find current checkout", () => {
    it("should have current checkout", async () => {
      const book = await LibraryBook.create(randBook());
      let r = await book.findCurrentCheckoutRecord();
      expect(r).toBeNull();

      const person1 = await Person.createWith(randPerson());
      let borrowers = await LibraryBookCheckOut.getBorrowers();
      expect(borrowers.filter((p) => p.id === person1.id).length).toBe(0);

      const checkout = await LibraryBookCheckOut.create({
        checkedOutDate: new Date(),
        library_book_id: book.id,
        checked_out_by_id: person1.id,
      });
      expect((await checkout.getLibraryBook()).id).toBe(book.id);
      expect((await checkout.getCheckedOutBy()).id).toBe(person1.id);

      r = await book.findCurrentCheckoutRecord();
      expect(r.id).toBe(checkout.id);

      r = await LibraryBookCheckOut.notReturned();
      const originalNotReturnedLength = r.length;

      borrowers = await LibraryBookCheckOut.getBorrowers();
      expect(borrowers.filter((p) => p.id === person1.id).length).toBe(1);

      // Return
      checkout.returnDate = new Date();
      await checkout.save();

      r = await book.findCurrentCheckoutRecord();
      expect(r).toBeNull();

      r = await LibraryBookCheckOut.notReturned();
      expect(r.length).toBe(originalNotReturnedLength - 1);

      borrowers = await LibraryBookCheckOut.getBorrowers();
      expect(borrowers.filter((p) => p.id === person1.id).length).toBe(0);
    });
  });
});
