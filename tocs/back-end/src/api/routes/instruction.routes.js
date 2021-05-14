import controller from '../controllers/instruction.controller.js';
import registrationController from '../controllers/registration.controller.js';

export default (router) => {
  router.get(
    '/instruction/school_classes/show/:id',
    [],
    controller.showSchoolClass,
  );

  router.get(
    '/instruction/active_school_classes/index',
    [],
    registrationController.getActiveSchoolClasses,
  );
};
