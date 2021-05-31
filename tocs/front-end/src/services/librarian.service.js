import dataService from './data.service';

const getLibraryBooks = (readOnly) => dataService.get(`librarian/library_books/${readOnly ? 'read_only_view' : 'index'}`);

const getLibraryBookCheckOutHistory = (bookId) => dataService.get('librarian/library_books/checkout_history/' + bookId);

const addLibraryBook = (obj) => dataService.post('librarian/library_books/new', obj);

const saveLibraryBook = (bookId, obj) => dataService.put('librarian/library_books/edit/' + bookId, obj);

const getLibraryBook = (bookId) => dataService.get('librarian/library_books/edit/' + bookId);

const checkOutLibraryBook = (bookId, obj) => dataService.post('librarian/library_books/check_out_library_book/' + bookId, obj);

const returnLibraryBook = (bookId, obj) => dataService.put('librarian/library_books/return_library_book/' + bookId, obj);

const searchStudents = (schoolYearId, startDate, endDate) => dataService.get(`librarian/search_students/search_result?schoolYearId=${schoolYearId}&startDate=${startDate}&endDate=${endDate}`);

const initializeSearchStudents = () => dataService.get('librarian/search_students/index');

const obj = {
    getLibraryBooks, getLibraryBookCheckOutHistory, searchStudents, initializeSearchStudents,
    addLibraryBook, saveLibraryBook, getLibraryBook, checkOutLibraryBook, returnLibraryBook
};

export default obj;