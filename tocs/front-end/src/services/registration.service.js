import dataService from "./data.service";

const getGrades = () => dataService.get("admin/grades/index");

const getSchoolClasses = () => dataService.get("admin/school_classes/index");

const getActiveSchoolClassesForCurrentNextSchoolYear = () =>
  dataService.get("admin/school_classes/toggle_active");

const getSchoolClass = (schoolYearId) =>
  dataService.get("admin/school_classes/edit/" + schoolYearId);

const saveSchoolClass = (schoolYearId, obj) =>
  dataService.put("admin/school_classes/edit/" + schoolYearId, obj);

const addSchoolClass = (obj) =>
  dataService.post("admin/school_classes/new", obj);

const toggleActiveSchoolClass = (id, schoolYearId, active) =>
  dataService.put(
    `admin/school_classes/toggle_active/${id}?schoolYearId=${schoolYearId}&active=${active}`
  );

const getSchoolYears = () => dataService.get("admin/school_years/index");

const getSchoolYear = (schoolYearId) =>
  dataService.get("admin/school_years/edit/" + schoolYearId);

const saveSchoolYear = (schoolYearId, obj) =>
  dataService.put("admin/school_years/edit/" + schoolYearId, obj);

const addSchoolYear = (obj) => dataService.post("admin/school_years/new", obj);

const toggleAutoClassAssignment = (id) =>
  dataService.put("admin/school_years/toggle_auto_class_assignment/" + id);

const getManageStaffAssignments = () =>
  dataService.get("admin/staff_assignments/index");

const getManageStaffAssignment = (id) =>
  dataService.get("admin/staff_assignments/show/" + id);

const addNewFamily = (obj) =>
  dataService.post("registration/families/new", obj);

const getFamily = (id) => dataService.get("registration/families/show/" + id);

const getFamilyAddress = (familyId) =>
  dataService.get(`registration/families/edit_address/${familyId}`);

const saveFamilyAddress = (familyId, obj) =>
  dataService.put(`registration/families/edit_address/${familyId}`, obj);

const addParent = (familyId, obj) =>
  dataService.post("registration/families/add_parent/" + familyId, obj);

const addChild = (familyId, obj) =>
  dataService.post("registration/families/add_child/" + familyId, obj);

const getPeople = (currentPage, rowsPerPage, filter, sortedProp) =>
  dataService.get(
    `registration/people/index?limit=${rowsPerPage}&offset=${Math.trunc(
      (currentPage - 1) * rowsPerPage
    )}&searchText=${filter}`
  );

const getPerson = (id) => dataService.get(`registration/people/show/${id}`);

const getPersonalDetails = (personId, obj) =>
  dataService.get("registration/people/edit/" + personId);

const savePersonalDetails = (personId, obj) =>
  dataService.put("registration/people/edit/" + personId, obj);

const addPersonalAddress = (personId, obj) =>
  dataService.post("registration/people/new_address/" + personId, obj);

const savePersonalAddress = (personId, obj) =>
  dataService.put(`registration/people/edit_address/${personId}`, obj);

const getPersonalAddress = (personId) =>
  dataService.get(`registration/people/edit_address/${personId}`);

const saveBookCharges = (schoolYearId, obj) =>
  dataService.put(`admin/school_years/edit_book_charge/${schoolYearId}`, obj);

const getBookCharges = (schoolYearId) =>
  dataService.get(`admin/school_years/edit_book_charge/${schoolYearId}`);

const getActiveSchoolClasses = (schoolYearId) =>
  dataService.get(`registration/active_school_classes/index/${schoolYearId}`);

const getActiveSchoolClassGradeCount = (schoolYearId) =>
  dataService.get(
    `registration/active_school_classes/grade_student_count/${schoolYearId}`
  );

const getSchoolClassCount = (classType, schoolYearId) => {
  const classTypePathComponent = `${classType}_class_student_count`;
  return dataService.get(
    `registration/active_school_classes/${classTypePathComponent}/${schoolYearId}`
  );
};

const getSiblingInSameGradeReport = (schoolYearId) =>
  dataService.get(`registration/report/sibling_in_same_grade/${schoolYearId}`);

const getInstructorAssignmentForm = (id) => {
  if (id === "new") {
    return dataService.get(`registration/people/add_instructor_assignment/0`);
  } else {
    return dataService.get(
      `registration/people/add_instructor_assignment/${id}`
    );
  }
};

const addInstructorAssignment = (personId, obj) =>
  dataService.post(
    `registration/people/add_instructor_assignment?personId=${personId}`,
    obj
  );

const saveInstructorAssignment = (id, obj) =>
  dataService.put(`registration/people/add_instructor_assignment/${id}`, obj);

const deleteInstructorAssignment = (id) =>
  dataService.delete(`registration/instructor_assignments/destroy/${id}`);

const getActiveStudentsByName = () =>
  dataService.get(
    "registration/student_class_assignments/list_active_students_by_name"
  );

const obj = {
  addNewFamily,
  getFamily,
  getFamilyAddress,
  saveFamilyAddress,
  getGrades,
  addParent,
  addChild,
  getPeople,
  getSchoolClasses,
  getSchoolClass,
  saveSchoolClass,
  addSchoolClass,
  toggleActiveSchoolClass,
  getPerson,
  getSchoolYears,
  getSchoolYear,
  saveSchoolYear,
  addSchoolYear,
  toggleAutoClassAssignment,
  savePersonalDetails,
  getManageStaffAssignments,
  getManageStaffAssignment,
  getActiveSchoolClassesForCurrentNextSchoolYear,
  getActiveStudentsByName,
  addPersonalAddress,
  savePersonalAddress,
  getPersonalDetails,
  saveBookCharges,
  getBookCharges,
  getActiveSchoolClasses,
  getActiveSchoolClassGradeCount,
  getSiblingInSameGradeReport,
  getPersonalAddress,
  getSchoolClassCount,
  getInstructorAssignmentForm,
  addInstructorAssignment,
  saveInstructorAssignment,
  deleteInstructorAssignment,
};

export default obj;
