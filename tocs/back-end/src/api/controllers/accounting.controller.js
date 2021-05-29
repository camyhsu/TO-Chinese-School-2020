import { accountingService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';

export default {
  getInstructorDiscounts: asyncWrapper(async (_req, _res, next) => {
    next(response(await accountingService.getInstructorDiscounts()));
  }),

  getManualTransactionsForLastTwoYears: asyncWrapper(async (_req, _res, next) => {
    next(response(await accountingService.getManualTransactionsForLastTwoYears()));
  }),

  getInPersonRegistrationPayments: asyncWrapper(async (_req, _res, next) => {
    next(response(await accountingService.getInPersonRegistrationPayments()));
  }),

  getChargesCollected: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await accountingService.getChargesCollected(schoolYearId)));
  }),

  initializeManualTransaction: asyncWrapper(async (req, _res, next) => {
    const { personId } = req.query;
    next(response(await accountingService.initializeManualTransaction(personId)));
  }),

  addManualTransaction: asyncWrapper(async (req, _res, next) => {
    next(response(await accountingService.addManualTransaction(req.body, req.userId)));
  }),
};
