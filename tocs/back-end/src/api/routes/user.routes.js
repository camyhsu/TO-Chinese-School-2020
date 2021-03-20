import { authJwt } from '../middleware/index.js';
import controller from '../controllers/user.controller.js';

export default (app) => {
  app.get('/api/test/all', controller.allAccess);

  app.get(
    '/api/user/student-parent',
    [authJwt.verifyToken, authJwt.isStudentParent],
    controller.studentParentBoard,
  );
};
