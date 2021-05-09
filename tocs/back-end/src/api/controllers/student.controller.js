import { studentService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';

export default {
  addParent: asyncWrapper(async (req, _res, next) => {
    const { id: familyId } = req.query;
    next(response(await studentService.addParent(familyId, req.body)));
  }),
  addChild: asyncWrapper(async (req, _res, next) => {
    const { id: familyId } = req.query;
    next(response(await studentService.addChild(familyId, req.body)));
  }),
  getPerson: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.query;
    next(response(await studentService.getPerson(personId, req.body)));
  }),
  editPerson: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.query;
    next(response(await studentService.savePerson(personId, req.body)));
  }),
  getFamilyAddress: asyncWrapper(async (req, _res, next) => {
    const { id: familyId } = req.query;
    next(response(await studentService.getFamilyAddress(familyId)));
  }),
  editFamilyAddress: asyncWrapper(async (req, _res, next) => {
    const { id: familyId } = req.query;
    next(response(await studentService.saveFamilyAddress(familyId, req.body)));
  }),
  getPersonalAddress: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.query;
    next(response(await studentService.getPersonalAddress(personId)));
  }),
  editPersonalAddress: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.query;
    next(response(await studentService.savePersonalAddress(personId, req.body)));
  }),
  addPersonalAddress: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.query;
    next(response(await studentService.addPersonalAddress(personId, req.body)));
  }),
  getTransactionHistory: asyncWrapper(async (req, _res, next) => {
    next(response(await studentService.getTransactionHistoryByUser(req.userId)));
  }),
};
