import controller from '../controllers/instructor.controller.js';

export default (router) => {
  router.get(
    '/instruction/school_classes/show',
    [],
    controller.showSchoolClass,
  );
};
