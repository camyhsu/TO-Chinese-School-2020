import Sequelize from 'sequelize';
import db from '../models/index.js';
import { dataNotFound } from '../utils/response-factory.js';
import { collectionToObj } from '../utils/utilities.js';

const { Op } = Sequelize;
const {
  LibraryBook, LibraryBookCheckOut, Person,
} = db;

export default {
  getLibraryBook: async (id) => LibraryBook.getById(id),
  getLibraryBookCheckOutHistory: async (id) => {
    const books = await LibraryBook.findAll({
      include: [{
        model: LibraryBookCheckOut,
        as: 'checkOuts',
        include: [{
          model: Person,
          as: 'checkedOutBy',
        }],
      }],
      where: { id: { [Op.eq]: id } },
    });
    const obj = books && books[0];
    obj.dataValues.eligibleCheckoutPeople = [{
      id: 2190, name: 'Person 1',
    }, {
      id: 2196, name: 'Person 2',
    }];
    return obj;
  },
  getLibraryBooks: async () => {
    const books = await LibraryBook.findAll();
    const bookMap = collectionToObj(books);
    const borrowers = await LibraryBookCheckOut.getBorrowers();
    const borrowerMap = collectionToObj(borrowers);

    const checkOuts = await LibraryBookCheckOut.notReturned();
    checkOuts.forEach((checkOut) => {
      bookMap[checkOut.libraryBookId].dataValues.checkOut = checkOut;
      bookMap[checkOut.libraryBookId].dataValues.borrower = borrowerMap[checkOut.checked_out_by_id];
    });
    return books;
  },
  addLibraryBook: async (obj) => LibraryBook.create(obj),
  saveLibraryBook: async (bookId, obj) => {
    const book = await LibraryBook.getById(bookId);
    Object.assign(book, obj);
    await book.save();
  },
  checkOutLibraryBook: async (id, {
    checkedOutBy, checkedOutDate, note,
  } = {}) => {
    const book = await LibraryBook.getById(id);
    if (book) {
      const person = await Person.getById(checkedOutBy);
      if (person) {
        const checkOut = await LibraryBookCheckOut.create({
          checkedOutDate,
          library_book_id: id,
          checked_out_by_id: checkedOutBy,
          note,
        });
        book.checkedOut = true;
        await book.save();
        return checkOut;
      }
      throw dataNotFound('Person not found');
    }
    throw dataNotFound('Book not found');
  },
  returnLibraryBook: async (id, { returnDate, note } = {}) => {
    const book = await LibraryBook.getById(id);
    if (book) {
      const checkout = await book.findCurrentCheckoutRecord();
      checkout.returnDate = returnDate;
      if (note) {
        checkout.note += ` -- ${note}`;
      }
      await checkout.save();
      book.checkedOut = false;
      await book.save();
      return checkout;
    }
    throw dataNotFound('Book not found');
  },
};
