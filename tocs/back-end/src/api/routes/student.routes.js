import controller from '../controllers/student.controller.js';
import { familyPermission, peoplePermission } from '../middleware/index.js';

export default (router) => {
  router.post(
    '/student/families/add_parent',
    [familyPermission.isActionPermitted],
    controller.addParent,
  );

  router.post(
    '/student/families/add_child',
    [familyPermission.isActionPermitted],
    controller.addChild,
  );

  router.get(
    '/student/families/edit_address',
    [familyPermission.isActionPermitted],
    controller.getFamilyAddress,
  );

  router.put(
    '/student/families/edit_address',
    [familyPermission.isActionPermitted],
    controller.editFamilyAddress,
  );

  router.get(
    '/student/people/edit',
    [peoplePermission.isActionPermitted],
    controller.getPerson,
  );

  router.put(
    '/student/people/edit',
    [peoplePermission.isActionPermitted],
    controller.editPerson,
  );

  router.post(
    '/student/people/new_address',
    [peoplePermission.isActionPermitted],
    controller.addPersonalAddress,
  );

  router.get(
    '/student/people/edit_address',
    [peoplePermission.isActionPermitted],
    controller.getPersonalAddress,
  );

  router.put(
    '/student/people/edit_address',
    [peoplePermission.isActionPermitted],
    controller.editPersonalAddress,
  );
};
