import dataService from './data.service';

const getAdminBoard = () => Promise.resolve('Admin');

const getStudentParentBoard = () => dataService.get('board/student-parent');

const savePerson = (personId, obj) => dataService.put('student/people/edit?personId=' + personId, obj);

const savePersonAddress = (personId, obj) => dataService.put('student/people/edit_address?personId=' + personId, obj);

const saveFamilyAddress = (familyId, obj) => dataService.put('student/families/edit_address?familyId=' + familyId, obj);

const addParent = (familyId, obj) => dataService.post('student/families/add_parent?familyId=' + familyId, obj);

const addChild = (familyId, obj) => dataService.post('student/families/add_child?familyId=' + familyId, obj);

const changePassword = (obj) => dataService.put('change-password', obj);

const obj = {
  getAdminBoard, getStudentParentBoard, savePerson, savePersonAddress, saveFamilyAddress, addParent, addChild, changePassword
};

export default obj;
