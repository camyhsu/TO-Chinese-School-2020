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
    const { id } = req.params;
    next(response(await registrationService.getSchoolClass(id)));
  }),
  getActiveSchoolClasses: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await registrationService.getActiveSchoolClasses(schoolYearId)));
  }),
  getActiveSchoolClassesForCurrentNextSchoolYear: asyncWrapper(async (req, _res, next) => {
    next(response(await registrationService.getActiveSchoolClassesForCurrentNextSchoolYear()));
  }),
  addSchoolClass: asyncWrapper(async (req, _res, next) => {
    next(response(await registrationService.addSchoolClass(req.body)));
  }),
  saveSchoolClass: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.saveSchoolClass(id, req.body)));
  }),
  toggleActiveSchoolClass: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    const { schoolYearId, active } = req.query;
    next(response(await registrationService.toggleActiveSchoolClass(id, schoolYearId, active)));
  }),
  getSchoolYears: asyncWrapper(async (_req, _res, next) => {
    next(response(await registrationService.getSchoolYears()));
  }),
  getSchoolYear: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.getSchoolYear(id)));
  }),
  addSchoolYear: asyncWrapper(async (req, _res, next) => {
    next(response(await registrationService.addSchoolYear(req.body)));
  }),
  saveSchoolYear: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.saveSchoolYear(id, req.body)));
  }),
  getBookCharges: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await registrationService.getBookCharges(schoolYearId)));
  }),
  saveBookCharges: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await registrationService.saveBookCharges(schoolYearId, req.body)));
  }),
  toggleAutoClassAssignment: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.toggleAutoClassAssignment(id)));
  }),
  getStaffAssignments: asyncWrapper(async (_req, _res, next) => {
    next(response(await registrationService.getStaffAssignments()));
  }),
  getStaffAssignment: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.getStaffAssignment(id)));
  }),
  addFamily: asyncWrapper(async (req, _res, next) => {
    next(response(await registrationService.addFamily(req.body)));
  }),
  getFamily: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.getFamily(id)));
  }),
  getPeople: asyncWrapper(async (req, _res, next) => {
    const { limit, offset, searchText } = req.query;
    next(response(await registrationService.getPeople({ limit, offset, searchText })));
  }),
  getPerson: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.getPerson(id)));
  }),
  getGradeStudentCount: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await registrationService.getGradeStudentCount(schoolYearId)));
  }),
  getSchoolClassStudentCount: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await registrationService.getSchoolClassStudentCount(schoolYearId)));
  }),
  getElectiveSchoolClassStudentCount: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await registrationService.getSchoolClassStudentCount(schoolYearId, true)));
  }),
  getSiblingInSameGrade: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await registrationService.getSiblingInSameGrade(schoolYearId)));
  }),
  getDailyOnlineRegistrationSummary: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await registrationService.getDailyOnlineRegistrationSummary(schoolYearId)));
  }),
  getInstructorAssignmentForm: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.getInstructorAssignmentForm(id)));
  }),

  addInstructorAssignment: asyncWrapper(async (req, _res, next) => {
    const { personId } = req.query;
    next(response(await registrationService.addInstructorAssignment(personId, req.body)));
  }),

  saveInstructorAssignment: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.saveInstructorAssignment(id, req.body)));
  }),

  deleteInstructorAssignment: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await registrationService.deleteInstructorAssignment(id)));
  }),

  getActiveStudentsByName: asyncWrapper(async (req, _res, next) => {
    next(response(await registrationService.getActiveStudentsByName()));
  }),
};
