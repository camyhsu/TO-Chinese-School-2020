import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';

export default {
  showSchoolClass: asyncWrapper(async (_req, _res, next) => {
    console.log('instructor controller - showSchoolClass');
    next(response('showSchoolClass......'));
  }),
};
