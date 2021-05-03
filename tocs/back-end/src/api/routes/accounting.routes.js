import controller from '../controllers/accounting.controller.js';

export default (router) => {
  router.get(
    '/accounting/instructors/discount',
    [],
    controller.getInstructorDiscounts,
  );
};
