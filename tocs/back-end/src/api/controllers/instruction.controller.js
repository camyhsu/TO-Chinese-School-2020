import { instructionService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';

export default {
  showSchoolClass: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    const { schoolYearId } = req.query;
    next(response(await instructionService.getSchoolClass(id, schoolYearId)));
  }),
};
