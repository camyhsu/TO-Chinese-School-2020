import dataService from './data.service';

const getPersonalDetails = (personId) => dataService.get(`student/people/edit?id=${personId}`);

const savePersonalDetails = (personId, obj) => dataService.put(`student/people/edit?id=${personId}`, obj);

const getPersonalAddress = (personId) => dataService.get(`student/people/edit_address?id=${personId}`);

const getFamilyAddress = (familyId) => dataService.get(`student/families/edit_address?id=${familyId}`);

const addPersonalAddress = (personId, obj) => dataService.post(`student/people/new_address?id=${personId}`, obj);

const savePersonalAddress = (personId, obj) => dataService.put(`student/people/edit_address?id=${personId}`, obj);

const saveFamilyAddress = (familyId, obj) => dataService.put(`student/families/edit_address?id=${familyId}`, obj);

const addParent = (familyId, obj) => dataService.post('student/families/add_parent?id=' + familyId, obj);

const addChild = (familyId, obj) => dataService.post('student/families/add_child?id=' + familyId, obj);

const obj = {
    getPersonalDetails, savePersonalDetails,
    getPersonalAddress, getFamilyAddress, addPersonalAddress,
    savePersonalAddress, saveFamilyAddress,
    addParent, addChild
};

export default obj;