import { userService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';

export default {
  addParent: (_req, _res, next) => {
    console.log('student controller - addParent');
    next(response('addParent......'));
  },
};
