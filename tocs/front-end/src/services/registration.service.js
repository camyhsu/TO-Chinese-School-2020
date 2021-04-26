import dataService from './data.service';

const getGrades = () => dataService.get('admin/grades/index');

const getSchoolClasses = () => dataService.get('admin/school_classes/index');

const getActiveSchoolClassesForCurrentNextSchoolYear = () => dataService.get('admin/school_classes/active');

const getSchoolClass = (schoolYearId) => dataService.get('admin/school_classes/edit?id=' + schoolYearId);

const saveSchoolClass = (schoolYearId, obj) => dataService.put('admin/school_classes/edit?id=' + schoolYearId, obj);

const addSchoolClass = (obj) => dataService.post('admin/school_classes/new', obj);

const toggleActiveSchoolClass = (id, schoolYearId, active) => dataService.put(`admin/school_classes/toggle_active?id=${id}&schoolYearId=${schoolYearId}&active=${active}`);

const getSchoolYears = () => dataService.get('admin/school_years/index');

const getSchoolYear = (schoolYearId) => dataService.get('admin/school_years/edit?id=' + schoolYearId);

const saveSchoolYear = (schoolYearId, obj) => dataService.put('admin/school_years/edit?id=' + schoolYearId, obj);

const addSchoolYear = (obj) => dataService.post('admin/school_years/new', obj);

const toggleAutoClassAssignment = (id) => dataService.put('admin/school_years/toggle_auto_class_assignment?id=' + id);

const getManageStaffAssignments = () => dataService.get('admin/staff_assignments/index');

const getManageStaffAssignment = (id) => dataService.get('admin/staff_assignments/show?id=' + id);

const addNewFamily = (obj) => dataService.post('registration/families/new', obj);

const getFamily = (id) => dataService.get('registration/families/show?id=' + id);

const obj = {
    addNewFamily, getFamily, getGrades, 
    getSchoolClasses, getSchoolClass, saveSchoolClass, addSchoolClass, toggleActiveSchoolClass,
    getSchoolYears, getSchoolYear, saveSchoolYear, addSchoolYear, toggleAutoClassAssignment,
    getManageStaffAssignments, getManageStaffAssignment, getActiveSchoolClassesForCurrentNextSchoolYear
};

export default obj;