import controller from "../controllers/accounting.controller.js";

export default (router) => {
  router.get(
    "/accounting/instructors/discount",
    [],
    controller.getInstructorDiscounts
  );

  router.get(
    "/accounting/registration_report/charges_collected_report/:schoolYearId",
    [],
    controller.getChargesCollected
  );

  router.get(
    "/accounting/manual_transactions/new",
    [],
    controller.initializeManualTransaction
  );

  router.get(
    "/accounting/manual_transactions/index",
    [],
    controller.getManualTransactionsForLastTwoYears
  );

  router.get(
    "/accounting/in_person_registration_payments/index",
    [],
    controller.getInPersonRegistrationPayments
  );

  router.post(
    "/accounting/manual_transactions/new",
    [],
    controller.addManualTransaction
  );

  router.get(
    "/admin/withdraw_requests/index",
    [],
    controller.getWithdrawRequests
  );

  router.get(
    "/admin/withdraw_requests/show/:id",
    [],
    controller.getWithdrawRequest
  );
};
