import { librarianService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';

export default {
  getLibraryBook: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await librarianService.getLibraryBook(id)));
  }),
  getLibraryBooks: asyncWrapper(async (_req, _res, next) => {
    next(response(await librarianService.getLibraryBooks()));
  }),
  addLibraryBook: asyncWrapper(async (req, _res, next) => {
    next(response(await librarianService.addLibraryBook(req.body)));
  }),
  editLibraryBook: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await librarianService.saveLibraryBook(id, req.body)));
  }),
  getLibraryBookCheckOutHistory: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await librarianService.getLibraryBookCheckOutHistory(id)));
  }),
  checkOutLibraryBook: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await librarianService.checkOutLibraryBook(id, req.body)));
  }),
  returnLibraryBook: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await librarianService.returnLibraryBook(id, req.body)));
  }),
};
