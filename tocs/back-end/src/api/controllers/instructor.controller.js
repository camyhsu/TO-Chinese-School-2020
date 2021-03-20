import { response } from '../../utils/response-factory.js';

export default {
  showSchoolClass: (_req, _res, next) => {
    console.log('instructor controller - showSchoolClass');
    next(response('showSchoolClass......'));
  },
};
