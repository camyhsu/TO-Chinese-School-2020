import { ACTION_SUCCESS, SET_MESSAGE } from "./types";

import LibrarianService from "../services/librarian.service";

const commonFn = (p, dispatch) =>
  p.then(
    (response) => {
      dispatch({
        type: ACTION_SUCCESS,
        payload: "/librarian/books",
      });
      dispatch({
        type: SET_MESSAGE,
        payload: response && "Success",
      });
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );

const saveLibraryBook = (bookId, obj) => (dispatch) =>
  commonFn(LibrarianService.saveLibraryBook(bookId, obj), dispatch);

const addLibraryBook = (obj) => (dispatch) =>
  commonFn(LibrarianService.addLibraryBook(obj), dispatch);

const getLibraryBook = (bookId) => (_dispatch) =>
  LibrarianService.getLibraryBook(bookId);

const checkOutLibraryBook = (bookId, obj) => (dispatch) =>
  commonFn(LibrarianService.checkOutLibraryBook(bookId, obj), dispatch);

const returnLibraryBook = (bookId, obj) => (dispatch) =>
  commonFn(LibrarianService.returnLibraryBook(bookId, obj), dispatch);

export {
  saveLibraryBook,
  addLibraryBook,
  getLibraryBook,
  checkOutLibraryBook,
  returnLibraryBook,
};
