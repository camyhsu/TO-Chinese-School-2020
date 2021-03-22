import controller from '../controllers/student.controller.js';

export default (router) => {
  router.post(
    '/student/families/add_parent',
    [],
    controller.addParent,
  );

  router.post(
    '/student/families/add_child',
    [],
    controller.addChild,
  );

  router.put(
    '/student/families/edit_address',
    [],
    controller.editFamilyAddress,
  );

  router.put(
    '/student/people/edit',
    [],
    controller.editPerson,
  );

  router.put(
    '/student/people/edit_address',
    [],
    controller.editPersonAddress,
  );
};
