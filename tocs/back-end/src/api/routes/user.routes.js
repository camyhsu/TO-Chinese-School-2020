import { rolePermission } from '../middleware/index.js';
import controller from '../controllers/user.controller.js';

export default (router) => {
  router.get(
    '/board/student-parent',
    [rolePermission.isStudentParent],
    controller.studentParentBoard,
  );

  router.get(
    '/board/instructor',
    [rolePermission.isInstructor],
    controller.instructorBoard,
  );

  router.put(
    '/change-password',
    [],
    controller.changePassword,
  );
};
