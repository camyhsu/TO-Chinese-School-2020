import controller from "../controllers/student.controller.js";
import { familyPermission, peoplePermission } from "../middleware/index.js";

export default (router) => {
  router.post(
    "/student/families/add_parent/:id",
    [familyPermission.isActionPermitted],
    controller.addParent
  );

  router.post(
    "/student/families/add_child/:id",
    [familyPermission.isActionPermitted],
    controller.addChild
  );

  router.get(
    "/student/families/edit_address/:id",
    [familyPermission.isActionPermitted],
    controller.getFamilyAddress
  );

  router.put(
    "/student/families/edit_address/:id",
    [familyPermission.isActionPermitted],
    controller.editFamilyAddress
  );

  router.get(
    "/student/people/edit/:id",
    [peoplePermission.isActionPermitted],
    controller.getPerson
  );

  router.put(
    "/student/people/edit/:id",
    [peoplePermission.isActionPermitted],
    controller.editPerson
  );

  router.post(
    "/student/people/new_address/:id",
    [peoplePermission.isActionPermitted],
    controller.addPersonalAddress
  );

  router.get(
    "/student/people/edit_address/:id",
    [peoplePermission.isActionPermitted],
    controller.getPersonalAddress
  );

  router.put(
    "/student/people/edit_address/:id",
    [peoplePermission.isActionPermitted],
    controller.editPersonalAddress
  );

  router.get(
    "/student/transaction_history/index",
    [],
    controller.getTransactionHistory
  );

  router.get(
    "/student/transaction_history/show_registration_payment/:id",
    [],
    controller.getRegistrationPayment
  );

  router.get(
    "/student/transaction_history/show_registration_payment_for_staff/:id",
    [],
    controller.getRegistrationPaymentForStaff
  );

  router.get(
    "/student/registration/display_options",
    [],
    controller.getStudentRegistrationDisplayOptions
  );

  router.post(
    "/student/registration/save_registration_preferences",
    [],
    controller.saveRegistrationPreferences
  );

  router.post(
    "/student/registration/payment_entry",
    [],
    controller.initializeRegistrationPayment
  );

  router.post(
    "/student/registration/submit_payment/:id",
    [],
    controller.savePayment
  );
};
