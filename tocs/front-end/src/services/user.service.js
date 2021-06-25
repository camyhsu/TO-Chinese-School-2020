import dataService from './data.service';

const getAdminBoard = () => Promise.resolve('Admin');

const getStudentParentBoard = () => dataService.get('board/student-parent');

const changePassword = (obj) => dataService.put('change-password', obj);

const getRegistrationOfficerBoard = () => dataService.get('board/registration-officer');

const getAccountingOfficerBoard = () => dataService.get('board/accounting-officer');

const getPrincipalBoard = () => dataService.get('board/principal');

const getAcademicVicePrincipalBoard = () => dataService.get('board/academic-vice-principal');

const getAnnouncements = () => dataService.get('announcements');

const obj = {
  getAdminBoard, getStudentParentBoard, changePassword, getRegistrationOfficerBoard, getAccountingOfficerBoard,
  getPrincipalBoard, getAcademicVicePrincipalBoard, getAnnouncements,
};

export default obj;
