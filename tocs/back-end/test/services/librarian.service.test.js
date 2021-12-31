/* global describe it */
import { expect } from "chai";
import { librarianService } from "../../src/services/index.js";
import { randPerson, randBook, toObj } from "../../src/utils/utilities.js";
import db from "../../src/models/index.js";

const { Person } = db;

describe("Test librarianService", () => {
  describe("Add book", () => {
    const rawBook = randBook();
    let book = null;
    let borrower = null;

    it("should add a book", async () => {
      let r = await librarianService.getLibraryBooks();
      const originalBooksCount = r.length;
      book = await librarianService.addLibraryBook(rawBook);
      r = await librarianService.getLibraryBooks();
      expect(r.length).to.eq(originalBooksCount + 1);
      expect(await book.findCurrentCheckoutRecord()).to.be.null;
    });

    it("should checkout", async () => {
      borrower = await Person.create(randPerson());
      expect((await book.getCheckOuts()).length).to.eq(0);
      expect(book.checkedOut).to.not.eq(true);

      await librarianService.checkOutLibraryBook(book.id, {
        checkedOutBy: borrower.id,
        checkedOutDate: new Date(),
        note: "Nice book!",
      });

      expect((await book.getCheckOuts()).length).to.eq(1);
      const updatedBook = await librarianService.getLibraryBook(book.id);
      expect(updatedBook.checkedOut).to.eq(true);
      expect(await book.findCurrentCheckoutRecord()).to.be.not.null;

      const r = await librarianService.getLibraryBooks();
      const theBook = toObj(r.filter((b) => b.id === book.id)[0]);
      expect(theBook.checkOut.checked_out_by_id).to.eq(borrower.id);
      expect(theBook.borrower.id).to.eq(borrower.id);
    });

    it("should return", async () => {
      const dbBook = await librarianService.getLibraryBook(book.id);
      expect(dbBook.checkedOut).to.eq(true);
      expect(await dbBook.findCurrentCheckoutRecord()).to.be.not.null;

      await librarianService.returnLibraryBook(book.id, {
        returnDate: new Date(),
        note: "Nice book indeed!",
      });
      const updatedBook = await librarianService.getLibraryBook(book.id);
      expect(updatedBook.checkedOut).to.eq(false);
      expect(await updatedBook.findCurrentCheckoutRecord()).to.be.null;
    });
  });
});
