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
    '/admin/school_classes/toggle_active',
    [],
    controller.getActiveSchoolClassesForCurrentNextSchoolYear,
  );

  router.get(
    '/admin/school_classes/edit/:id',
    [],
    controller.getSchoolClass,
  );

  router.put(
    '/admin/school_classes/edit/:id',
    [],
    controller.saveSchoolClass,
  );

  router.post(
    '/admin/school_classes/new',
    [],
    controller.addSchoolClass,
  );

  router.put(
    '/admin/school_classes/toggle_active/:id',
    [],
    controller.toggleActiveSchoolClass,
  );

  router.get(
    '/admin/school_years/index',
    [],
    controller.getSchoolYears,
  );

  router.get(
    '/admin/school_years/edit/:id',
    [],
    controller.getSchoolYear,
  );

  router.put(
    '/admin/school_years/edit/:id',
    [],
    controller.saveSchoolYear,
  );

  router.post(
    '/admin/school_years/new',
    [],
    controller.addSchoolYear,
  );

  router.get(
    '/admin/school_years/edit_book_charge/:schoolYearId',
    [],
    controller.getBookCharges,
  );

  router.put(
    '/admin/school_years/edit_book_charge/:schoolYearId',
    [],
    controller.saveBookCharges,
  );

  router.put(
    '/admin/school_years/toggle_auto_class_assignment/:id',
    [],
    controller.toggleAutoClassAssignment,
  );

  router.get(
    '/admin/staff_assignments/index',
    [],
    controller.getStaffAssignments,
  );

  router.get(
    '/admin/staff_assignments/show/:id',
    [],
    controller.getStaffAssignment,
  );

  router.post(
    '/registration/families/new',
    [],
    controller.addFamily,
  );

  router.get(
    '/registration/families/show/:id',
    [],
    controller.getFamily,
  );

  router.get(
    '/registration/families/edit_address/:id',
    [],
    studentController.getFamilyAddress,
  );

  router.put(
    '/registration/families/edit_address/:id',
    [],
    studentController.editFamilyAddress,
  );

  router.post(
    '/registration/families/add_parent/:id',
    [],
    studentController.addParent,
  );

  router.post(
    '/registration/families/add_child/:id',
    [],
    studentController.addChild,
  );

  router.get(
    '/registration/people/index',
    [],
    controller.getPeople,
  );

  router.get(
    '/registration/people/show/:id',
    [],
    controller.getPerson,
  );

  router.get(
    '/registration/people/edit/:id',
    [],
    studentController.getPerson,
  );

  router.put(
    '/registration/people/edit/:id',
    [],
    studentController.editPerson,
  );

  router.post(
    '/registration/people/new_address/:id',
    [],
    studentController.addPersonalAddress,
  );

  router.get(
    '/registration/people/edit_address/:id',
    [],
    studentController.getPersonalAddress,
  );

  router.put(
    '/registration/people/edit_address/:id',
    [],
    studentController.editPersonalAddress,
  );

  router.get(
    '/registration/active_school_classes/index/:schoolYearId',
    [],
    controller.getActiveSchoolClasses,
  );

  router.get(
    '/registration/active_school_classes/grade_student_count/:schoolYearId',
    [],
    controller.getGradeStudentCount,
  );

  router.get(
    '/registration/active_school_classes/grade_class_student_count/:schoolYearId',
    [],
    controller.getSchoolClassStudentCount,
  );

  router.get(
    '/registration/active_school_classes/elective_class_student_count/:schoolYearId',
    [],
    controller.getElectiveSchoolClassStudentCount,
  );

  router.get(
    '/registration/report/sibling_in_same_grade/:schoolYearId',
    [],
    controller.getSiblingInSameGrade,
  );

  router.get(
    '/registration/people/add_instructor_assignment/:id',
    [],
    controller.getInstructorAssignmentForm,
  );

  router.post(
    '/registration/people/add_instructor_assignment',
    [],
    controller.addInstructorAssignment,
  );

  router.put(
    '/registration/people/add_instructor_assignment/:id',
    [],
    controller.saveInstructorAssignment,
  );

  router.delete(
    '/registration/instructor_assignments/destroy/:id',
    [],
    controller.deleteInstructorAssignment,
  );
};
