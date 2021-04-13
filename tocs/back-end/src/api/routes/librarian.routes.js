import controller from '../controllers/librarian.controller.js';

export default (router) => {
  router.get(
    '/librarian/library_books/index',
    [],
    controller.getLibraryBooks,
  );

  router.post(
    '/librarian/library_books/new',
    [],
    controller.addLibraryBook,
  );

  router.get(
    '/librarian/library_books/edit',
    [],
    controller.getLibraryBook,
  );

  router.put(
    '/librarian/library_books/edit',
    [],
    controller.editLibraryBook,
  );

  router.get(
    '/librarian/library_books/checkout_history',
    [],
    controller.getLibraryBookCheckOutHistory,
  );

  router.post(
    '/librarian/library_books/check_out_library_book',
    [],
    controller.checkOutLibraryBook,
  );

  router.put(
    '/librarian/library_books/return_library_book',
    [],
    controller.returnLibraryBook,
  );
};
