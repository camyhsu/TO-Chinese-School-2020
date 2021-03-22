import { studentService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';

export default {
  addParent: asyncWrapper(async (req, _res, next) => {
    const { familyId } = req.query;
    next(response(await studentService.addParent(familyId, req.body)));
  }),
  addChild: asyncWrapper(async (req, _res, next) => {
    const { familyId } = req.query;
    next(response(await studentService.addChild(familyId, req.body)));
  }),
  editPerson: asyncWrapper(async (req, _res, next) => {
    const { personId } = req.query;
    next(response(await studentService.savePerson(personId, req.body)));
  }),
  editPersonAddress: asyncWrapper(async (req, _res, next) => {
    const { personId } = req.query;
    next(response(await studentService.savePersonAddress(personId, req.body)));
  }),
  editFamilyAddress: asyncWrapper(async (req, _res, next) => {
    const { familyId } = req.query;
    next(response(await studentService.saveFamilyAddress(familyId, req.body)));
  }),
};
