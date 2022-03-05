import dataService from "./data.service";

const getInstructorDiscounts = () =>
  dataService.get("accounting/instructors/discount");

const getChargesCollected = (schoolYearId) =>
  dataService.get(
    `accounting/registration_report/charges_collected_report/${schoolYearId}`
  );

const getDailyRegistrationSummary = (schoolYearId) =>
  dataService.get(
    `registration/report/daily_online_registration_summary/${schoolYearId}`
  );

const getInPersonRegistrationPayments = () =>
  dataService.get("accounting/in_person_registration_payments/index");

const getWithdrawRequests = () =>
  dataService.get("admin/withdraw_requests/index");

const getWithdrawRequest = (id) =>
  dataService.get(`admin/withdraw_requests/show/${id}`);

const obj = {
  getInstructorDiscounts,
  getChargesCollected,
  getWithdrawRequests,
  getDailyRegistrationSummary,
  getInPersonRegistrationPayments,
  getWithdrawRequest,
};

export default obj;
