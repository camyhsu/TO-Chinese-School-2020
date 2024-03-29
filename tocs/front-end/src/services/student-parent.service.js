import dataService from "./data.service";

const getPersonalDetails = (personId) =>
  dataService.get(`student/people/edit/${personId}`);

const savePersonalDetails = (personId, obj) =>
  dataService.put(`student/people/edit/${personId}`, obj);

const getPersonalAddress = (personId) =>
  dataService.get(`student/people/edit_address/${personId}`);

const getFamilyAddress = (familyId) =>
  dataService.get(`student/families/edit_address/${familyId}`);

const addPersonalAddress = (personId, obj) =>
  dataService.post(`student/people/new_address/${personId}`, obj);

const savePersonalAddress = (personId, obj) =>
  dataService.put(`student/people/edit_address/${personId}`, obj);

const saveFamilyAddress = (familyId, obj) =>
  dataService.put(`student/families/edit_address/${familyId}`, obj);

const addParent = (familyId, obj) =>
  dataService.post("student/families/add_parent/" + familyId, obj);

const addChild = (familyId, obj) =>
  dataService.post("student/families/add_child/" + familyId, obj);

const getTransactionHistory = () =>
  dataService.get("student/transaction_history/index");

const getRegistrationPayment = (id, forStaff) =>
  dataService.get(
    `student/transaction_history/show_registration_payment${
      forStaff ? "_for_staff" : ""
    }/${id}`
  );

const getStudentRegistrationDisplayOptions = (schoolYearId) =>
  dataService.get(
    `student/registration/display_options?schoolYearId=${schoolYearId}`
  );

const saveRegistrationPreferences = (obj) =>
  dataService.post("student/registration/save_registration_preferences", obj);

const initializeRegistrationPayment = (ids) =>
  dataService.post("student/registration/payment_entry", ids);

const savePayment = (paymentId, payment) => {
  console.log("ssssssssssss");
  return dataService.post(
    `student/registration/submit_payment/${paymentId}`,
    payment
  );
};

const obj = {
  getPersonalDetails,
  savePersonalDetails,
  getPersonalAddress,
  getFamilyAddress,
  addPersonalAddress,
  savePersonalAddress,
  saveFamilyAddress,
  addParent,
  addChild,
  getTransactionHistory,
  getRegistrationPayment,
  getStudentRegistrationDisplayOptions,
  saveRegistrationPreferences,
  initializeRegistrationPayment,
  savePayment,
};

export default obj;
