import controller from '../controllers/student.controller.js';

export default (router) => {
  router.post(
    '/student/families/add_parent',
    [],
    controller.addParent,
  );
};
