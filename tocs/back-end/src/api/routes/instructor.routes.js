import controller from '../controllers/instructor.controller.js';
import registrationController from '../controllers/registration.controller.js';

export default (router) => {
  router.get(
    '/instruction/school_classes/show',
    [],
    controller.showSchoolClass,
  );
  router.get(
    '/instruction/active_school_classes/index',
    [],
    registrationController.getActiveSchoolClasses,
  );
};
