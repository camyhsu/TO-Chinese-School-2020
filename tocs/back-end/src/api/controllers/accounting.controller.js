import { accountingService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';

export default {
  getInstructorDiscounts: asyncWrapper(async (_req, _res, next) => {
    next(response(await accountingService.getInstructorDiscounts()));
  }),
};
