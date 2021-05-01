import dataService from './data.service';

const getLibraryBooks = () => dataService.get('librarian/library_books/index');

const getLibraryBookCheckOutHistory = (bookId) => dataService.get('librarian/library_books/checkout_history?id=' + bookId);

const addLibraryBook = (obj) => dataService.post('librarian/library_books/new', obj);

const saveLibraryBook = (bookId, obj) => dataService.put('librarian/library_books/edit?id=' + bookId, obj);

const getLibraryBook = (bookId) => dataService.get('librarian/library_books/edit?id=' + bookId);

const checkOutLibraryBook = (bookId, obj) => dataService.post('librarian/library_books/check_out_library_book?id=' + bookId, obj);

const returnLibraryBook = (bookId, obj) => dataService.put('librarian/library_books/return_library_book?id=' + bookId, obj);

const obj = {
    getLibraryBooks, getLibraryBookCheckOutHistory,
    addLibraryBook, saveLibraryBook, getLibraryBook, checkOutLibraryBook, returnLibraryBook
};

export default obj;