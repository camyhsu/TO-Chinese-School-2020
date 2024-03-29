import { accountingService } from "../../services/index";
import { response } from "../../utils/response-factory";
import { asyncWrapper } from "./utils";

export default {
  getInstructorDiscounts: asyncWrapper(async (_req, _res, next) => {
    next(response(await accountingService.getInstructorDiscounts()));
  }),

  getManualTransactionsForLastTwoYears: asyncWrapper(
    async (_req, _res, next) => {
      next(
        response(await accountingService.getManualTransactionsForLastTwoYears())
      );
    }
  ),

  getInPersonRegistrationPayments: asyncWrapper(async (_req, _res, next) => {
    next(response(await accountingService.getInPersonRegistrationPayments()));
  }),

  getChargesCollected: asyncWrapper(async (req, _res, next) => {
    const { schoolYearId } = req.params;
    next(response(await accountingService.getChargesCollected(schoolYearId)));
  }),

  initializeManualTransaction: asyncWrapper(async (req, _res, next) => {
    const { personId } = req.query;
    next(
      response(await accountingService.initializeManualTransaction(personId))
    );
  }),

  addManualTransaction: asyncWrapper(async (req, _res, next) => {
    next(
      response(
        await accountingService.addManualTransaction(req.body, req.userId)
      )
    );
  }),

  getWithdrawRequests: asyncWrapper(async (req, _res, next) => {
    next(response(await accountingService.getWithdrawRequests()));
  }),

  getWithdrawRequest: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    next(response(await accountingService.getWithdrawRequest(id)));
  }),
};
