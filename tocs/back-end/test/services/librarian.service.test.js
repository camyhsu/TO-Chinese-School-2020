import { librarianService } from "../../src/services/index";
import { randPerson, randBook, toObj } from "../../src/utils/utilities";
import db from "../../src/models/index";

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
      expect(r.length).toBe(originalBooksCount + 1);
      expect(await book.findCurrentCheckoutRecord()).toBeNull();
    });

    it("should checkout", async () => {
      borrower = await Person.create(randPerson());
      expect((await book.getCheckOuts()).length).toBe(0);
      expect(book.checkedOut).not.toBe(true);

      await librarianService.checkOutLibraryBook(book.id, {
        checkedOutBy: borrower.id,
        checkedOutDate: new Date(),
        note: "Nice book!",
      });

      expect((await book.getCheckOuts()).length).toBe(1);
      const updatedBook = await librarianService.getLibraryBook(book.id);
      expect(updatedBook.checkedOut).toBe(true);
      expect(await book.findCurrentCheckoutRecord()).not.toBeNull();

      const r = await librarianService.getLibraryBooks();
      const theBook = toObj(r.filter((b) => b.id === book.id)[0]);
      expect(theBook.checkOut.checked_out_by_id).toBe(borrower.id);
      expect(theBook.borrower.id).toBe(borrower.id);
    });

    it("should return", async () => {
      const dbBook = await librarianService.getLibraryBook(book.id);
      expect(dbBook.checkedOut).toBe(true);
      expect(await dbBook.findCurrentCheckoutRecord()).not.toBeNull();

      await librarianService.returnLibraryBook(book.id, {
        returnDate: new Date(),
        note: "Nice book indeed!",
      });
      const updatedBook = await librarianService.getLibraryBook(book.id);
      expect(updatedBook.checkedOut).toBe(false);
      expect(await updatedBook.findCurrentCheckoutRecord()).toBeNull();
    });
  });
});
