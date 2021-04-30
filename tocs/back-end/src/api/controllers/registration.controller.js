import { registrationService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';

export default {
  getGrades: asyncWrapper(async (_req, _res, next) => {
    next(response(await registrationService.getGrades()));
  }),
  getSchoolClasses: asyncWrapper(async (_req, _res, next) => {
    next(response(await registrationService.getSchoolClasses()));
  }),
  getSchoolClass: asyncWrapper(async (req, _res, next) => {
    const { id } = req.query;
    next(response(await registrationService.getSchoolClass(id)));
  }),
  getActiveSchoolClassesForCurrentNextSchoolYear: asyncWrapper(async (req, _res, next) => {
    next(response(await registrationService.getActiveSchoolClassesForCurrentNextSchoolYear()));
  }),
  addSchoolClass: asyncWrapper(async (req, _res, next) => {
    next(response(await registrationService.addSchoolClass(req.body)));
  }),
  saveSchoolClass: asyncWrapper(async (req, _res, next) => {
    const { id } = req.query;
    next(response(await registrationService.saveSchoolClass(id, req.body)));
  }),
  toggleActiveSchoolClass: asyncWrapper(async (req, _res, next) => {
    const { id, schoolYearId, active } = req.query;
    next(response(await registrationService.toggleActiveSchoolClass(id, schoolYearId, active)));
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
  addFamily: asyncWrapper(async (req, _res, next) => {
    next(response(await registrationService.addFamily(req.body)));
  }),
  getFamily: asyncWrapper(async (req, _res, next) => {
    const { id } = req.query;
    next(response(await registrationService.getFamily(id)));
  }),
  getPeople: asyncWrapper(async (req, _res, next) => {
    const { limit, offset, searchText } = req.query;
    next(response(await registrationService.getPeople({ limit, offset, searchText })));
  }),
  getPerson: asyncWrapper(async (req, _res, next) => {
    const { id } = req.query;
    next(response(await registrationService.getPerson(id)));
  }),
};
