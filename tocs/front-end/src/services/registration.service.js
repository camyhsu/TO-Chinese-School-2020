import dataService from './data.service';

const getGrades = () => dataService.get('admin/grades/index');

const getSchoolYears = () => dataService.get('admin/school_years/index');

const getSchoolYear = (schoolYearId) => dataService.get('admin/school_years/edit?id=' + schoolYearId);

const saveSchoolYear = (schoolYearId, obj) => dataService.put('admin/school_years/edit?id=' + schoolYearId, obj);

const addSchoolYear = (obj) => dataService.post('admin/school_years/new', obj);

const toggleAutoClassAssignment = (id) => dataService.put('admin/school_years/toggle_auto_class_assignment?id=' + id);

const getManageStaffAssignments = () => dataService.get('admin/staff_assignments/index');

const getManageStaffAssignment = (id) => dataService.get('admin/staff_assignments/show?id=' + id);

const obj = {
    getGrades, getSchoolYears, getSchoolYear, saveSchoolYear, addSchoolYear, toggleAutoClassAssignment,
    getManageStaffAssignments, getManageStaffAssignment
};

export default obj;