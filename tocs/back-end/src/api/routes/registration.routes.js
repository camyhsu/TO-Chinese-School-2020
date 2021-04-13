import controller from '../controllers/registration.controller.js';

export default (router) => {
  router.get(
    '/admin/grades/index',
    [],
    controller.getGrades,
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
};
