import { registrationService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';

export default {
  getGrades: asyncWrapper(async (_req, _res, next) => {
    next(response(await registrationService.getGrades()));
  }),
  getSchoolYears: asyncWrapper(async (_req, _res, next) => {
    next(response(await registrationService.getSchoolYears()));
  }),
  getSchoolYear: asyncWrapper(async (req, _res, next) => {
    const { id } = req.query;
    next(response(await registrationService.getSchoolYear(id)));
  }),
  addSchoolYear: asyncWrapper(async (req, _res, next) => {
    next(response(await registrationService.addSchoolYear(req.body)));
  }),
  saveSchoolYear: asyncWrapper(async (req, _res, next) => {
    const { id } = req.query;
    next(response(await registrationService.saveSchoolYear(id, req.body)));
  }),
  toggleAutoClassAssignment: asyncWrapper(async (req, _res, next) => {
    const { id } = req.query;
    next(response(await registrationService.toggleAutoClassAssignment(id)));
  }),
  getStaffAssignments: asyncWrapper(async (_req, _res, next) => {
    next(response(await registrationService.getStaffAssignments()));
  }),
  getStaffAssignment: asyncWrapper(async (req, _res, next) => {
    const { id } = req.query;
    next(response(await registrationService.getStaffAssignment(id)));
  }),
};
