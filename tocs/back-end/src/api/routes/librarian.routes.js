import controller from "../controllers/librarian.controller";

export default (router) => {
  router.get("/librarian/library_books/index", [], controller.getLibraryBooks);

  router.get(
    "/librarian/library_books/read_only_view",
    [],
    controller.getLibraryBooks
  );

  router.post("/librarian/library_books/new", [], controller.addLibraryBook);

  router.get(
    "/librarian/library_books/edit/:id",
    [],
    controller.getLibraryBook
  );

  router.put(
    "/librarian/library_books/edit/:id",
    [],
    controller.editLibraryBook
  );

  router.get(
    "/librarian/library_books/checkout_history/:id",
    [],
    controller.getLibraryBookCheckOutHistory
  );

  router.get(
    "/librarian/search_students/index",
    [],
    controller.initializeSearchStudents
  );

  router.get(
    "/librarian/search_students/search_result",
    [],
    controller.searchStudents
  );

  router.post(
    "/librarian/library_books/check_out_library_book/:id",
    [],
    controller.checkOutLibraryBook
  );

  router.put(
    "/librarian/library_books/return_library_book/:id",
    [],
    controller.returnLibraryBook
  );
};
