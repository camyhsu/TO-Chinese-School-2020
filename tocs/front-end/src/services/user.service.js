import dataService from './data.service';

const getAdminBoard = () => Promise.resolve('Admin');

const getStudentParentBoard = () => dataService.get('board/student-parent');

const changePassword = (obj) => dataService.put('change-password', obj);

const obj = {
  getAdminBoard, getStudentParentBoard, changePassword
};

export default obj;
