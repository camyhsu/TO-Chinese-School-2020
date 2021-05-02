import controller from '../controllers/registration.controller.js';
import studentController from '../controllers/student.controller.js';

export default (router) => {
  router.get(
    '/admin/grades/index',
    [],
    controller.getGrades,
  );

  router.get(
    '/admin/school_classes/index',
    [],
    controller.getSchoolClasses,
  );

  router.get(
    '/admin/school_classes/active',
    [],
    controller.getActiveSchoolClassesForCurrentNextSchoolYear,
  );

  router.get(
    '/admin/school_classes/edit',
    [],
    controller.getSchoolClass,
  );

  router.put(
    '/admin/school_classes/edit',
    [],
    controller.saveSchoolClass,
  );

  router.post(
    '/admin/school_classes/new',
    [],
    controller.addSchoolClass,
  );

  router.put(
    '/admin/school_classes/toggle_active',
    [],
    controller.toggleActiveSchoolClass,
  );

  router.get(
    '/admin/school_years/index',
    [],
    controller.getSchoolYears,
  );

  router.get(
    '/admin/school_years/edit',
    [],
    controller.getSchoolYear,
  );

  router.put(
    '/admin/school_years/edit',
    [],
    controller.saveSchoolYear,
  );

  router.post(
    '/admin/school_years/new',
    [],
    controller.addSchoolYear,
  );

  router.get(
    '/admin/school_years/edit_book_charge',
    [],
    controller.getBookCharges,
  );

  router.put(
    '/admin/school_years/edit_book_charge',
    [],
    controller.saveBookCharges,
  );

  router.put(
    '/admin/school_years/toggle_auto_class_assignment',
    [],
    controller.toggleAutoClassAssignment,
  );

  router.get(
    '/admin/staff_assignments/index',
    [],
    controller.getStaffAssignments,
  );

  router.get(
    '/admin/staff_assignments/show',
    [],
    controller.getStaffAssignment,
  );

  router.post(
    '/registration/families/new',
    [],
    controller.addFamily,
  );

  router.get(
    '/registration/families/show',
    [],
    controller.getFamily,
  );

  router.get(
    '/registration/families/edit_address',
    [],
    studentController.getFamilyAddress,
  );

  router.put(
    '/registration/families/edit_address',
    [],
    studentController.editFamilyAddress,
  );

  router.post(
    '/registration/families/add_parent',
    [],
    studentController.addParent,
  );

  router.post(
    '/registration/families/add_child',
    [],
    studentController.addChild,
  );

  router.get(
    '/registration/people/index',
    [],
    controller.getPeople,
  );

  router.get(
    '/registration/people/show',
    [],
    controller.getPerson,
  );

  router.get(
    '/registration/people/edit',
    [],
    studentController.getPerson,
  );

  router.put(
    '/registration/people/edit',
    [],
    studentController.editPerson,
  );

  router.post(
    '/registration/people/new_address',
    [],
    studentController.addPersonalAddress,
  );

  router.put(
    '/registration/people/edit_address',
    [],
    studentController.editPersonalAddress,
  );
};
