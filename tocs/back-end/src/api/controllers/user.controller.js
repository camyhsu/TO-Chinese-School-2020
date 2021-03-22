import { userService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';

export default {
  allAccess: (_req, _res, next) => {
    next(response('Public Content.'));
  },
  studentParentBoard: async (req, _res, next) => {
    next(response(await userService.studentParentBoard(req.userId)));
  },
  instructorBoard: async (_req, _res, next) => {
    // TODO
    next(response('TO BE IMPLMENTED'));
  },
};
