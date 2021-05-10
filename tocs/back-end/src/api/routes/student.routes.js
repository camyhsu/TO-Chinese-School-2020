import controller from '../controllers/student.controller.js';
import { familyPermission, peoplePermission } from '../middleware/index.js';

export default (router) => {
  router.post(
    '/student/families/add_parent/:id',
    [familyPermission.isActionPermitted],
    controller.addParent,
  );

  router.post(
    '/student/families/add_child/:id',
    [familyPermission.isActionPermitted],
    controller.addChild,
  );

  router.get(
    '/student/families/edit_address/:id',
    [familyPermission.isActionPermitted],
    controller.getFamilyAddress,
  );

  router.put(
    '/student/families/edit_address/:id',
    [familyPermission.isActionPermitted],
    controller.editFamilyAddress,
  );

  router.get(
    '/student/people/edit/:id',
    [peoplePermission.isActionPermitted],
    controller.getPerson,
  );

  router.put(
    '/student/people/edit/:id',
    [peoplePermission.isActionPermitted],
    controller.editPerson,
  );

  router.post(
    '/student/people/new_address/:id',
    [peoplePermission.isActionPermitted],
    controller.addPersonalAddress,
  );

  router.get(
    '/student/people/edit_address/:id',
    [peoplePermission.isActionPermitted],
    controller.getPersonalAddress,
  );

  router.put(
    '/student/people/edit_address/:id',
    [peoplePermission.isActionPermitted],
    controller.editPersonalAddress,
  );

  router.get(
    '/student/transaction_history/index',
    [],
    controller.getTransactionHistory,
  );

  router.get(
    '/student/transaction_history/show_registration_payment',
    [],
    controller.getRegistrationPayment,
  );
};
