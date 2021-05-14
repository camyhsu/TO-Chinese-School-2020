import controller from '../controllers/accounting.controller.js';

export default (router) => {
  router.get(
    '/accounting/instructors/discount',
    [],
    controller.getInstructorDiscounts,
  );

  router.get(
    '/accounting/registration_report/charges_collected_report/:schoolYearId',
    [],
    controller.getChargesCollected,
  );
};
